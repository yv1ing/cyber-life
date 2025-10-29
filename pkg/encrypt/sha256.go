package encrypt

import (
	"crypto/sha256"
	"encoding/hex"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 14:59
// @Desc:	计算Sha256哈希值

// Sha256String 计算输入字符串的Sha256哈希值
func Sha256String(text, salt string) string {
	textBytes := []byte(text)
	saltBytes := []byte(salt)

	hash := sha256.New()
	hash.Write(textBytes)
	hash.Write(saltBytes)

	return hex.EncodeToString(hash.Sum(nil))
}
