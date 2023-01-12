package apps

import (
	"context"
	"fmt"
	"github.com/spf13/viper"
	"github.com/yartash/social-network/scripts/manager/internal/commands"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/config"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/docker"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/logger"
	"github.com/yartash/social-network/scripts/manager/internal/resources"
	"os"
	"os/signal"
	"syscall"
)

func Run(command commands.CommandTypes) error {
	conf := &config.Config{}
	err := viper.Unmarshal(conf)

	if err != nil {
		return fmt.Errorf("error parsing config: %w", err)
	}

	log := logger.NewLogger(conf.Logger)
	l := log.GetLogger()
	l.Info().Msg("Command starting")

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	d, err := docker.NewDocker(log)

	if err != nil {
		l.Error().Err(err).Send()

		return fmt.Errorf("error creating k8s client: %w", err)
	}

	errCh := make(chan error)

	r := resources.NewResources(d, log, conf)
	c := commands.NewCommands(r, log, conf)

	go func() {
		err = c.Start(ctx, command)

		if err != nil {
			errCh <- err
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)

	gr := make(chan struct{}, 1)

	for {
		select {
		case err = <-errCh:
			l.Error().Err(err).Send()
			l.Info().Msg("stopping gracefully...")
			gr <- struct{}{}
		case q := <-quit:
			l.Info().Msg(q.String())
			l.Info().Msg("signal received, stopping gracefully...")
			gr <- struct{}{}
		case <-gr:
			err = d.Stop()

			if err != nil {
				l.Error().Err(err).Send()
			}

			l.Info().Msg("docker is stopped")

			err = c.Stop()

			if err != nil {
				l.Error().Err(err).Send()
			}

			l.Info().Msg("commands is stopped")

			return nil
		}
	}
}
