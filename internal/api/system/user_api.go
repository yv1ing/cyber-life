package system

import (
	"cyber-life/internal/constant"
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
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	user, err := systemservice.FindUserByUsername(req.Username)
	if err != nil {
		if err.Error() == "record not found" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, systemmodel.Response{
				Code: constant.FAILED_TO_LOGIN,
				Info: "incorrect username or password",
			})
			return
		} else {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
				Code: constant.INTERNAL_ERROR,
				Info: "system internal error",
			})
			return
		}
	}

	if user.Password != encrypt.Sha256String(req.Password, config.Config.SecretKey) {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, systemmodel.Response{
			Code: constant.FAILED_TO_LOGIN,
			Info: "incorrect username or password",
		})
		return
	}

	jwtSign := encrypt.RandomString(32)
	jwtToken, err := auth.CreateAccessToken(user.ID, user.Username, config.Config.SecretKey, jwtSign)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
	}

	user.JwtSign = jwtSign
	err = systemservice.UpdateUser(user.ID, "", "", "", "", "", "", jwtSign)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_LOGIN,
		Info: "login success",
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
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	err = systemservice.UpdateUser(user.ID, "", "", "", "", "", "", "-")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
			Code: constant.INTERNAL_ERROR,
			Info: "system internal error",
		})
		return
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_LOGOUT,
		Info: "logout success",
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
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	err = systemservice.CreateUser(req.Username, req.Password, req.Name, req.Email, req.Phone, req.Avatar)
	if err != nil {
		if err.Error() == "the username already exists" {
			ctx.AbortWithStatusJSON(http.StatusAlreadyReported, systemmodel.Response{
				Code: constant.USERNAME_ALREADY_EXISTS,
				Info: "username already exists",
			})
			return
		} else {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
				Code: constant.INTERNAL_ERROR,
				Info: "system internal error",
			})
			return
		}
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_CREATE,
		Info: "create success",
	})
}

// DeleteUserHandler 删除系统用户
func DeleteUserHandler(ctx *gin.Context) {
	userID, err := strconv.Atoi(ctx.Query("user_id"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	err = systemservice.DeleteUser(uint(userID))
	if err != nil {
		if err.Error() == "record not found" {
			ctx.AbortWithStatusJSON(http.StatusNotFound, systemmodel.Response{
				Code: constant.RECORD_NOT_FOUND,
				Info: "record not found",
			})
			return
		} else {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
				Code: constant.INTERNAL_ERROR,
				Info: "system internal error",
			})
			return
		}
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_DELETE,
		Info: "delete success",
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
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	err = systemservice.UpdateUser(req.UserID, req.Username, req.Password, req.Name, req.Email, req.Phone, req.Avatar, "")
	if err != nil {
		if err.Error() == "record not found" {
			ctx.AbortWithStatusJSON(http.StatusNotFound, systemmodel.Response{
				Code: constant.RECORD_NOT_FOUND,
				Info: "record not found",
			})
			return
		} else if err.Error() == "the username already exists" {
			ctx.AbortWithStatusJSON(http.StatusAlreadyReported, systemmodel.Response{
				Code: constant.USERNAME_ALREADY_EXISTS,
				Info: "the username already exists",
			})
			return
		} else {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
				Code: constant.INTERNAL_ERROR,
				Info: "system internal error",
			})
			return
		}
	}

	ctx.JSON(http.StatusOK, systemmodel.Response{
		Code: constant.SUCCESSFUL_UPDATE,
		Info: "update success",
	})
}

// FindUserHandler 条件查询系统用户
func FindUserHandler(ctx *gin.Context) {
	switch ctx.Query("type") {
	case "user_id":
		userID, err := strconv.Atoi(ctx.Query("user_id"))
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
				Code: constant.INVALID_REQUEST_PARAMS,
				Info: "invalid request params",
			})
			return
		}
		user, err := systemservice.FindUserByID(uint(userID))
		if err != nil {
			if err.Error() == "record not found" {
				ctx.AbortWithStatusJSON(http.StatusNotFound, systemmodel.Response{
					Code: constant.RECORD_NOT_FOUND,
					Info: "record not found",
				})
				return
			} else {
				ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
					Code: constant.INTERNAL_ERROR,
					Info: "system internal error",
				})
				return
			}
		}

		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: constant.SUCCESSFUL_FIND,
			Info: "find success",
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
			if err.Error() == "record not found" {
				ctx.AbortWithStatusJSON(http.StatusNotFound, systemmodel.Response{
					Code: constant.RECORD_NOT_FOUND,
					Info: "record not found",
				})
				return
			} else {
				ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
					Code: constant.INTERNAL_ERROR,
					Info: "system internal error",
				})
				return
			}
		}

		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: constant.SUCCESSFUL_FIND,
			Info: "find success",
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
				Code: constant.INTERNAL_ERROR,
				Info: "system internal error",
			})
			return
		}
		if len(users) == 0 {
			ctx.AbortWithStatusJSON(http.StatusNotFound, systemmodel.Response{
				Code: constant.RECORD_NOT_FOUND,
				Info: "record not found",
			})
			return
		}

		ctx.JSON(http.StatusOK, systemmodel.Response{
			Code: constant.SUCCESSFUL_FIND,
			Info: "find success",
			Data: gin.H{
				"total": len(users),
				"users": users,
			},
		})
		break

	default:
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
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
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}
	size, err := strconv.Atoi(_size)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, systemmodel.Response{
			Code: constant.INVALID_REQUEST_PARAMS,
			Info: "invalid request params",
		})
		return
	}

	users, total, err := systemservice.FindUserListWithPage(page, size)
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
			"users": users,
			"total": total,
		},
	})
}
