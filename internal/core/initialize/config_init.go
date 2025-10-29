package initialize

import (
	"cyber-life/internal/core/config"
	"github.com/BurntSushi/toml"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 11:13
// @Desc:	加载配置文件，初始化全局配置

func InitGlobalConfig(path string) error {
	_, err := toml.DecodeFile(path, &config.Config)
	return err
}
