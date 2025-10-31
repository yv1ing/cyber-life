package common

import (
	"github.com/gin-gonic/gin"
	"net/http"

	systemmodel "cyber-life/internal/model/system"
	commonservice "cyber-life/internal/service/common"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/31
// @Desc:   图标管理接口

// UploadPlatformIconHandler 上传平台图标
func UploadPlatformIconHandler(ctx *gin.Context) {
	platform := ctx.PostForm("platform")
	if platform == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "平台名称不能为空",
		})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	// 使用公共服务上传图标（完整流程）
	iconsDir := "data/platform_icons"
	filename, err := commonservice.UploadIcon(platform, iconsDir, file)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "上传成功",
		Data: gin.H{
			"icon": filename,
		},
	})
}

// GetPlatformIconsListHandler 获取已有平台图标列表
func GetPlatformIconsListHandler(ctx *gin.Context) {
	iconsDir := "data/platform_icons"

	// 使用公共服务获取图标列表
	icons, err := commonservice.GetIconsList(iconsDir)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "获取图标列表失败",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "查询成功",
		Data: gin.H{
			"icons": icons,
		},
	})
}

// UploadOSIconHandler 上传操作系统图标
func UploadOSIconHandler(ctx *gin.Context) {
	osName := ctx.PostForm("os")
	if osName == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "操作系统名称不能为空",
		})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	// 使用公共服务上传图标（完整流程）
	osIconsDir := "data/os_icons"
	filename, err := commonservice.UploadIcon(osName, osIconsDir, file)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "上传成功",
		Data: gin.H{
			"icon": filename,
		},
	})
}

// GetOSIconsListHandler 获取已有操作系统图标列表
func GetOSIconsListHandler(ctx *gin.Context) {
	osIconsDir := "data/os_icons"

	// 使用公共服务获取图标列表
	icons, err := commonservice.GetIconsList(osIconsDir)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "获取图标列表失败",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "查询成功",
		Data: gin.H{
			"icons": icons,
		},
	})
}
