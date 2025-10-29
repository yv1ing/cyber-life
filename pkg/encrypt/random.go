package encrypt

import (
	"math/rand"
	"time"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/29 11:25
// @Desc:	随机数据生成

// RandomString 生成指定长度的随机字符串
func RandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	random := rand.New(rand.NewSource(time.Now().UnixNano()))
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[random.Intn(len(charset))]
	}

	return string(result)
}
