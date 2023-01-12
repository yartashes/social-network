package docker

import (
	"fmt"
	"github.com/docker/docker/client"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/logger"
)

type Docker struct {
	client *client.Client
}

func NewDocker(logger *logger.Logger) (*Docker, error) {
	log := logger.GetLogger("docker")

	log.Info().Msg("connect to docker api")

	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())

	if err != nil {
		return nil, fmt.Errorf("error connecting to docker api: %w", err)
	}

	return &Docker{
		client: cli,
	}, nil
}

func (d Docker) GetClient() *client.Client {
	return d.client
}

func (d Docker) Stop() error {
	return d.client.Close()
}
