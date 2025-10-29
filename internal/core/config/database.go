package config

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 11:38
// @Desc:	数据库连接配置

type databaseConfig struct {
	Type string
	Addr string
	Port int
	User string
	Pass string
	Name string
}
