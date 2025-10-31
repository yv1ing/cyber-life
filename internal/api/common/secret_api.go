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
// @Date:   2025/10/30
// @Desc:	密钥记录接口

// CreateSecretHandler 创建密钥记录
func CreateSecretHandler(ctx *gin.Context) {
	type reqType struct {
		Platform    string `json:"platform" binding:"required"`
		PlatformURL string `json:"platform_url" binding:"required"`
		KeyID       string `json:"key_id" binding:"required"`
		KeySecret   string `json:"key_secret" binding:"required"`
		Remark      string `json:"remark"`
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

	err = commonservice.CreateSecret(req.Platform, req.PlatformURL, req.KeyID, req.KeySecret, req.Remark)
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

// DeleteSecretHandler 删除密钥记录（支持单个删除和批量删除）
func DeleteSecretHandler(ctx *gin.Context) {
	type reqType struct {
		SecretIDs []uint `json:"secret_ids" binding:"required,min=1"`
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

	// 批量删除密钥
	var failedCount int
	for _, id := range req.SecretIDs {
		err = commonservice.DeleteSecret(id, false)
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

// UpdateSecretHandler 更新密钥记录
func UpdateSecretHandler(ctx *gin.Context) {
	type reqType struct {
		SecretID    uint   `json:"secret_id" binding:"required"`
		Platform    string `json:"platform" binding:"required"`
		PlatformURL string `json:"platform_url" binding:"required"`
		KeyID       string `json:"key_id" binding:"required"`
		KeySecret   string `json:"key_secret" binding:"required"`
		Remark      string `json:"remark"`
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

	err = commonservice.UpdateSecret(req.SecretID, req.Platform, req.PlatformURL, req.KeyID, req.KeySecret, req.Remark)
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

// FindSecretsHandler 搜索密钥记录
func FindSecretsHandler(ctx *gin.Context) {
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

	secrets, total, err := commonservice.FindSecrets(keyword, page, size)
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
			"list":  secrets,
			"total": total,
		},
	})
}

// FindSecretsListHandler 获取密钥记录列表
func FindSecretsListHandler(ctx *gin.Context) {
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

	secrets, total, err := commonservice.FindSecretsList(page, size)
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
			"list":  secrets,
			"total": total,
		},
	})
}

// ExportSecretsCSVHandler 导出密钥记录为CSV文件
func ExportSecretsCSVHandler(ctx *gin.Context) {
	filePath, err := commonservice.ExportSecretsCSV()
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

// ImportSecretsCSVHandler 从CSV文件导入密钥记录
func ImportSecretsCSVHandler(ctx *gin.Context) {
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

	result, err := commonservice.ImportSecretsCSV(tempFilePath)
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
