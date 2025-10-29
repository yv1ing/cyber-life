package main

import (
	"cyber-life/internal/core"
	"cyber-life/internal/core/initialize"
	"cyber-life/pkg/logger"
	"log"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 11:07
// @Desc:   程序主入口

func main() {
	var err error

	// 初始化系统全局配置
	err = initialize.InitGlobalConfig("config.toml")
	if err != nil {
		log.Fatal("加载配置文件失败：", err)
	}

	// 初始化系统全局日志
	logger.InitLogger("app.log", "debug")
	defer logger.Close()

	// 启动Web应用
	core.Start()
}
