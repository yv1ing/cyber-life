package common

import (
	"cyber-life/internal/repository"

	commonmodel "cyber-life/internal/model/common"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/30
// @Desc:	密钥数据操作实现

// CreateSecret 创建密钥记录
func CreateSecret(secret *commonmodel.Secret) error {
	return repository.Repo.DB.Create(secret).Error
}

// SoftDeleteSecret 删除密钥记录（软删除）
func SoftDeleteSecret(secret *commonmodel.Secret) error {
	return repository.Repo.DB.Delete(secret).Error
}

// HardDeleteSecret 删除密钥记录（硬删除）
func HardDeleteSecret(secret *commonmodel.Secret) error {
	return repository.Repo.DB.Unscoped().Delete(secret).Error
}

// UpdateSecret 更新密钥记录
func UpdateSecret(secret *commonmodel.Secret) error {
	return repository.Repo.DB.Model(secret).Updates(secret).Error
}

// FindSecrets 查询密钥记录
func FindSecrets(keyword string, page, size int) ([]commonmodel.Secret, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 10
	}

	var secrets []commonmodel.Secret
	var total int64

	// 构建查询条件
	query := repository.Repo.DB.Model(&commonmodel.Secret{}).Where("platform LIKE ? OR key_id LIKE ?", "%"+keyword+"%", "%"+keyword+"%")

	// 获取总数
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 分页查询
	offset := (page - 1) * size
	err = query.Offset(offset).Limit(size).Find(&secrets).Error
	if err != nil {
		return nil, 0, err
	}

	return secrets, total, nil
}

// FindSecretsList 获取密钥记录列表
func FindSecretsList(page, size int) ([]commonmodel.Secret, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 10
	}

	var secrets []commonmodel.Secret
	var total int64
	var err error

	query := repository.Repo.DB.Model(&commonmodel.Secret{})
	err = query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * size
	err = query.Offset(offset).Limit(size).Find(&secrets).Error
	if err != nil {
		return nil, 0, err
	}

	return secrets, total, nil
}
