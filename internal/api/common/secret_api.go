package common

import (
	"cyber-life/internal/constant"
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
		Logo        string `json:"logo"`
	}

	var req reqType
	err := ctx.ShouldBindBodyWithJSON(&req)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	err = commonservice.CreateSecret(req.Platform, req.PlatformURL, req.KeyID, req.KeySecret, req.Remark, req.Logo)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_CREATE,
		Info: "create success",
	})
}

// DeleteSecretHandler 删除密钥记录
func DeleteSecretHandler(ctx *gin.Context) {
	type reqType struct {
		SecretIDs []uint `json:"secret_ids" binding:"required,min=1"`
	}

	var req reqType
	err := ctx.ShouldBindBodyWithJSON(&req)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
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
			Code: constant.FAILED_TO_DELETE,
			Info: "delete failed",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_DELETE,
		Info: "delete success",
	})
}

// UpdateSecretHandler 更新密钥记录
func UpdateSecretHandler(ctx *gin.Context) {
	var rawData map[string]interface{}
	err := ctx.ShouldBindBodyWithJSON(&rawData)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	secretIDFloat, ok := rawData["secret_id"].(float64)
	if !ok {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}
	secretID := uint(secretIDFloat)
	delete(rawData, "secret_id")

	if len(rawData) == 0 {
		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: constant.SUCCESSFUL_DELETE,
			Info: "delete success",
		})
		return
	}

	err = commonservice.UpdateSecretFields(secretID, rawData)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_UPDATE,
		Info: "update success",
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
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}
	size, err = strconv.Atoi(ctx.DefaultQuery("size", "10"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	secrets, total, err := commonservice.FindSecrets(keyword, page, size)
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
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}
	size, err = strconv.Atoi(ctx.DefaultQuery("size", "10"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	secrets, total, err := commonservice.FindSecretsList(page, size)
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
			Code: constant.FAILED_TO_EXPORT,
			Info: "export failed",
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
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	ext := filepath.Ext(file.Filename)
	if ext != ".csv" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	tempDir := "temp"
	if err := os.MkdirAll(tempDir, 0755); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	tempFilePath := filepath.Join(tempDir, file.Filename)
	err = ctx.SaveUploadedFile(file, tempFilePath)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	defer os.Remove(tempFilePath)

	result, err := commonservice.ImportSecretsCSV(tempFilePath)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.FAILED_TO_IMPORT,
			Info: "import failed",
		})
		return
	}

	if result.FailedCount > 0 {
		ctx.AbortWithStatusJSON(http.StatusOK, systemmodel.Response{
			Code: constant.FAILED_TO_IMPORT,
			Info: "import failed",
			Data: gin.H{
				"success_count": result.SuccessCount,
				"failed_count":  result.FailedCount,
			},
		})
		return
	} else {
		ctx.AbortWithStatusJSON(http.StatusOK, systemmodel.Response{
			Code: constant.SUCCESSFUL_IMPORT,
			Info: "import success",
			Data: gin.H{
				"success_count": result.SuccessCount,
				"failed_count":  result.FailedCount,
			},
		})
		return
	}
}
