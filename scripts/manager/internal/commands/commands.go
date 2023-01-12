package commands

import (
	"context"
	"github.com/pkg/errors"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/config"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/logger"
	"github.com/yartash/social-network/scripts/manager/internal/resources"
)

type CommandTypes string

const (
	Start CommandTypes = "start"
)

type Command interface {
	Start(ctx context.Context) error
	Stop()
}

type Commands struct {
	logger   *logger.Log
	config   *config.Config
	commands map[CommandTypes]Command
}

func NewCommands(
	resources *resources.Resources,
	logger *logger.Logger,
	cfg *config.Config,
) *Commands {
	log := logger.GetLogger("commands")

	return &Commands{
		logger: log,
		config: cfg,
		commands: map[CommandTypes]Command{
			Start: newStartCommand(resources, logger),
		},
	}
}

func (c Commands) Start(ctx context.Context, command CommandTypes) error {
	exec, ok := c.commands[command]

	if !ok {
		return errors.Errorf("command not initilized")
	}

	return exec.Start(ctx)
}

func (c Commands) Stop() error {
	return nil
}
