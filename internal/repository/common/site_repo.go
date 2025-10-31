package common

import (
	"cyber-life/internal/repository"

	commonmodel "cyber-life/internal/model/common"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/31
// @Desc:	站点数据操作实现

// CreateSite 创建站点记录
func CreateSite(site *commonmodel.Site) error {
	return repository.Repo.DB.Create(site).Error
}

// SoftDeleteSite 删除站点记录（软删除）
func SoftDeleteSite(site *commonmodel.Site) error {
	return repository.Repo.DB.Delete(site).Error
}

// HardDeleteSite 删除站点记录（硬删除）
func HardDeleteSite(site *commonmodel.Site) error {
	return repository.Repo.DB.Unscoped().Delete(site).Error
}

// UpdateSite 更新站点记录
func UpdateSite(site *commonmodel.Site) error {
	// 使用map来更新，这样可以更新零值字段（如空字符串）
	updates := make(map[string]interface{})

	// 只更新非零值字段
	if site.Name != "" {
		updates["name"] = site.Name
	}
	// Logo字段始终更新（即使为空）
	updates["logo"] = site.Logo
	if site.URL != "" {
		updates["url"] = site.URL
	}

	return repository.Repo.DB.Model(&commonmodel.Site{}).Where("id = ?", site.ID).Updates(updates).Error
}

// UpdateSiteFields 更新站点记录（只更新指定字段）
func UpdateSiteFields(siteID uint, fields map[string]interface{}) error {
	return repository.Repo.DB.Model(&commonmodel.Site{}).Where("id = ?", siteID).Updates(fields).Error
}

// FindSites 查询站点记录
func FindSites(keyword string, page, size int) ([]commonmodel.Site, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 10
	}

	var sites []commonmodel.Site
	var total int64

	// 构建查询条件
	query := repository.Repo.DB.Model(&commonmodel.Site{}).Where("name LIKE ? OR url LIKE ?", "%"+keyword+"%", "%"+keyword+"%")

	// 获取总数
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// 分页查询
	offset := (page - 1) * size
	err = query.Offset(offset).Limit(size).Find(&sites).Error
	if err != nil {
		return nil, 0, err
	}

	return sites, total, nil
}

// FindSitesList 获取站点记录列表
func FindSitesList(page, size int) ([]commonmodel.Site, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 10
	}

	var sites []commonmodel.Site
	var total int64
	var err error

	query := repository.Repo.DB.Model(&commonmodel.Site{})
	err = query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * size
	err = query.Offset(offset).Limit(size).Find(&sites).Error
	if err != nil {
		return nil, 0, err
	}

	return sites, total, nil
}
