package router

import (
	"cyber-life/internal/middleware"
	"github.com/gin-gonic/gin"

	commonapi "cyber-life/internal/api/common"
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
	// 静态文件服务
	eng.Static("/css", "./web/css")
	eng.Static("/js", "./web/js")
	eng.Static("/lib", "./web/lib")
	eng.Static("/assets", "./web/assets")
	eng.Static("/platform-icons", "./data/platform_icons")
	eng.Static("/os-icons", "./data/os_icons")

	// HTML 页面路由
	eng.StaticFile("/", "./web/index.html")
	eng.StaticFile("/index.html", "./web/index.html")
	eng.StaticFile("/login.html", "./web/login.html")
	eng.StaticFile("/admin.html", "./web/admin.html")

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
	// 账号记录管理
	api.POST("/accounts/create", commonapi.CreateAccountHandler)
	api.DELETE("/accounts/delete", commonapi.DeleteAccountHandler)
	api.PUT("/accounts/update", commonapi.UpdateAccountHandler)
	api.GET("/accounts/find", commonapi.FindAccountsHandler)
	api.GET("/accounts/list", commonapi.FindAccountsListHandler)
	api.GET("/accounts/export", commonapi.ExportAccountsCSVHandler)
	api.POST("/accounts/import", commonapi.ImportAccountsCSVHandler)
	api.POST("/accounts/upload-platform-icon", commonapi.UploadPlatformIconHandler)
	api.GET("/accounts/platform-icons", commonapi.GetPlatformIconsListHandler)

	// 主机记录管理
	api.POST("/hosts/create", commonapi.CreateHostHandler)
	api.DELETE("/hosts/delete", commonapi.DeleteHostHandler)
	api.PUT("/hosts/update", commonapi.UpdateHostHandler)
	api.GET("/hosts/find", commonapi.FindHostsHandler)
	api.GET("/hosts/list", commonapi.FindHostsListHandler)
	api.GET("/hosts/export", commonapi.ExportHostsCSVHandler)
	api.POST("/hosts/import", commonapi.ImportHostsCSVHandler)
	api.POST("/hosts/upload-os-icon", commonapi.UploadOSIconHandler)
	api.GET("/hosts/os-icons", commonapi.GetOSIconsListHandler)

	// 密钥记录管理
	api.POST("/secrets/create", commonapi.CreateSecretHandler)
	api.DELETE("/secrets/delete", commonapi.DeleteSecretHandler)
	api.PUT("/secrets/update", commonapi.UpdateSecretHandler)
	api.GET("/secrets/find", commonapi.FindSecretsHandler)
	api.GET("/secrets/list", commonapi.FindSecretsListHandler)
	api.GET("/secrets/export", commonapi.ExportSecretsCSVHandler)
	api.POST("/secrets/import", commonapi.ImportSecretsCSVHandler)
}
