package common

import (
	"cyber-life/internal/constant"
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
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	iconsDir := "data/platform_icons"
	filename, err := commonservice.UploadIcon(platform, iconsDir, file)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_UPLOAD,
		Info: "upload success",
		Data: gin.H{
			"icon": filename,
		},
	})
}

// GetPlatformIconsListHandler 获取已有平台图标列表
func GetPlatformIconsListHandler(ctx *gin.Context) {
	iconsDir := "data/platform_icons"

	icons, err := commonservice.GetIconsList(iconsDir)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_FIND,
		Info: "find success",
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
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	osIconsDir := "data/os_icons"
	filename, err := commonservice.UploadIcon(osName, osIconsDir, file)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_UPLOAD,
		Info: "upload success",
		Data: gin.H{
			"icon": filename,
		},
	})
}

// GetOSIconsListHandler 获取已有操作系统图标列表
func GetOSIconsListHandler(ctx *gin.Context) {
	osIconsDir := "data/os_icons"

	icons, err := commonservice.GetIconsList(osIconsDir)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_FIND,
		Info: "find success",
		Data: gin.H{
			"icons": icons,
		},
	})
}

// UploadSiteIconHandler 上传站点图标
func UploadSiteIconHandler(ctx *gin.Context) {
	siteName := ctx.PostForm("site")
	if siteName == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	iconsDir := "data/site_icons"
	filename, err := commonservice.UploadIcon(siteName, iconsDir, file)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_UPLOAD,
		Info: "upload success",
		Data: gin.H{
			"icon": filename,
		},
	})
}

// GetSiteIconsListHandler 获取已有站点图标列表
func GetSiteIconsListHandler(ctx *gin.Context) {
	iconsDir := "data/site_icons"

	icons, err := commonservice.GetIconsList(iconsDir)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_FIND,
		Info: "find success",
		Data: gin.H{
			"icons": icons,
		},
	})
}
