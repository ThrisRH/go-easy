package global

import (
	"goeasy/internal/setting"
	"goeasy/internal/shared/logger"
)

var (
	Config setting.Config
	Logger *logger.LoggerZap
)
