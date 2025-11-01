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
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	err = commonservice.CreateSite(req.Name, req.Logo, req.URL)
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

// DeleteSiteHandler 删除站点记录
func DeleteSiteHandler(ctx *gin.Context) {
	type reqType struct {
		SiteIDs []uint `json:"site_ids" binding:"required,min=1"`
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
	for _, id := range req.SiteIDs {
		err = commonservice.DeleteSite(id, false)
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

// UpdateSiteHandler 更新站点记录
func UpdateSiteHandler(ctx *gin.Context) {

	var rawData map[string]interface{}
	err := ctx.ShouldBindBodyWithJSON(&rawData)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	siteIDFloat, ok := rawData["site_id"].(float64)
	if !ok {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}
	siteID := uint(siteIDFloat)
	delete(rawData, "site_id")

	if len(rawData) == 0 {
		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: constant.SUCCESSFUL_DELETE,
			Info: "delete success",
		})
		return
	}

	err = commonservice.UpdateSiteFields(siteID, rawData)
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

	sites, total, err := commonservice.FindSites(keyword, page, size)
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

	sites, total, err := commonservice.FindSitesList(page, size)
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

// ImportSitesCSVHandler 从CSV文件导入站点记录
func ImportSitesCSVHandler(ctx *gin.Context) {
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

	result, err := commonservice.ImportSitesCSV(tempFilePath)
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
