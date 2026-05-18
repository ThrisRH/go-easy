package bootstrap

import (
	"goeasy/global"

	"go.uber.org/zap"
)

func Run() {
	LoadConfig()
	InitLogger()
	global.Logger.Info("Config Log Ok", zap.String("OK", "success"))

	InitMySQL()
	global.Logger.Info("InitMySQL Ok", zap.String("OK", "success"))

}
