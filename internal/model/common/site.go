package common

import "gorm.io/gorm"

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/31 16:13
// @Desc:	站点信息数据模型

type Site struct {
	gorm.Model

	Name string `json:"name" gorm:"index"`
	Logo string `json:"logo"`
	URL  string `json:"url"`
}
