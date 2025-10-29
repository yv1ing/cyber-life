package common

import (
	"github.com/gin-gonic/gin"
	"net/http"
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
		Platform      string `json:"platform" binding:"required"`
		Username      string `json:"username" binding:"required"`
		Password      string `json:"password" binding:"required"`
		SecurityEmail string `json:"security_email"`
		SecurityPhone string `json:"security_phone"`
		Remark        string `json:"remark"`
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

	err = commonservice.CreateAccount(req.Platform, req.Username, req.Password, req.SecurityEmail, req.SecurityPhone, req.Remark)
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

// DeleteAccountHandler 删除账号记录（支持单个删除和批量删除）
func DeleteAccountHandler(ctx *gin.Context) {
	type reqType struct {
		AccountIDs []uint `json:"account_ids" binding:"required,min=1"`
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

	// 批量删除账号
	var failedCount int
	for _, id := range req.AccountIDs {
		err = commonservice.DeleteAccount(id, false)
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

// UpdateAccountHandler 更新账号记录
func UpdateAccountHandler(ctx *gin.Context) {
	type reqType struct {
		AccountID     uint   `json:"account_id" binding:"required"`
		Platform      string `json:"platform"`
		Username      string `json:"username"`
		Password      string `json:"password"`
		SecurityEmail string `json:"security_email"`
		SecurityPhone string `json:"security_phone"`
		Remark        string `json:"remark"`
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

	err = commonservice.UpdateAccount(req.AccountID, req.Platform, req.Username, req.Password, req.SecurityEmail, req.SecurityPhone, req.Remark)
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
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}
	size, err = strconv.Atoi(ctx.DefaultQuery("size", "15"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	accounts, err := commonservice.FindAccounts(keyword, page, size)
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
			"list":  accounts,
			"total": len(accounts),
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
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}
	size, err = strconv.Atoi(ctx.DefaultQuery("size", "15"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	accounts, total, err := commonservice.FindAccountsList(page, size)
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
			"list":  accounts,
			"total": total,
		},
	})
}
