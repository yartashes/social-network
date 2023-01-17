package commands

import (
	"context"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/constants"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/logger"
	"github.com/yartash/social-network/scripts/manager/internal/resources"
)

type StartCommand struct {
	resources *resources.Resources
	log       *logger.Log
}

func newStartCommand(
	r *resources.Resources,
	logger *logger.Logger,
) *StartCommand {
	log := logger.GetLogger("start-command")

	return &StartCommand{
		resources: r,
		log:       log,
	}
}

func (sc StartCommand) Start(ctx context.Context) error {
	// create network bridge

	_ = sc.resources.Get(constants.Mongo).Start(ctx)

	return nil
}

func (sc StartCommand) Stop() {

}
