package bootstrap

import (
	"goeasy/global"
	"goeasy/internal/shared/logger"
)

func InitLogger() {
	global.Logger = logger.NewLogger(global.Config.Logger)
}
