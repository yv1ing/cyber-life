package config

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 11:09
// @Desc:	系统全局配置

type globalConfig struct {
	Mode       string
	SecretKey  string
	ListenAddr string
	ListenPort int
	Database   databaseConfig
}

var Config globalConfig
