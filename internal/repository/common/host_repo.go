package common

import (
	"cyber-life/internal/repository"

	commonmodel "cyber-life/internal/model/common"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/30 13:13
// @Desc:	主机数据操作实现

// CreateHost 创建主机记录
func CreateHost(host *commonmodel.Host) error {
	return repository.Repo.DB.Create(host).Error
}

// SoftDeleteHost 删除主机记录（软删除）
func SoftDeleteHost(host *commonmodel.Host) error {
	return repository.Repo.DB.Delete(host).Error
}

// HardDeleteHost 删除主机记录（硬删除）
func HardDeleteHost(host *commonmodel.Host) error {
	return repository.Repo.DB.Unscoped().Delete(host).Error
}

// UpdateHost 更新主机记录
func UpdateHost(host *commonmodel.Host) error {
	return repository.Repo.DB.Model(host).Updates(host).Error
}

// FindHosts 查询主机记录
func FindHosts(keyword string, page, size int) ([]commonmodel.Host, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 10
	}

	var hosts []commonmodel.Host
	var total int64

	// 构建查询条件
	query := repository.Repo.DB.Model(&commonmodel.Host{}).Where("provider LIKE ? OR hostname LIKE ? OR address LIKE ?", "%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%")

	// 获取总数
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 分页查询
	offset := (page - 1) * size
	err = query.Offset(offset).Limit(size).Find(&hosts).Error
	if err != nil {
		return nil, 0, err
	}

	return hosts, total, nil
}

// FindHostsList 获取主机记录列表
func FindHostsList(page, size int) ([]commonmodel.Host, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 10
	}

	var hosts []commonmodel.Host
	var total int64
	var err error

	query := repository.Repo.DB.Model(&commonmodel.Host{})
	err = query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * size
	err = query.Offset(offset).Limit(size).Find(&hosts).Error
	if err != nil {
		return nil, 0, err
	}

	return hosts, total, nil
}
