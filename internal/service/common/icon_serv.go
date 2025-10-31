package common

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"regexp"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/31
// @Desc:   图标管理服务

// 支持的图片扩展名
var supportedImageExts = map[string]bool{
	".jpg": true,
	".png": true,
}

// 文件大小限制（5MB）
const maxIconSize = 5 << 20

// sanitizeFilename 清理文件名，防止路径遍历攻击
func sanitizeFilename(name string) string {
	re := regexp.MustCompile(`[^a-zA-Z0-9_\-\p{Han}]`)
	return re.ReplaceAllString(name, "_")
}

// UploadIcon 上传图标文件
func UploadIcon(iconName, targetDir string, file *multipart.FileHeader) (string, error) {
	// 验证文件扩展名
	ext := filepath.Ext(file.Filename)
	if !supportedImageExts[ext] {
		return "", fmt.Errorf("只支持jpg、png格式的图片")
	}

	// 验证文件大小
	if file.Size > maxIconSize {
		return "", fmt.Errorf("文件大小不能超过5MB")
	}

	// 清理文件名，防止路径遍历攻击
	safeName := sanitizeFilename(iconName)
	if safeName == "" {
		return "", fmt.Errorf("图标名称非法")
	}

	// 创建目标目录
	if err := os.MkdirAll(targetDir, 0755); err != nil {
		return "", fmt.Errorf("创建目录失败: %w", err)
	}

	// 构建完整文件路径
	filename := safeName + ext
	filePath := filepath.Join(targetDir, filename)

	// 打开上传的文件
	src, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("打开上传文件失败: %w", err)
	}
	defer src.Close()

	// 创建目标文件
	dst, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("创建目标文件失败: %w", err)
	}
	defer dst.Close()

	// 复制文件内容
	if _, err = io.Copy(dst, src); err != nil {
		return "", fmt.Errorf("保存文件失败: %w", err)
	}

	return filename, nil
}

// GetIconsList 获取指定目录下的图标列表
func GetIconsList(iconsDir string) ([]string, error) {
	if err := os.MkdirAll(iconsDir, 0755); err != nil {
		return nil, fmt.Errorf("创建目录失败: %w", err)
	}

	files, err := os.ReadDir(iconsDir)
	if err != nil {
		return nil, fmt.Errorf("读取目录失败: %w", err)
	}

	var icons []string
	for _, file := range files {
		if !file.IsDir() {
			ext := filepath.Ext(file.Name())
			if supportedImageExts[ext] {
				icons = append(icons, file.Name())
			}
		}
	}

	return icons, nil
}
