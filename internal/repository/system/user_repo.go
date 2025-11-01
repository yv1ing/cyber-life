package system

import (
	"cyber-life/internal/repository"
	"errors"
	"gorm.io/gorm"

	systemmodel "cyber-life/internal/model/system"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 14:04
// @Desc:	系统用户数据操作实现

// CreateUser 创建用户
func CreateUser(user *systemmodel.User) error {
	return repository.Repo.DB.Create(user).Error
}

// SoftDeleteUser 删除用户（软删除）
func SoftDeleteUser(user *systemmodel.User) error {
	return repository.Repo.DB.Delete(user).Error
}

// HardDeleteUser 删除用户（硬删除）
func HardDeleteUser(user *systemmodel.User) error {
	return repository.Repo.DB.Unscoped().Delete(user).Error
}

// UpdateUser 更新用户
func UpdateUser(user *systemmodel.User) error {
	return repository.Repo.DB.Model(user).Updates(user).Error
}

// FindUserByID 根据ID查询用户
func FindUserByID(userID uint) (*systemmodel.User, error) {
	var user systemmodel.User

	err := repository.Repo.DB.First(&user, userID).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("record not found")
		}
		return nil, err
	}

	return &user, nil
}

// FindUserByUsername 根据Username查询用户
func FindUserByUsername(username string) (*systemmodel.User, error) {
	var user systemmodel.User

	err := repository.Repo.DB.Where("username = ?", username).First(&user).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("record not found")
		}
		return nil, err
	}

	return &user, nil
}

// FindUserByName 根据Name查询用户
func FindUserByName(name string) ([]systemmodel.User, error) {
	var users []systemmodel.User

	err := repository.Repo.DB.Where("name LIKE ?", "%"+name+"%").Find(&users).Error
	if err != nil {
		return nil, err
	}

	return users, nil
}

// FindUserListWithPage 分页查询用户列表
func FindUserListWithPage(page, size int) ([]systemmodel.User, int64, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 {
		size = 10
	}

	var users []systemmodel.User
	var total int64
	var err error

	query := repository.Repo.DB.Model(&systemmodel.User{})
	err = query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * size
	err = query.Offset(offset).Limit(size).Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, total, nil
}
