package responses

import (
	"bufio"
	"encoding/json"
	"fmt"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/logger"
	"io"
)

func BuildHandler(res io.Reader, log *logger.Log) error {
	var line string
	scanner := bufio.NewScanner(res)

	for scanner.Scan() {
		line = scanner.Text()

		buildInfo := &Response{}
		err := json.Unmarshal([]byte(line), buildInfo)

		if err != nil {
			return fmt.Errorf("error from parsing docker build info: %w", err)
		}

		log.Debug().Msg(buildInfo.Stream)
	}

	resError := &ErrorLine{}
	err := json.Unmarshal([]byte(line), resError)

	if err != nil {
		return fmt.Errorf("error from parsing docker build error info: %w", err)
	}

	if resError.Error != "" {
		return fmt.Errorf("error from building docker image: %w", err)
	}

	if err = scanner.Err(); err != nil {
		return fmt.Errorf("error from build response csaning: %w", err)
	}

	return nil
}
