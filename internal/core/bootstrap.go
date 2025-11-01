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
		logger.Error("an error occurred while initializing the database connection: ", err)
		return
	}

	// 初始化数据仓储层
	err = repository.InitRepository(db)
	if err != nil {
		logger.Error("an error occurred while initializing the data warehouse layer: ", err)
		return
	}

	// 初始化系统用户
	err = initialize.InitSystemUser()
	if err != nil {
		logger.Error("an error occurred while initializing the system user: ", err)
		return
	}

	// 启动Web服务引擎
	eng := initialize.InitWebEngine()
	listenAddr := fmt.Sprintf("%s:%d", config.Config.ListenAddr, config.Config.ListenPort)

	logger.Info("starting the web service engine, listening on ", listenAddr)
	err = eng.Run(listenAddr)
	if err != nil {
		logger.Error("an error occurred while starting the web service engine: ", err)
		return
	}
}
