package common

import (
	"encoding/csv"
	"encoding/json"
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
// @Date:   2025/10/30 13:13
// @Desc:	主机记录服务

// CreateHost 创建主机记录
func CreateHost(provider, providerURL, hostname, address string, ports map[int]string, username, password, os, logo string, cpuNum, ramSize, diskSize int) error {
	host := &commonmodel.Host{
		Provider:    provider,
		ProviderURL: providerURL,
		Hostname:    hostname,
		Address:     address,
		Ports:       ports,
		Username:    username,
		Password:    password,
		OS:          os,
		Logo:        logo,
		CpuNum:      cpuNum,
		RamSize:     ramSize,
		DiskSize:    diskSize,
	}

	return commonrepository.CreateHost(host)
}

// DeleteHost 删除主机记录
func DeleteHost(hostID uint, hardDelete bool) error {
	host := &commonmodel.Host{}
	host.ID = hostID

	if hardDelete {
		return commonrepository.HardDeleteHost(host)
	}
	return commonrepository.SoftDeleteHost(host)
}

// UpdateHost 更新主机记录
func UpdateHost(hostID uint, provider, providerURL, hostname, address string, ports map[int]string, username, password, os, logo string, cpuNum, ramSize, diskSize int) error {
	host := &commonmodel.Host{
		Provider:    provider,
		ProviderURL: providerURL,
		Hostname:    hostname,
		Address:     address,
		Ports:       ports,
		Username:    username,
		Password:    password,
		OS:          os,
		Logo:        logo,
		CpuNum:      cpuNum,
		RamSize:     ramSize,
		DiskSize:    diskSize,
	}
	host.ID = hostID

	return commonrepository.UpdateHost(host)
}

// UpdateHostFields 更新主机记录（只更新指定字段）
func UpdateHostFields(hostID uint, fields map[string]interface{}) error {
	return commonrepository.UpdateHostFields(hostID, fields)
}

// FindHostsList 获取主机记录列表
func FindHostsList(page, size int) ([]commonmodel.Host, int64, error) {
	return commonrepository.FindHostsList(page, size)
}

// FindHosts 搜索主机记录
func FindHosts(keyword string, page, size int) ([]commonmodel.Host, int64, error) {
	return commonrepository.FindHosts(keyword, page, size)
}

// ExportHostsCSV 导出主机记录为CSV文件
func ExportHostsCSV() (string, error) {
	tempDir := "temp"
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		return "", err
	}

	filename := fmt.Sprintf("hosts_%s.csv", time.Now().Format("20060102_150405"))
	filePath := filepath.Join(tempDir, filename)
	file, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	headers := []string{"ID", "提供商", "提供商链接", "主机名", "地址", "端口映射", "用户名", "密码", "操作系统", "Logo", "CPU核心数", "内存大小(MB)", "磁盘大小(MB)", "创建时间", "更新时间"}
	err = writer.Write(headers)
	if err != nil {
		return "", err
	}

	hosts, _, err := commonrepository.FindHostsList(1, 999999)
	if err != nil {
		return "", err
	}

	for _, host := range hosts {
		// 将 Ports map 序列化为 JSON 字符串
		portsJSON, err := json.Marshal(host.Ports)
		if err != nil {
			portsJSON = []byte("{}")
		}

		record := []string{
			strconv.FormatUint(uint64(host.ID), 10),
			host.Provider,
			host.ProviderURL,
			host.Hostname,
			host.Address,
			string(portsJSON),
			host.Username,
			host.Password,
			host.OS,
			host.Logo,
			strconv.Itoa(host.CpuNum),
			strconv.Itoa(host.RamSize),
			strconv.Itoa(host.DiskSize),
			host.CreatedAt.Format("2006-01-02 15:04:05"),
			host.UpdatedAt.Format("2006-01-02 15:04:05"),
		}
		err = writer.Write(record)
		if err != nil {
			return "", err
		}
	}

	return filePath, nil
}

// ImportHostsCSV 从CSV文件导入主机记录
func ImportHostsCSV(filePath string) (*commonmodel.ImportResult, error) {
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
		// CSV格式: 提供商,提供商链接,主机名,地址,端口映射,用户名,密码,操作系统,Logo,CPU核心数,内存大小,磁盘大小（ID和时间字段会被忽略）
		if len(record) < 7 {
			failedCount++
			continue
		}

		provider := ""
		providerURL := ""
		hostname := ""
		address := ""
		portsStr := ""
		username := ""
		password := ""
		os := ""
		logo := ""
		cpuNum := 0
		ramSize := 0
		diskSize := 0

		if len(record) >= 15 {
			// 完整格式：ID, 提供商, 提供商链接, 主机名, 地址, 端口映射, 用户名, 密码, 操作系统, Logo, CPU核心数, 内存大小, 磁盘大小, 创建时间, 更新时间
			provider = record[1]
			providerURL = record[2]
			hostname = record[3]
			address = record[4]
			portsStr = record[5]
			username = record[6]
			password = record[7]
			if len(record) > 8 {
				os = record[8]
			}
			if len(record) > 9 {
				logo = record[9]
			}
			if len(record) > 10 {
				cpuNum, _ = strconv.Atoi(record[10])
			}
			if len(record) > 11 {
				ramSize, _ = strconv.Atoi(record[11])
			}
			if len(record) > 12 {
				diskSize, _ = strconv.Atoi(record[12])
			}
		} else {
			// 简化格式：提供商, 提供商链接, 主机名, 地址, 端口映射, 用户名, 密码, 操作系统, Logo, CPU核心数, 内存大小, 磁盘大小
			provider = record[0]
			providerURL = record[1]
			hostname = record[2]
			address = record[3]
			portsStr = record[4]
			username = record[5]
			password = record[6]
			if len(record) > 7 {
				os = record[7]
			}
			if len(record) > 8 {
				logo = record[8]
			}
			if len(record) > 9 {
				cpuNum, _ = strconv.Atoi(record[9])
			}
			if len(record) > 10 {
				ramSize, _ = strconv.Atoi(record[10])
			}
			if len(record) > 11 {
				diskSize, _ = strconv.Atoi(record[11])
			}
		}

		// 解析端口映射 JSON
		var ports map[int]string
		if portsStr != "" {
			err := json.Unmarshal([]byte(portsStr), &ports)
			if err != nil {
				failedCount++
				continue
			}
		} else {
			ports = make(map[int]string)
		}

		// 验证必填字段
		if provider == "" || providerURL == "" || hostname == "" || address == "" || username == "" || password == "" {
			failedCount++
			continue
		}

		// 创建主机记录
		err = CreateHost(provider, providerURL, hostname, address, ports, username, password, os, logo, cpuNum, ramSize, diskSize)
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
