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
		return "", fmt.Errorf("only supports images in jpg and png formats")
	}

	// 验证文件大小
	if file.Size > maxIconSize {
		return "", fmt.Errorf("the file size must not exceed 5mb")
	}

	// 清理文件名，防止路径遍历攻击
	safeName := sanitizeFilename(iconName)
	if safeName == "" {
		return "", fmt.Errorf("invalid icon name")
	}

	// 创建目标目录
	err := os.MkdirAll(targetDir, 0755)
	if err != nil {
		return "", err
	}

	// 构建完整文件路径
	filename := safeName + ext
	filePath := filepath.Join(targetDir, filename)

	// 打开上传的文件
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// 创建目标文件
	dst, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	// 复制文件内容
	_, err = io.Copy(dst, src)
	if err != nil {
		return "", err
	}

	return filename, nil
}

// GetIconsList 获取指定目录下的图标列表
func GetIconsList(iconsDir string) ([]string, error) {
	err := os.MkdirAll(iconsDir, 0755)
	if err != nil {
		return nil, err
	}

	files, err := os.ReadDir(iconsDir)
	if err != nil {
		return nil, err
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
