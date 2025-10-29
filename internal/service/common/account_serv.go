package common

import (
	commonmodel "cyber-life/internal/model/common"
	commonrepository "cyber-life/internal/repository/common"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/29 13:58
// @Desc:	账号记录服务

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
func FindAccounts(keyword string, page, size int) ([]commonmodel.Account, error) {
	return commonrepository.FindAccounts(keyword, page, size)
}
