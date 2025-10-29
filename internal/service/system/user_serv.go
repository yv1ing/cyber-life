package system

import (
	"cyber-life/internal/core/config"
	"cyber-life/pkg/encrypt"
	"errors"

	systemmodel "cyber-life/internal/model/system"
	systemrepository "cyber-life/internal/repository/system"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 14:35
// @Desc:	系统用户服务实现

// CreateUser 创建用户
func CreateUser(username, password, name, email, phone, avatar string) error {
	preUser, err := systemrepository.FindUserByUsername(username)
	if err != nil && err.Error() != "记录不存在" {
		return err
	}
	if preUser != nil {
		return errors.New("用户名已经存在")
	}

	password = encrypt.Sha256String(password, config.Config.SecretKey)

	newUser := &systemmodel.User{
		Username: username,
		Password: password,
		Name:     name,
		Email:    email,
		Phone:    phone,
		Avatar:   avatar,
		IsActive: true,
	}

	return systemrepository.CreateUser(newUser)
}

// DeleteUser 删除用户
func DeleteUser(userID uint) error {
	user, err := systemrepository.FindUserByID(userID)
	if err != nil {
		return err
	}

	user.IsActive = false
	user.JwtSign = "-"
	err = systemrepository.UpdateUser(user)
	if err != nil {
		return err
	}

	return systemrepository.SoftDeleteUser(user)
}

// UpdateUser 更新用户
func UpdateUser(userID uint, username, password, name, email, phone, avatar, jwtSign string) error {
	user, err := systemrepository.FindUserByID(userID)
	if err != nil {
		return err
	}

	if username != "" && username != user.Username {
		existUser, _ := systemrepository.FindUserByUsername(username)
		if existUser != nil {
			return errors.New("用户名已被使用")
		}
		user.Username = username
	}
	if password != "" {
		user.Password = encrypt.Sha256String(password, config.Config.SecretKey)
	}
	if name != "" {
		user.Name = name
	}
	if email != "" {
		user.Email = email
	}
	if phone != "" {
		user.Phone = phone
	}
	if avatar != "" {
		user.Avatar = avatar
	}
	if jwtSign != "" {
		user.JwtSign = jwtSign
	}

	return systemrepository.UpdateUser(user)
}

// FindUserByID 根据ID查询用户
func FindUserByID(userID uint) (*systemmodel.User, error) {
	return systemrepository.FindUserByID(userID)
}

// FindUserByUsername 根据Username查询用户
func FindUserByUsername(username string) (*systemmodel.User, error) {
	return systemrepository.FindUserByUsername(username)
}

// FindUserByName 根据Name查询用户
func FindUserByName(name string) ([]systemmodel.User, error) {
	return systemrepository.FindUserByName(name)
}

// FindUserListWithPage 分页查询用户列表
func FindUserListWithPage(page, size int) ([]systemmodel.User, int64, error) {
	return systemrepository.FindUserListWithPage(page, size)
}
