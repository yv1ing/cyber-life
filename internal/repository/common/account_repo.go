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

// FindAccounts 查询账号记录
func FindAccounts(keyword string, page, size int) ([]commonmodel.Account, error) {
	var accounts []commonmodel.Account

	offset := (page - 1) * size
	err := repository.Repo.DB.Where("platform LIKE ? OR username LIKE ?", "%"+keyword+"%", "%"+keyword+"%").Offset(offset).Limit(size).Find(&accounts).Error
	if err != nil {
		return nil, err
	}
	return accounts, nil
}

// FindAccountsList 获取账号记录列表
func FindAccountsList(page, size int) ([]commonmodel.Account, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 15
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
	err = query.Offset(offset).Limit(size).Find(&accounts).Error
	if err != nil {
		return nil, 0, err
	}

	return accounts, total, nil
}
