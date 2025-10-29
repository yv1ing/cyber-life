package common

import "gorm.io/gorm"

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/29 13:44
// @Desc:	账号记录数据模型

type Account struct {
	gorm.Model

	Platform      string `json:"platform" gorm:"index"`
	Username      string `json:"username" gorm:"index"`
	Password      string `json:"password"`
	SecurityEmail string `json:"security_email"`
	SecurityPhone string `json:"security_phone"`
	Remark        string `json:"remark"`
}
