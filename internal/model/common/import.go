package common

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/31
// @Desc:   导入相关模型

// ImportResult 导入结果
type ImportResult struct {
	SuccessCount int `json:"success_count"` // 成功导入数量
	FailedCount  int `json:"failed_count"`  // 失败导入数量
}
