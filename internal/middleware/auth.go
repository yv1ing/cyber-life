package middleware

import (
	"cyber-life/internal/constant"
	"cyber-life/internal/core/config"
	"cyber-life/pkg/auth"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"regexp"
	"strings"

	systemmodel "cyber-life/internal/model/system"
	systemservice "cyber-life/internal/service/system"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/29 11:33
// @Desc:	鉴权中间件

func extractBearerToken(c *gin.Context) string {
	authorization := c.GetHeader("Authorization")
	if authorization == "" {
		return ""
	}

	parts := strings.SplitN(authorization, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || parts[1] == "" {
		return ""
	}

	return parts[1]
}

func JwtAuthMiddleware(whitelist []string) gin.HandlerFunc {
	var whitelistRegex []*regexp.Regexp
	for _, pattern := range whitelist {
		re, err := regexp.Compile(pattern)
		if err == nil {
			whitelistRegex = append(whitelistRegex, re)
		}
	}

	return func(ctx *gin.Context) {
		path := ctx.Request.URL.Path
		for _, re := range whitelistRegex {
			if re.MatchString(path) {
				ctx.Next()
				return
			}
		}

		tokenStr := extractBearerToken(ctx)
		if tokenStr == "" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, systemmodel.Response{
				Code: constant.INVALID_REQUEST_HEADER,
				Info: "invalid request header",
			})
			return
		}

		claims, err := auth.ParseAccessToken(tokenStr, config.Config.SecretKey)
		if err != nil {
			if errors.Is(err, jwt.ErrTokenExpired) {
				ctx.AbortWithStatusJSON(http.StatusUnauthorized, systemmodel.Response{
					Code: constant.EXPIRED_TOKEN,
					Info: "token has expired",
				})
			} else {
				ctx.AbortWithStatusJSON(http.StatusUnauthorized, systemmodel.Response{
					Code: constant.INVALID_TOKEN,
					Info: "token is invalid",
				})
			}
			return
		}

		user, err := systemservice.FindUserByUsername(claims.Username)
		if err != nil {
			if err.Error() == "record not found" {
				ctx.AbortWithStatusJSON(http.StatusInternalServerError, systemmodel.Response{
					Code: constant.INVALID_TOKEN,
					Info: "token is invalid",
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
		if claims.JwtSign != user.JwtSign {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, systemmodel.Response{
				Code: constant.EXPIRED_TOKEN,
				Info: "token has expired",
			})
			return
		}

		ctx.Set("user_id", claims.UserID)
		ctx.Set("username", claims.Username)
		ctx.Next()
	}
}
