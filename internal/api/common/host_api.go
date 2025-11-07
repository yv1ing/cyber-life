package common

import (
	"cyber-life/internal/constant"
	"encoding/json"
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
		Provider       string            `json:"provider" binding:"required"`
		ProviderURL    string            `json:"provider_url" binding:"required"`
		Hostname       string            `json:"hostname" binding:"required"`
		Address        string            `json:"address" binding:"required"`
		Ports          map[string]string `json:"ports" binding:"required"`
		Username       string            `json:"username" binding:"required"`
		Password       string            `json:"password" binding:"required"`
		OS             string            `json:"os"`
		Logo           string            `json:"logo"`
		CpuNum         int               `json:"cpu_num"`
		RamSize        int               `json:"ram_size"`
		DiskSize       int               `json:"disk_size"`
		ExpirationTime int64             `json:"expiration_time"`
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

	err = commonservice.CreateHost(req.Provider, req.ProviderURL, req.Hostname, req.Address, req.Ports, req.Username, req.Password, req.OS, req.Logo, req.CpuNum, req.RamSize, req.DiskSize, req.ExpirationTime)
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

// DeleteHostHandler 删除主机记录
func DeleteHostHandler(ctx *gin.Context) {
	type reqType struct {
		HostIDs []uint `json:"host_ids" binding:"required,min=1"`
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

// UpdateHostHandler 更新主机记录
func UpdateHostHandler(ctx *gin.Context) {
	var rawData map[string]interface{}
	err := ctx.ShouldBindBodyWithJSON(&rawData)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	// 提取host_id
	hostIDFloat, ok := rawData["host_id"].(float64)
	if !ok {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}
	hostID := uint(hostIDFloat)
	delete(rawData, "host_id")

	if len(rawData) == 0 {
		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: constant.SUCCESSFUL_DELETE,
			Info: "delete success",
		})
		return
	}

	if portsInterface, exists := rawData["ports"]; exists {
		if portsMap, ok := portsInterface.(map[string]interface{}); ok {
			convertedPorts := make(map[string]string)
			for k, v := range portsMap {
				if strValue, ok := v.(string); ok {
					convertedPorts[k] = strValue
				}
			}
			portsJSON, err := json.Marshal(convertedPorts)
			if err != nil {
				ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
					Code: constant.INVALID_REQUEST_PARAMS,
					Info: "invalid ports format",
				})
				return
			}
			rawData["ports"] = string(portsJSON)
		}
	}

	err = commonservice.UpdateHostFields(hostID, rawData)
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

	hosts, total, err := commonservice.FindHosts(keyword, page, size)
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

	hosts, total, err := commonservice.FindHostsList(page, size)
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

// ImportHostsCSVHandler 从CSV文件导入主机记录
func ImportHostsCSVHandler(ctx *gin.Context) {
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

	result, err := commonservice.ImportHostsCSV(tempFilePath)
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
