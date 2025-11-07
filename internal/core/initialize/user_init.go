package initialize

import (
	"cyber-life/internal/core/config"

	systemservice "cyber-life/internal/service/system"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 14:50
// @Desc:	初始化系统用户

func InitSystemUser() error {
	return systemservice.CreateUser(
		config.Config.User.Username,
		config.Config.User.Password,
		config.Config.User.Name,
		config.Config.User.Email,
		config.Config.User.Phone,
		config.Config.User.Avatar,
	)
}
