package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"os"
	"path"
)

var (
	configFile  string
	rootCommand = &cobra.Command{
		Use:   "sn-server",
		Short: "Manage social network backend environment setup and running",
	}
)

func Execute() error {
	return rootCommand.Execute()
}

func init() {
	cobra.OnInitialize(initConfig)

	rootCommand.PersistentFlags().StringVar(&configFile, "config", "", "config file (default is ./configs/config.yaml)")
}

func initConfig() {
	if configFile != "" {
		viper.SetConfigFile(configFile)
	} else {
		pwd, err := os.Getwd()
		cobra.CheckErr(err)

		viper.AddConfigPath(path.Join(pwd, "configs"))
		viper.SetConfigType("yaml")
		viper.SetConfigName("config")
	}

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err == nil {
		fmt.Println("Using config file:", viper.ConfigFileUsed())
	}
}
