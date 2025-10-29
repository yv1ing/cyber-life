package initialize

import (
	"cyber-life/internal/core/config"
	"cyber-life/internal/router"
	"github.com/gin-gonic/gin"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 11:27
// @Desc:	初始化Web服务引擎

func InitWebEngine() *gin.Engine {
	gin.SetMode(config.Config.Mode)

	eng := gin.New()
	router.InitRouter(eng)

	return eng
}
