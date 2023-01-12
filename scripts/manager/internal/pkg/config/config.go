package config

type LoggerConfig struct {
	Pretty bool              `yaml:"pretty" envconfig:"LOG_PRETTY"`
	Levels map[string]string `yaml:"levels" envconfig:"LOG_LEVEL"`
}

type MongoResourceConfig struct {
	Enabled bool `yaml:"enabled"`
}

type ResourcesConfig struct {
	Mongo MongoResourceConfig `yaml:"mongo"`
}

type Config struct {
	Resources ResourcesConfig `yaml:"resources"`
	Logger    LoggerConfig    `yaml:"logger"`
	path      string
}
