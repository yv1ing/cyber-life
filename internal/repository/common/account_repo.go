package common

import (
	"cyber-life/internal/repository"

	commonmodel "cyber-life/internal/model/common"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/29 13:48
// @Desc:	账号数据操作实现

// CreateAccount 创建账号记录
func CreateAccount(account *commonmodel.Account) error {
	return repository.Repo.DB.Create(account).Error
}

// SoftDeleteAccount 删除账号记录（软删除）
func SoftDeleteAccount(account *commonmodel.Account) error {
	return repository.Repo.DB.Delete(account).Error
}

// HardDeleteAccount 删除账号记录（硬删除）
func HardDeleteAccount(account *commonmodel.Account) error {
	return repository.Repo.DB.Unscoped().Delete(account).Error
}

// UpdateAccount 更新账号记录
func UpdateAccount(account *commonmodel.Account) error {
	return repository.Repo.DB.Model(account).Updates(account).Error
}

// UpdateAccountFields 更新账号记录（只更新指定字段）
func UpdateAccountFields(accountID uint, fields map[string]interface{}) error {
	return repository.Repo.DB.Model(&commonmodel.Account{}).Where("id = ?", accountID).Updates(fields).Error
}

// FindAccounts 查询账号记录
func FindAccounts(keyword string, page, size int) ([]commonmodel.Account, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 10
	}

	var accounts []commonmodel.Account
	var total int64

	// 构建查询条件
	query := repository.Repo.DB.Model(&commonmodel.Account{}).Where("platform LIKE ? OR username LIKE ?", "%"+keyword+"%", "%"+keyword+"%")

	// 获取总数
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 分页查询，按类型排序
	offset := (page - 1) * size
	err = query.Order("type ASC, id DESC").Offset(offset).Limit(size).Find(&accounts).Error
	if err != nil {
		return nil, 0, err
	}

	return accounts, total, nil
}

// FindAccountsList 获取账号记录列表
func FindAccountsList(page, size int) ([]commonmodel.Account, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 10
	}

	var accounts []commonmodel.Account
	var total int64
	var err error

	query := repository.Repo.DB.Model(&commonmodel.Account{})
	err = query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * size
	err = query.Order("type ASC, id DESC").Offset(offset).Limit(size).Find(&accounts).Error
	if err != nil {
		return nil, 0, err
	}

	return accounts, total, nil
}
