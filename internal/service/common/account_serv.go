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
// @Date:   2025/10/29 13:58
// @Desc:	账号记录服务

// ImportResult 导入结果
type ImportResult struct {
	SuccessCount int
	FailedCount  int
}

// CreateAccount 创建账号记录
func CreateAccount(platform, username, password, securityEmail, securityPhone, remark string) error {
	account := &commonmodel.Account{
		Platform:      platform,
		Username:      username,
		Password:      password,
		SecurityEmail: securityEmail,
		SecurityPhone: securityPhone,
		Remark:        remark,
	}

	return commonrepository.CreateAccount(account)
}

// DeleteAccount 删除账号记录
func DeleteAccount(accountID uint, hardDelete bool) error {
	account := &commonmodel.Account{}
	account.ID = accountID

	if hardDelete {
		return commonrepository.HardDeleteAccount(account)
	}
	return commonrepository.SoftDeleteAccount(account)
}

// UpdateAccount 更新账号记录
func UpdateAccount(accountID uint, platform, username, password, securityEmail, securityPhone, remark string) error {
	account := &commonmodel.Account{
		Platform:      platform,
		Username:      username,
		Password:      password,
		SecurityEmail: securityEmail,
		SecurityPhone: securityPhone,
		Remark:        remark,
	}
	account.ID = accountID

	return commonrepository.UpdateAccount(account)
}

// FindAccountsList 获取账号记录列表
func FindAccountsList(page, size int) ([]commonmodel.Account, int64, error) {
	return commonrepository.FindAccountsList(page, size)
}

// FindAccounts 搜索账号记录
func FindAccounts(keyword string, page, size int) ([]commonmodel.Account, int64, error) {
	return commonrepository.FindAccounts(keyword, page, size)
}

// ExportAccountsCSV 导出账号记录为CSV文件
func ExportAccountsCSV() (string, error) {
	tempDir := "temp"
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		return "", err
	}

	filename := fmt.Sprintf("accounts_%s.csv", time.Now().Format("20060102_150405"))
	filePath := filepath.Join(tempDir, filename)
	file, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	headers := []string{"ID", "平台", "账号", "密码", "安全邮箱", "安全电话", "备注", "创建时间", "更新时间"}
	err = writer.Write(headers)
	if err != nil {
		return "", err
	}

	accounts, _, err := commonrepository.FindAccountsList(1, 999999)
	if err != nil {
		return "", err
	}

	for _, account := range accounts {
		record := []string{
			strconv.FormatUint(uint64(account.ID), 10),
			account.Platform,
			account.Username,
			account.Password,
			account.SecurityEmail,
			account.SecurityPhone,
			account.Remark,
			account.CreatedAt.Format("2006-01-02 15:04:05"),
			account.UpdatedAt.Format("2006-01-02 15:04:05"),
		}
		err = writer.Write(record)
		if err != nil {
			return "", err
		}
	}

	return filePath, nil
}

// ImportAccountsCSV 从CSV文件导入账号记录
func ImportAccountsCSV(filePath string) (*ImportResult, error) {
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
		// CSV格式: 平台,账号,密码,安全邮箱,安全电话,备注（ID和时间字段会被忽略）
		if len(record) < 3 {
			failedCount++
			continue
		}

		platform := ""
		username := ""
		password := ""
		securityEmail := ""
		securityPhone := ""
		remark := ""

		if len(record) >= 9 {
			platform = record[1]
			username = record[2]
			password = record[3]
			if len(record) > 4 {
				securityEmail = record[4]
			}
			if len(record) > 5 {
				securityPhone = record[5]
			}
			if len(record) > 6 {
				remark = record[6]
			}
		} else {
			platform = record[0]
			username = record[1]
			password = record[2]
			if len(record) > 3 {
				securityEmail = record[3]
			}
			if len(record) > 4 {
				securityPhone = record[4]
			}
			if len(record) > 5 {
				remark = record[5]
			}
		}

		// 验证必填字段
		if platform == "" || username == "" || password == "" {
			failedCount++
			continue
		}

		// 创建账号记录
		err = CreateAccount(platform, username, password, securityEmail, securityPhone, remark)
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
