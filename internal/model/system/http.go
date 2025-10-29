package system

import "github.com/gin-gonic/gin"

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 15:16
// @Desc:	系统Http响应统一格式

type Response struct {
	Code int    `json:"code"`
	Info string `json:"info"`
	Data gin.H  `json:"data"`
}
