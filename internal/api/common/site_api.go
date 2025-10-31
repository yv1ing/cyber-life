package common

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	systemmodel "cyber-life/internal/model/system"
	commonservice "cyber-life/internal/service/common"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/31
// @Desc:	站点记录接口

// CreateSiteHandler 创建站点记录
func CreateSiteHandler(ctx *gin.Context) {
	type reqType struct {
		Name string `json:"name" binding:"required"`
		Logo string `json:"logo"`
		URL  string `json:"url" binding:"required"`
	}

	var req reqType
	err := ctx.ShouldBindBodyWithJSON(&req)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	err = commonservice.CreateSite(req.Name, req.Logo, req.URL)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "创建成功",
	})
}

// DeleteSiteHandler 删除站点记录（支持单个删除和批量删除）
func DeleteSiteHandler(ctx *gin.Context) {
	type reqType struct {
		SiteIDs []uint `json:"site_ids" binding:"required,min=1"`
	}

	var req reqType
	err := ctx.ShouldBindBodyWithJSON(&req)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	// 批量删除站点
	var failedCount int
	for _, id := range req.SiteIDs {
		err = commonservice.DeleteSite(id, false)
		if err != nil {
			failedCount++
		}
	}

	if failedCount > 0 {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "部分删除失败",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "删除成功",
	})
}

// UpdateSiteHandler 更新站点记录
func UpdateSiteHandler(ctx *gin.Context) {
	// 先绑定到map以获取所有字段
	var rawData map[string]interface{}
	err := ctx.ShouldBindBodyWithJSON(&rawData)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	// 提取site_id
	siteIDFloat, ok := rawData["site_id"].(float64)
	if !ok {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}
	siteID := uint(siteIDFloat)

	// 移除site_id，剩余的就是要更新的字段
	delete(rawData, "site_id")

	// 只有当有字段需要更新时才调用service
	if len(rawData) == 0 {
		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: http.StatusOK,
			Info: "没有字段需要更新",
		})
		return
	}

	err = commonservice.UpdateSiteFields(siteID, rawData)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "更新成功",
	})
}

// FindSitesHandler 搜索站点记录
func FindSitesHandler(ctx *gin.Context) {
	var (
		err     error
		page    int
		size    int
		keyword string
	)

	keyword = ctx.DefaultQuery("keyword", "")
	page, err = strconv.Atoi(ctx.DefaultQuery("page", "1"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}
	size, err = strconv.Atoi(ctx.DefaultQuery("size", "10"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	sites, total, err := commonservice.FindSites(keyword, page, size)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "查询成功",
		Data: gin.H{
			"list":  sites,
			"total": total,
		},
	})
}

// FindSitesListHandler 获取站点记录列表
func FindSitesListHandler(ctx *gin.Context) {
	var (
		err  error
		page int
		size int
	)

	page, err = strconv.Atoi(ctx.DefaultQuery("page", "1"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}
	size, err = strconv.Atoi(ctx.DefaultQuery("size", "10"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	sites, total, err := commonservice.FindSitesList(page, size)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "查询成功",
		Data: gin.H{
			"list":  sites,
			"total": total,
		},
	})
}

// ExportSitesCSVHandler 导出站点记录为CSV文件
func ExportSitesCSVHandler(ctx *gin.Context) {
	filePath, err := commonservice.ExportSitesCSV()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "导出CSV失败",
		})
		return
	}
	defer os.Remove(filePath)

	filename := filepath.Base(filePath)
	ctx.Header("Content-Description", "File Transfer")
	ctx.Header("Content-Transfer-Encoding", "binary")
	ctx.Header("Content-Disposition", "attachment; filename="+filename)
	ctx.Header("Content-Type", "text/csv; charset=utf-8")

	ctx.File(filePath)
}

// ImportSitesCSVHandler 从CSV文件导入站点记录
func ImportSitesCSVHandler(ctx *gin.Context) {
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	ext := filepath.Ext(file.Filename)
	if ext != ".csv" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	tempDir := "temp"
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
		return
	}

	tempFilePath := filepath.Join(tempDir, file.Filename)
	err = ctx.SaveUploadedFile(file, tempFilePath)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
		return
	}

	defer os.Remove(tempFilePath)

	result, err := commonservice.ImportSitesCSV(tempFilePath)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "导入CSV失败",
		})
		return
	}

	// 构造详细的响应消息
	var message string
	if result.FailedCount > 0 {
		message = fmt.Sprintf("导入完成：成功 %d 条，失败 %d 条", result.SuccessCount, result.FailedCount)
	} else {
		message = "导入CSV成功"
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: message,
		Data: gin.H{
			"success_count": result.SuccessCount,
			"failed_count":  result.FailedCount,
		},
	})
}
