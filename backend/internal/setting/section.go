package setting

type Config struct {
	App struct {
		Name  string `mapstructure:"name"`
		Debug bool   `mapstructure:"debug"`
	} `mapstructure:"app"`

	DB struct {
		Path string `mapstructure:"path"`
	} `mapstructure:"db"`

	Logger LoggerSetting `mapstructure:"logger"`
}

type LoggerSetting struct {
	LogLevel    string `mapstructure:"logLevel"`
	FileLogName string `mapstructure:"fileLogName"`
	FileName    string `mapstructure:"fileName"`
	MaxBackups  int    `mapstructure:"maxBackups"`
	MaxSize     int    `mapstructure:"log_level"`
	MaxAge      int    `mapstructure:"log_level"`
	Compress    bool   `mapstructure:"log_level"`
}
