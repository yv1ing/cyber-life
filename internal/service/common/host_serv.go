package common

import (
	commonmodel "cyber-life/internal/model/common"
	commonrepository "cyber-life/internal/repository/common"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/30 13:13
// @Desc:	主机记录服务

// CreateHost 创建主机记录
func CreateHost(provider, providerURL, hostname, address string, ports map[int]string, username, password, os string, cpuNum, ramSize, diskSize int) error {
	host := &commonmodel.Host{
		Provider:    provider,
		ProviderURL: providerURL,
		Hostname:    hostname,
		Address:     address,
		Ports:       ports,
		Username:    username,
		Password:    password,
		OS:          os,
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
func UpdateHost(hostID uint, provider, providerURL, hostname, address string, ports map[int]string, username, password, os string, cpuNum, ramSize, diskSize int) error {
	host := &commonmodel.Host{
		Provider:    provider,
		ProviderURL: providerURL,
		Hostname:    hostname,
		Address:     address,
		Ports:       ports,
		Username:    username,
		Password:    password,
		OS:          os,
		CpuNum:      cpuNum,
		RamSize:     ramSize,
		DiskSize:    diskSize,
	}
	host.ID = hostID

	return commonrepository.UpdateHost(host)
}

// FindHostsList 获取主机记录列表
func FindHostsList(page, size int) ([]commonmodel.Host, int64, error) {
	return commonrepository.FindHostsList(page, size)
}

// FindHosts 搜索主机记录
func FindHosts(keyword string, page, size int) ([]commonmodel.Host, int64, error) {
	return commonrepository.FindHosts(keyword, page, size)
}
