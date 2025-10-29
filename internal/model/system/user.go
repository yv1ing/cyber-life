package system

import "gorm.io/gorm"

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 11:56
// @Desc:	系统用户数据模型

type User struct {
	gorm.Model

	Username string `json:"username" gorm:"index"`
	Password string `json:"-"`

	Name   string `json:"name" gorm:"index"`
	Email  string `json:"email"`
	Phone  string `json:"phone"`
	Avatar string `json:"avatar"`

	JwtSign  string `json:"jwt_sign"`
	IsActive bool   `json:"is_active"`
}
