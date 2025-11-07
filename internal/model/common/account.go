package common

import "gorm.io/gorm"

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/29 13:44
// @Desc:	账号记录数据模型

type Account struct {
	gorm.Model

	Type          string `json:"type" gorm:"index" binding:"required"`
	Platform      string `json:"platform" gorm:"index" binding:"required"`
	PlatformURL   string `json:"platform_url" gorm:"index" binding:"required"`
	Username      string `json:"username" gorm:"index" binding:"required"`
	Password      string `json:"password" binding:"required"`
	SecurityEmail string `json:"security_email"`
	SecurityPhone string `json:"security_phone"`
	Remark        string `json:"remark"`
	Logo          string `json:"logo"`
}
