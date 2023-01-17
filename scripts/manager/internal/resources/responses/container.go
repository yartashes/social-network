package responses

import (
	"bufio"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/logger"
	"io"
)

func ContainerHandler(res io.Reader, log *logger.Log) error {
	scanner := bufio.NewScanner(res)

	for scanner.Scan() {
		line := scanner.Text()

		log.Debug().Msg(line)
	}

	return nil
}
