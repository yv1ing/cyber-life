package repository

import "gorm.io/gorm"

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 11:47
// @Desc:	数据仓储层，对数据模型的操作抽象

type repository struct {
	DB *gorm.DB
}

var Repo repository

// InitRepository 初始化数据仓储
func InitRepository(db *gorm.DB) error {
	Repo.DB = db

	return nil
}
