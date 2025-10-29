package core

import (
	"cyber-life/internal/core/config"
	"cyber-life/internal/core/initialize"
	"cyber-life/internal/repository"
	"cyber-life/pkg/logger"
	"fmt"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 11:08
// @Desc:	Web应用入口

func Start() {
	var err error

	// 初始化数据库连接
	db, err := initialize.InitDatabase()
	if err != nil {
		logger.Error("初始化数据库连接失败：", err)
		return
	}

	// 初始化数据仓储层
	err = repository.InitRepository(db)
	if err != nil {
		logger.Error("初始化数据仓储层失败：", err)
		return
	}

	// 初始化系统用户
	err = initialize.InitSystemUser()
	if err != nil {
		logger.Error("初始化系统用户失败：", err)
		return
	}

	// 启动Web服务引擎
	eng := initialize.InitWebEngine()
	listenAddr := fmt.Sprintf("%s:%d", config.Config.ListenAddr, config.Config.ListenPort)

	logger.Info("正在启动Web服务引擎，监听在 ", listenAddr)
	err = eng.Run(listenAddr)
	if err != nil {
		logger.Error("启动Web服务引擎失败：", err)
		return
	}
}
