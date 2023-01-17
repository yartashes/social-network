package resources

import (
	"context"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/archive"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/config"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/docker"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/logger"
	"github.com/yartash/social-network/scripts/manager/internal/resources/responses"
	"path"
)

type MongoResource struct {
	docker *client.Client
	logger *logger.Log
	cfg    config.MongoResourceConfig
	paths  config.PathsConfig
}

const imageTag = "mongo:local-6"

func newMongo(
	docker *docker.Docker,
	logger *logger.Logger,
	cfg config.MongoResourceConfig,
	paths config.PathsConfig,
) *MongoResource {
	log := logger.GetLogger("mongo-resources")
	log.Info().Msg("Init mongo resource")

	return &MongoResource{
		docker: docker.GetClient(),
		logger: log,
		cfg:    cfg,
		paths:  paths,
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

	return mr.startContainer(ctx)

	// 1. check container started
	// 2. create data folder for dbs
	// 3. add memory and cup limit container start
	// create replica set
	// create users
	// create db
	// stop cluster
	// run mongo cluster auth enable
	// test

	//return nil
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
	tar, err := archive.TarWithOptions(
		path.Join(mr.paths.Scripts, "mongo"),
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

func (mr MongoResource) startContainer(ctx context.Context) error {
	fmt.Println(path.Join(mr.paths.Scripts, "mongo", "config.conf"))
	fmt.Println(path.Join(mr.paths.Tmp, "mongo", "main"))
	c, err := mr.docker.ContainerCreate(
		ctx,
		&container.Config{
			Hostname: "mongo",
			Env:      []string{},
			Cmd: []string{
				"/usr/bin/mongod",
				"-f",
				"/etc/mongo/mongo.conf",
			},
			Tty:          false,
			Image:        imageTag,
			AttachStdout: true,
			AttachStderr: true,
		},
		&container.HostConfig{
			AutoRemove: true,
			Mounts: []mount.Mount{
				{
					Type:   mount.TypeBind,
					Source: path.Join(mr.paths.Scripts, "mongo", "config.conf"),
					Target: "/etc/mongo/mongo.conf",
				},
				{
					Type:   mount.TypeBind,
					Source: path.Join(mr.paths.Tmp, "mongo", "main"),
					Target: "/data/db",
				},
			},
		},
		nil,
		nil,
		"mongo-test",
	)

	if err != nil {
		return fmt.Errorf("error from createing mongo container: %w", err)
	}

	err = mr.docker.ContainerStart(
		ctx,
		c.ID,
		types.ContainerStartOptions{},
	)

	if err != nil {
		return fmt.Errorf("error from starting mongo container: %w", err)
	}

	//statusCh, errCh := mr.docker.ContainerWait(ctx, c.ID, container.WaitConditionNotRunning)
	//
	//select {
	//case err = <-errCh:
	//	if err != nil {
	//		panic(err)
	//	}
	//case <-statusCh:
	//	fmt.Println("ok")
	//}

	out, err := mr.docker.ContainerLogs(
		ctx,
		c.ID,
		types.ContainerLogsOptions{
			ShowStdout: true,
			ShowStderr: true,
			Timestamps: false,
			Follow:     true,
		},
	)

	if err != nil {
		panic(err)
	}

	defer out.Close()

	err = responses.ContainerHandler(out, mr.logger)

	if err != nil {
		return fmt.Errorf("error from handler mongo dokcer image build response: %w", err)
	}

	return nil
}
