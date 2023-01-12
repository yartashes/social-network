package main

import (
	"github.com/yartash/social-network/scripts/manager/cmd"
	"os"
)

func main() {
	err := cmd.Execute()

	if err != nil {
		panic(err)
	}

	os.Exit(0)
}
