package cmd

import (
	"github.com/spf13/cobra"
	"github.com/yartash/social-network/scripts/manager/internal/apps"
	"github.com/yartash/social-network/scripts/manager/internal/commands"
)

func init() {
	rootCommand.AddCommand(startCommand)
}

var startCommand = &cobra.Command{
	Use:   "start",
	Short: "Build and start environment",
	RunE: func(cmd *cobra.Command, args []string) error {
		return apps.Run(commands.Start)
	},
}
