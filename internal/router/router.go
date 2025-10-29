package router

import (
	"cyber-life/internal/middleware"
	"github.com/gin-gonic/gin"

	systemapi "cyber-life/internal/api/system"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 15:07
// @Desc:	初始化Web应用路由

var whitelist = []string{
	`^/api/sys/users/login$`,
}

func InitRouter(eng *gin.Engine) {
	// 全局中间件
	eng.Use(middleware.JwtAuthMiddleware(whitelist))

	api := eng.Group("/api")

	// 系统内置路由
	sys := api.Group("/sys")

	sys.POST("/users/login", systemapi.UserLoginHandler)
	sys.POST("/users/logout", systemapi.UserLogoutHandler)
	sys.POST("/users/create", systemapi.CreateUserHandler)
	sys.DELETE("/users/delete", systemapi.DeleteUserHandler)
	sys.PUT("/users/update", systemapi.UpdateUserHandler)
	sys.GET("/users/find", systemapi.FindUserHandler)
	sys.GET("/users/list", systemapi.ListUserHandler)

	// 实际业务路由
}
