package logger

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"os"
	"strings"
	"sync"
)

// @Author: yv1ing
// @Email:  me@yvling.cn
// @Date:   2025/10/28 11:20
// @Desc:	日志器封装

var (
	sugar      *zap.SugaredLogger
	baseLogger *zap.Logger
	initOnce   sync.Once
)

func InitLogger(logfile string, logLevel string) {
	initOnce.Do(func() {
		level := parseLogLevel(logLevel)

		var syncers []zapcore.WriteSyncer
		syncers = append(syncers, zapcore.AddSync(os.Stdout))

		if logfile != "" {
			f, err := os.OpenFile(logfile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
			if err == nil {
				syncers = append(syncers, zapcore.AddSync(f))
			}
		}

		multi := zapcore.NewMultiWriteSyncer(syncers...)

		encCfg := zap.NewProductionEncoderConfig()
		encCfg.TimeKey = "time"
		encCfg.LevelKey = "level"
		encCfg.CallerKey = "caller"
		encCfg.EncodeTime = zapcore.ISO8601TimeEncoder
		encCfg.EncodeLevel = zapcore.CapitalLevelEncoder
		encCfg.EncodeCaller = zapcore.ShortCallerEncoder

		encoder := zapcore.NewConsoleEncoder(encCfg)
		core := zapcore.NewCore(encoder, multi, level)

		baseLogger = zap.New(core, zap.AddCaller(), zap.AddCallerSkip(1))
		sugar = baseLogger.Sugar()
	})
}

func parseLogLevel(level string) zapcore.Level {
	switch strings.ToLower(level) {
	case "debug":
		return zapcore.DebugLevel
	case "info":
		return zapcore.InfoLevel
	case "warn":
		return zapcore.WarnLevel
	case "error":
		return zapcore.ErrorLevel
	case "dpanic":
		return zapcore.DPanicLevel
	case "panic":
		return zapcore.PanicLevel
	case "fatal":
		return zapcore.FatalLevel
	default:
		return zapcore.DebugLevel
	}
}

func Close() {
	if baseLogger != nil {
		_ = baseLogger.Sync()
	}
}

func Debug(args ...any) { sugar.Debug(args...) }
func Info(args ...any)  { sugar.Info(args...) }
func Warn(args ...any)  { sugar.Warn(args...) }
func Error(args ...any) { sugar.Error(args...) }

func Debugf(template string, args ...any) { sugar.Debugf(template, args...) }
func Infof(template string, args ...any)  { sugar.Infof(template, args...) }
func Warnf(template string, args ...any)  { sugar.Warnf(template, args...) }
func Errorf(template string, args ...any) { sugar.Errorf(template, args...) }
