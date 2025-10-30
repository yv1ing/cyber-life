package common

import "gorm.io/gorm"

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/30 15:08
// @Desc:	密钥记录数据模型

type Secret struct {
	gorm.Model

	Platform  string `json:"platform" gorm:"index"`
	KeyID     string `json:"key_id"`
	KeySecret string `json:"key_secret"`
	Remark    string `json:"remark"`
}
