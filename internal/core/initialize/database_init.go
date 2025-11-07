package initialize

import (
	"cyber-life/internal/core/config"
	"errors"
	"fmt"
	"github.com/glebarez/sqlite"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"os"
	"time"

	commonmodel "cyber-life/internal/model/common"
	systemmodel "cyber-life/internal/model/system"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 11:36
// @Desc:	初始化数据库连接

func InitDatabase() (*gorm.DB, error) {
	var (
		db  *gorm.DB
		dsn string
		err error
	)

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,   // Slow SQL threshold
			LogLevel:                  logger.Silent, // Log level
			IgnoreRecordNotFoundError: true,          // Ignore ErrRecordNotFound error for logger
			ParameterizedQueries:      true,          // Don't include params in the SQL log
			Colorful:                  false,         // Disable color
		},
	)

	// 创建数据库连接
	switch config.Config.Database.Type {
	case "sqlite":
		dsn = fmt.Sprintf(
			"%s.db",
			config.Config.Database.Name,
		)
		db, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{
			Logger: newLogger,
		})
		if err != nil {
			return nil, err
		}
		break
	case "mysql":
		dsn = fmt.Sprintf(
			"%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			config.Config.Database.User,
			config.Config.Database.Pass,
			config.Config.Database.Addr,
			config.Config.Database.Port,
			config.Config.Database.Name,
		)
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
			Logger: newLogger,
		})
		if err != nil {
			return nil, err
		}
		break
	default:
		return nil, errors.New("invalid database type")
	}

	// 创建数据表
	// TODO: 根据实际情况确定是否需要重建表
	err = recreateTables(
		db,
		&systemmodel.User{},
	)
	if err != nil {
		return nil, err
	}

	err = createTables(
		db,
		&commonmodel.Account{},
		&commonmodel.Secret{},
		&commonmodel.Host{},
		&commonmodel.Site{},
	)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func recreateTables(db *gorm.DB, models ...interface{}) error {
	err := db.Migrator().DropTable(models...)
	if err != nil {
		return err
	}
	return createTables(db, models...)
}

func createTables(db *gorm.DB, models ...interface{}) error {
	return db.AutoMigrate(models...)
}
