package resources

import (
	"context"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/config"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/constants"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/docker"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/logger"
)

type Resource interface {
	Start(ctx context.Context) error
}

type Resources struct {
	logger    *logger.Log
	resources map[constants.ResourceTypes]Resource
}

func NewResources(
	docker *docker.Docker,
	logger *logger.Logger,
	cfg *config.Config,
) *Resources {
	log := logger.GetLogger("resources")
	log.Info().Msg("Init resource collector")

	return &Resources{
		logger: log,
		resources: map[constants.ResourceTypes]Resource{
			constants.Mongo: newMongo(docker, logger, cfg.Resources.Mongo, cfg.Paths),
		},
	}
}

func (r Resources) Get(resourceType constants.ResourceTypes) Resource {
	resource, ok := r.resources[resourceType]

	if !ok {
		return nil
	}

	return resource
}
