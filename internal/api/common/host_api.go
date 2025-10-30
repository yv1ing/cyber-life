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
// @Date:   2025/10/30 13:13
// @Desc:	主机记录接口

// CreateHostHandler 创建主机记录
func CreateHostHandler(ctx *gin.Context) {
	type reqType struct {
		Provider    string         `json:"provider" binding:"required"`
		ProviderURL string         `json:"provider_url" binding:"required"`
		Hostname    string         `json:"hostname" binding:"required"`
		Address     string         `json:"address" binding:"required"`
		Ports       map[int]string `json:"ports" binding:"required"`
		Username    string         `json:"username" binding:"required"`
		Password    string         `json:"password" binding:"required"`
		OS          string         `json:"os"`
		CpuNum      int            `json:"cpu_num"`
		RamSize     int            `json:"ram_size"`
		DiskSize    int            `json:"disk_size"`
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

	err = commonservice.CreateHost(req.Provider, req.ProviderURL, req.Hostname, req.Address, req.Ports, req.Username, req.Password, req.OS, req.CpuNum, req.RamSize, req.DiskSize)
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

// DeleteHostHandler 删除主机记录（支持单个删除和批量删除）
func DeleteHostHandler(ctx *gin.Context) {
	type reqType struct {
		HostIDs []uint `json:"host_ids" binding:"required,min=1"`
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

	// 批量删除主机
	var failedCount int
	for _, id := range req.HostIDs {
		err = commonservice.DeleteHost(id, false)
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

// UpdateHostHandler 更新主机记录
func UpdateHostHandler(ctx *gin.Context) {
	type reqType struct {
		HostID      uint           `json:"host_id" binding:"required"`
		Provider    string         `json:"provider" binding:"required"`
		ProviderURL string         `json:"provider_url" binding:"required"`
		Hostname    string         `json:"hostname" binding:"required"`
		Address     string         `json:"address" binding:"required"`
		Ports       map[int]string `json:"ports" binding:"required"`
		Username    string         `json:"username" binding:"required"`
		Password    string         `json:"password" binding:"required"`
		OS          string         `json:"os"`
		CpuNum      int            `json:"cpu_num"`
		RamSize     int            `json:"ram_size"`
		DiskSize    int            `json:"disk_size"`
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

	err = commonservice.UpdateHost(req.HostID, req.Provider, req.ProviderURL, req.Hostname, req.Address, req.Ports, req.Username, req.Password, req.OS, req.CpuNum, req.RamSize, req.DiskSize)
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

// FindHostsHandler 搜索主机记录
func FindHostsHandler(ctx *gin.Context) {
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

	hosts, total, err := commonservice.FindHosts(keyword, page, size)
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
			"list":  hosts,
			"total": total,
		},
	})
}

// FindHostsListHandler 获取主机记录列表
func FindHostsListHandler(ctx *gin.Context) {
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

	hosts, total, err := commonservice.FindHostsList(page, size)
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
			"list":  hosts,
			"total": total,
		},
	})
}

// ExportHostsCSVHandler 导出主机记录为CSV文件
func ExportHostsCSVHandler(ctx *gin.Context) {
	filePath, err := commonservice.ExportHostsCSV()
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

// ImportHostsCSVHandler 从CSV文件导入主机记录
func ImportHostsCSVHandler(ctx *gin.Context) {
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

	result, err := commonservice.ImportHostsCSV(tempFilePath)
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

