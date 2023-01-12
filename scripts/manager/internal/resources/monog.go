package resources

import (
	"context"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/archive"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/config"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/docker"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/logger"
	"github.com/yartash/social-network/scripts/manager/internal/resources/responses"
	"os"
	"path"
)

type MongoResource struct {
	docker *client.Client
	logger *logger.Log
	cfg    config.MongoResourceConfig
}

const imageTag = "mongo:local-6"

func newMongo(
	docker *docker.Docker,
	logger *logger.Logger,
	cfg config.MongoResourceConfig,
) *MongoResource {
	log := logger.GetLogger("mongo-resources")
	log.Info().Msg("Init mongo resource")

	return &MongoResource{
		docker: docker.GetClient(),
		logger: log,
		cfg:    cfg,
	}
}

func (mr MongoResource) Start(ctx context.Context) error {
	if !mr.cfg.Enabled {
		return nil
	}

	exists, err := mr.checkImage(ctx)

	if err != nil {
		return fmt.Errorf("error from checking mongo image exists: %w", err)
	}

	if !exists {
		err = mr.buildImage(ctx)

		if err != nil {
			return fmt.Errorf("error from build mongo docker image: %w", err)
		}
	}

	return nil
}

func (mr MongoResource) checkImage(ctx context.Context) (bool, error) {
	images, err := mr.docker.ImageList(
		ctx,
		types.ImageListOptions{},
	)

	if err != nil {
		return false, fmt.Errorf("error getting docker images list: %w", err)
	}

	for _, image := range images {
		for _, tag := range image.RepoTags {
			if tag == imageTag {
				return true, nil
			}
		}
	}

	return false, nil
}

func (mr MongoResource) buildImage(ctx context.Context) error {
	pwd, err := os.Getwd()

	if err != nil {
		return fmt.Errorf("error from getting pwd for mongo image build: %w", err)
	}

	tar, err := archive.TarWithOptions(
		path.Join(pwd, "scripts", "mongo"),
		&archive.TarOptions{},
	)

	if err != nil {
		return fmt.Errorf("error from archiveted files for mongo image build: %w", err)
	}

	res, err := mr.docker.ImageBuild(
		ctx,
		tar,
		types.ImageBuildOptions{
			Dockerfile: "Dockerfile",
			Tags: []string{
				imageTag,
			},
			Remove: true,
		},
	)

	if err != nil {
		return fmt.Errorf("error from building mongo docker image: %w", err)
	}

	defer func() {
		err = res.Body.Close()

		if err != nil {
			mr.logger.Warn().Err(err).Msg("Error from cosing mongo docker image build response")
		}
	}()

	err = responses.BuildHandler(res.Body, mr.logger)

	if err != nil {
		return fmt.Errorf("error from handler mongo dokcer image build response: %w", err)
	}

	return nil
}
