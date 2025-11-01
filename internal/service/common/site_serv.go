package common

import (
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	commonmodel "cyber-life/internal/model/common"
	commonrepository "cyber-life/internal/repository/common"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/31
// @Desc:	站点记录服务

// CreateSite 创建站点记录
func CreateSite(name, logo, url string) error {
	site := &commonmodel.Site{
		Name: name,
		Logo: logo,
		URL:  url,
	}

	return commonrepository.CreateSite(site)
}

// DeleteSite 删除站点记录
func DeleteSite(siteID uint, hardDelete bool) error {
	site := &commonmodel.Site{}
	site.ID = siteID

	if hardDelete {
		return commonrepository.HardDeleteSite(site)
	}
	return commonrepository.SoftDeleteSite(site)
}

// UpdateSite 更新站点记录
func UpdateSite(siteID uint, name, logo, url string) error {
	site := &commonmodel.Site{
		Name: name,
		Logo: logo,
		URL:  url,
	}
	site.ID = siteID

	return commonrepository.UpdateSite(site)
}

// UpdateSiteFields 更新站点记录（只更新指定字段）
func UpdateSiteFields(siteID uint, fields map[string]interface{}) error {
	return commonrepository.UpdateSiteFields(siteID, fields)
}

// FindSitesList 获取站点记录列表
func FindSitesList(page, size int) ([]commonmodel.Site, int64, error) {
	return commonrepository.FindSitesList(page, size)
}

// FindSites 搜索站点记录
func FindSites(keyword string, page, size int) ([]commonmodel.Site, int64, error) {
	return commonrepository.FindSites(keyword, page, size)
}

// ExportSitesCSV 导出站点记录为CSV文件
func ExportSitesCSV() (string, error) {
	tempDir := "temp"
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		return "", err
	}

	filename := fmt.Sprintf("sites_%s.csv", time.Now().Format("20060102_150405"))
	filePath := filepath.Join(tempDir, filename)
	file, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	headers := []string{"ID", "站点名称", "Logo", "站点链接", "创建时间", "更新时间"}
	err = writer.Write(headers)
	if err != nil {
		return "", err
	}

	sites, _, err := commonrepository.FindSitesList(1, 999999)
	if err != nil {
		return "", err
	}

	for _, site := range sites {
		record := []string{
			strconv.FormatUint(uint64(site.ID), 10),
			site.Name,
			site.Logo,
			site.URL,
			site.CreatedAt.Format("2006-01-02 15:04:05"),
			site.UpdatedAt.Format("2006-01-02 15:04:05"),
		}
		err = writer.Write(record)
		if err != nil {
			return "", err
		}
	}

	return filePath, nil
}

// ImportSitesCSV 从CSV文件导入站点记录
func ImportSitesCSV(filePath string) (*commonmodel.ImportResult, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	if len(records) < 2 {
		return nil, fmt.Errorf("invalid cvs file format")
	}

	importedCount := 0
	failedCount := 0
	for _, record := range records[1:] {
		// CSV格式: 站点名称,Logo,站点链接（ID和时间字段会被忽略）
		if len(record) < 2 {
			failedCount++
			continue
		}

		name := ""
		logo := ""
		url := ""

		if len(record) >= 6 {
			// 完整格式：ID, 站点名称, Logo, 站点链接, 创建时间, 更新时间
			name = record[1]
			logo = record[2]
			url = record[3]
		} else {
			// 简化格式：站点名称, Logo, 站点链接
			name = record[0]
			if len(record) > 1 {
				logo = record[1]
			}
			if len(record) > 2 {
				url = record[2]
			}
		}

		// 验证必填字段
		if name == "" || url == "" {
			failedCount++
			continue
		}

		// 创建站点记录
		err = CreateSite(name, logo, url)
		if err != nil {
			failedCount++
			continue
		}

		importedCount++
	}

	return &commonmodel.ImportResult{
		SuccessCount: importedCount,
		FailedCount:  failedCount,
	}, nil
}
