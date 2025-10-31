package common

import "gorm.io/gorm"

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/30 15:08
// @Desc:	密钥记录数据模型

type Secret struct {
	gorm.Model

	Platform    string `json:"platform" gorm:"index" binding:"required"`
	PlatformURL string `json:"platform_url" gorm:"index" binding:"required"`
	KeyID       string `json:"key_id" binding:"required"`
	KeySecret   string `json:"key_secret" binding:"required"`
	Remark      string `json:"remark"`
	Logo        string `json:"logo"`
}
