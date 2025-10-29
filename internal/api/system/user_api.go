package system

import (
	"cyber-life/internal/core/config"
	"cyber-life/pkg/auth"
	"cyber-life/pkg/encrypt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"

	systemmodel "cyber-life/internal/model/system"
	systemservice "cyber-life/internal/service/system"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 15:09
// @Desc:	系统用户接口实现

// UserLoginHandler 系统用户登入
func UserLoginHandler(ctx *gin.Context) {
	type reqType struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var req reqType
	if err := ctx.ShouldBind(&req); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	user, err := systemservice.FindUserByUsername(req.Username)
	if err != nil {
		if err.Error() == "记录不存在" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, systemmodel.Response{
				Code: http.StatusUnauthorized,
				Info: "账号或密码错误",
			})
			return
		} else {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
				Code: http.StatusInternalServerError,
				Info: "系统内部错误",
			})
			return
		}
	}

	if user.Password != encrypt.Sha256String(req.Password, config.Config.SecretKey) {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, systemmodel.Response{
			Code: http.StatusUnauthorized,
			Info: "账号或密码错误",
		})
		return
	}

	jwtSign := encrypt.RandomString(32)
	jwtToken, err := auth.CreateAccessToken(user.ID, user.Username, config.Config.SecretKey, jwtSign)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
	}

	user.JwtSign = jwtSign
	err = systemservice.UpdateUser(user.ID, "", "", "", "", "", "", jwtSign)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "请求成功",
		Data: gin.H{
			"jwt_token": jwtToken,
		},
	})
}

// UserLogoutHandler 系统用户登出
func UserLogoutHandler(ctx *gin.Context) {
	userID := ctx.MustGet("user_id")
	user, err := systemservice.FindUserByID(userID.(uint))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
		return
	}

	err = systemservice.UpdateUser(user.ID, "", "", "", "", "", "", "-")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "请求成功",
	})
}

// CreateUserHandler 创建系统用户
func CreateUserHandler(ctx *gin.Context) {
	type reqType struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Name     string `json:"name"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
		Avatar   string `json:"avatar"`
	}

	var (
		req reqType
		err error
	)
	err = ctx.ShouldBindBodyWithJSON(&req)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	err = systemservice.CreateUser(req.Username, req.Password, req.Name, req.Email, req.Phone, req.Avatar)
	if err != nil {
		if err.Error() == "用户名已经存在" {
			ctx.AbortWithStatusJSON(http.StatusAlreadyReported, systemmodel.Response{
				Code: http.StatusAlreadyReported,
				Info: "用户名已经存在",
			})
			return
		} else {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
				Code: http.StatusInternalServerError,
				Info: "系统内部错误",
			})
			return
		}
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "请求成功",
	})
}

// DeleteUserHandler 删除系统用户
func DeleteUserHandler(ctx *gin.Context) {
	userID, err := strconv.Atoi(ctx.Query("user_id"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	err = systemservice.DeleteUser(uint(userID))
	if err != nil {
		if err.Error() == "记录不存在" {
			ctx.AbortWithStatusJSON(http.StatusNotFound, systemmodel.Response{
				Code: http.StatusNotFound,
				Info: "记录不存在",
			})
			return
		} else {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
				Code: http.StatusInternalServerError,
				Info: "系统内部错误",
			})
			return
		}
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "请求成功",
	})
}

// UpdateUserHandler 更新系统用户
func UpdateUserHandler(ctx *gin.Context) {
	type reqType struct {
		UserID   uint   `json:"user_id"`
		Username string `json:"username"`
		Password string `json:"password"`
		Name     string `json:"name"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
		Avatar   string `json:"avatar"`
	}

	var (
		req reqType
		err error
	)

	err = ctx.ShouldBindBodyWithJSON(&req)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	err = systemservice.UpdateUser(req.UserID, req.Username, req.Password, req.Name, req.Email, req.Phone, req.Avatar, "")
	if err != nil {
		if err.Error() == "记录不存在" {
			ctx.AbortWithStatusJSON(http.StatusNotFound, systemmodel.Response{
				Code: http.StatusNotFound,
				Info: "记录不存在",
			})
			return
		} else if err.Error() == "用户名已被使用" {
			ctx.AbortWithStatusJSON(http.StatusAlreadyReported, systemmodel.Response{
				Code: http.StatusAlreadyReported,
				Info: "用户名已被使用",
			})
			return
		} else {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
				Code: http.StatusInternalServerError,
				Info: "系统内部错误",
			})
			return
		}
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "请求成功",
	})
}

// FindUserHandler 条件查询系统用户
func FindUserHandler(ctx *gin.Context) {
	switch ctx.Query("type") {
	case "user_id":
		userID, err := strconv.Atoi(ctx.Query("user_id"))
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
				Code: http.StatusBadRequest,
				Info: "请求参数非法",
			})
			return
		}
		user, err := systemservice.FindUserByID(uint(userID))
		if err != nil {
			if err.Error() == "记录不存在" {
				ctx.AbortWithStatusJSON(http.StatusNotFound, systemmodel.Response{
					Code: http.StatusNotFound,
					Info: "记录不存在",
				})
				return
			} else {
				ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
					Code: http.StatusInternalServerError,
					Info: "系统内部错误",
				})
				return
			}
		}

		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: http.StatusOK,
			Info: "请求成功",
			Data: gin.H{
				"total": 1,
				"users": []systemmodel.User{*user},
			},
		})
		break

	case "username":
		username := ctx.Query("username")
		user, err := systemservice.FindUserByUsername(username)
		if err != nil {
			if err.Error() == "记录不存在" {
				ctx.AbortWithStatusJSON(http.StatusNotFound, systemmodel.Response{
					Code: http.StatusNotFound,
					Info: "记录不存在",
				})
				return
			} else {
				ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
					Code: http.StatusInternalServerError,
					Info: "系统内部错误",
				})
				return
			}
		}

		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: http.StatusOK,
			Info: "请求成功",
			Data: gin.H{
				"total": 1,
				"users": []systemmodel.User{*user},
			},
		})
		break

	case "name":
		name := ctx.Query("name")
		users, err := systemservice.FindUserByName(name)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
				Code: http.StatusInternalServerError,
				Info: "系统内部错误",
			})
			return
		}
		if len(users) == 0 {
			ctx.AbortWithStatusJSON(http.StatusNotFound, systemmodel.Response{
				Code: http.StatusNotFound,
				Info: "记录不存在",
			})
			return
		}

		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: http.StatusOK,
			Info: "请求成功",
			Data: gin.H{
				"total": len(users),
				"users": users,
			},
		})
		break

	default:
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}
}

// ListUserHandler 分页查询系统用户列表
func ListUserHandler(ctx *gin.Context) {
	_page := ctx.DefaultQuery("page", "1")
	_size := ctx.DefaultQuery("size", "10")

	page, err := strconv.Atoi(_page)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}
	size, err := strconv.Atoi(_size)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: http.StatusBadRequest,
			Info: "请求参数非法",
		})
		return
	}

	users, total, err := systemservice.FindUserListWithPage(page, size)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: http.StatusInternalServerError,
			Info: "系统内部错误",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: http.StatusOK,
		Info: "请求成功",
		Data: gin.H{
			"users": users,
			"total": total,
		},
	})
}
