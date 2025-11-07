package common

import "gorm.io/gorm"

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/30 13:13
// @Desc:	主机记录数据模型

type Host struct {
	gorm.Model

	Provider       string         `json:"provider" gorm:"index" binding:"required"`
	ProviderURL    string         `json:"provider_url" gorm:"index" binding:"required"`
	Hostname       string         `json:"hostname" gorm:"index" binding:"required"`
	Address        string         `json:"address" gorm:"index" binding:"required"`
	Ports          map[string]string `json:"ports" gorm:"serializer:json" binding:"required"`
	Username       string         `json:"username" gorm:"index" binding:"required"`
	Password       string         `json:"password" binding:"required"`
	OS             string         `json:"os"`              // 操作系统
	Logo           string         `json:"logo"`            // 操作系统Logo文件名
	CpuNum         int            `json:"cpu_num"`         // CPU核心数
	RamSize        int            `json:"ram_size"`        // 内存大小（单位MB）
	DiskSize       int            `json:"disk_size"`       // 磁盘大小（单位MB）
	ExpirationTime int64          `json:"expiration_time"` // 到期时间（秒级时间戳）
}
