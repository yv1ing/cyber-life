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
// @Date:   2025/10/29 13:58
// @Desc:	账号记录接口

// CreateAccountHandler 创建账号记录
func CreateAccountHandler(ctx *gin.Context) {
	type reqType struct {
		Type          string `json:"type" binding:"required"`
		Platform      string `json:"platform" binding:"required"`
		PlatformURL   string `json:"platform_url" binding:"required"`
		Username      string `json:"username" binding:"required"`
		Password      string `json:"password" binding:"required"`
		SecurityEmail string `json:"security_email"`
		SecurityPhone string `json:"security_phone"`
		Remark        string `json:"remark"`
		Logo          string `json:"logo"`
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

	err = commonservice.CreateAccount(req.Type, req.Platform, req.PlatformURL, req.Username, req.Password, req.SecurityEmail, req.SecurityPhone, req.Remark, req.Logo)
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

// DeleteAccountHandler 删除账号记录
func DeleteAccountHandler(ctx *gin.Context) {
	type reqType struct {
		AccountIDs []uint `json:"account_ids" binding:"required,min=1"`
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

	var failedCount int
	for _, id := range req.AccountIDs {
		err = commonservice.DeleteAccount(id, false)
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

// UpdateAccountHandler 更新账号记录
func UpdateAccountHandler(ctx *gin.Context) {
	var rawData map[string]interface{}
	err := ctx.ShouldBindBodyWithJSON(&rawData)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	accountIDFloat, ok := rawData["account_id"].(float64)
	if !ok {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}
	accountID := uint(accountIDFloat)
	delete(rawData, "account_id")

	if len(rawData) == 0 {
		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: constant.SUCCESSFUL_DELETE,
			Info: "delete success",
		})
		return
	}

	err = commonservice.UpdateAccountFields(accountID, rawData)
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

// FindAccountsHandler 搜索账号记录
func FindAccountsHandler(ctx *gin.Context) {
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

	accounts, total, err := commonservice.FindAccounts(keyword, page, size)
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
			"list":  accounts,
			"total": total,
		},
	})
}

// FindAccountsListHandler 获取账号记录列表
func FindAccountsListHandler(ctx *gin.Context) {
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

	accounts, total, err := commonservice.FindAccountsList(page, size)
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
			"list":  accounts,
			"total": total,
		},
	})
}

// ExportAccountsCSVHandler 导出账号记录为CSV文件
func ExportAccountsCSVHandler(ctx *gin.Context) {
	filePath, err := commonservice.ExportAccountsCSV()
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

// ImportAccountsCSVHandler 从CSV文件导入账号记录
func ImportAccountsCSVHandler(ctx *gin.Context) {
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

	result, err := commonservice.ImportAccountsCSV(tempFilePath)
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
