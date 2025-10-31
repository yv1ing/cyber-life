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
// @Date:   2025/10/30
// @Desc:	密钥记录服务

// CreateSecret 创建密钥记录
func CreateSecret(platform, platformURL, keyID, keySecret, remark string) error {
	secret := &commonmodel.Secret{
		Platform:    platform,
		PlatformURL: platformURL,
		KeyID:       keyID,
		KeySecret:   keySecret,
		Remark:      remark,
	}

	return commonrepository.CreateSecret(secret)
}

// DeleteSecret 删除密钥记录
func DeleteSecret(secretID uint, hardDelete bool) error {
	secret := &commonmodel.Secret{}
	secret.ID = secretID

	if hardDelete {
		return commonrepository.HardDeleteSecret(secret)
	}
	return commonrepository.SoftDeleteSecret(secret)
}

// UpdateSecret 更新密钥记录
func UpdateSecret(secretID uint, platform, platformURL, keyID, keySecret, remark string) error {
	secret := &commonmodel.Secret{
		Platform:    platform,
		PlatformURL: platformURL,
		KeyID:       keyID,
		KeySecret:   keySecret,
		Remark:      remark,
	}
	secret.ID = secretID

	return commonrepository.UpdateSecret(secret)
}

// FindSecretsList 获取密钥记录列表
func FindSecretsList(page, size int) ([]commonmodel.Secret, int64, error) {
	return commonrepository.FindSecretsList(page, size)
}

// FindSecrets 搜索密钥记录
func FindSecrets(keyword string, page, size int) ([]commonmodel.Secret, int64, error) {
	return commonrepository.FindSecrets(keyword, page, size)
}

// ExportSecretsCSV 导出密钥记录为CSV文件
func ExportSecretsCSV() (string, error) {
	tempDir := "temp"
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		return "", err
	}

	filename := fmt.Sprintf("secrets_%s.csv", time.Now().Format("20060102_150405"))
	filePath := filepath.Join(tempDir, filename)
	file, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	headers := []string{"ID", "平台", "平台链接", "密钥ID", "密钥Secret", "备注", "创建时间", "更新时间"}
	err = writer.Write(headers)
	if err != nil {
		return "", err
	}

	secrets, _, err := commonrepository.FindSecretsList(1, 999999)
	if err != nil {
		return "", err
	}

	for _, secret := range secrets {
		record := []string{
			strconv.FormatUint(uint64(secret.ID), 10),
			secret.Platform,
			secret.PlatformURL,
			secret.KeyID,
			secret.KeySecret,
			secret.Remark,
			secret.CreatedAt.Format("2006-01-02 15:04:05"),
			secret.UpdatedAt.Format("2006-01-02 15:04:05"),
		}
		err = writer.Write(record)
		if err != nil {
			return "", err
		}
	}

	return filePath, nil
}

// ImportSecretsCSV 从CSV文件导入密钥记录
func ImportSecretsCSV(filePath string) (*ImportResult, error) {
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
		return nil, fmt.Errorf("CSV文件为空或格式不正确")
	}

	importedCount := 0
	failedCount := 0
	for _, record := range records[1:] {
		// CSV格式: 平台,平台链接,密钥ID,密钥Secret,备注（ID和时间字段会被忽略）
		if len(record) < 4 {
			failedCount++
			continue
		}

		platform := ""
		platformURL := ""
		keyID := ""
		keySecret := ""
		remark := ""

		if len(record) >= 8 {
			// 完整格式：ID, 平台, 平台链接, 密钥ID, 密钥Secret, 备注, 创建时间, 更新时间
			platform = record[1]
			platformURL = record[2]
			keyID = record[3]
			keySecret = record[4]
			if len(record) > 5 {
				remark = record[5]
			}
		} else {
			// 简化格式：平台, 平台链接, 密钥ID, 密钥Secret, 备注
			platform = record[0]
			platformURL = record[1]
			keyID = record[2]
			keySecret = record[3]
			if len(record) > 4 {
				remark = record[4]
			}
		}

		// 验证必填字段
		if platform == "" || platformURL == "" || keyID == "" || keySecret == "" {
			failedCount++
			continue
		}

		// 创建密钥记录
		err = CreateSecret(platform, platformURL, keyID, keySecret, remark)
		if err != nil {
			failedCount++
			continue
		}

		importedCount++
	}

	return &ImportResult{
		SuccessCount: importedCount,
		FailedCount:  failedCount,
	}, nil
}
