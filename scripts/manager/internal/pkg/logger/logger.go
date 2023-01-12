package logger

import (
	"github.com/mattn/go-colorable"
	"github.com/pkg/errors"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/pkgerrors"
	"github.com/yartash/social-network/scripts/manager/internal/pkg/config"
	"io"
	"os"
)

type Logger struct {
	Options config.LoggerConfig
}

func NewLogger(options config.LoggerConfig) *Logger {
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack
	zerolog.TimeFieldFormat = "2006-01-02 15:04:05.999999999"

	return &Logger{Options: options}
}

func (l *Logger) GetLogger(module ...string) *Log {
	var moduleName string

	if len(module) > 1 {
		panic("only one package name can be given")
	}

	if len(module) == 0 {
		moduleName = "main"
	} else {
		moduleName = module[0]
	}

	logLevel := l.getLevel(moduleName)

	logContext := zerolog.New(l.setupOutput(moduleName)).
		Level(logLevel).
		With().
		Timestamp()

	if logLevel <= zerolog.DebugLevel {
		logContext = logContext.Caller()
	}

	log := logContext.
		Str("package", moduleName).
		Logger()

	return NewLog(log)
}

func (l *Logger) setupOutput(module string) io.Writer {
	writers := make([]io.Writer, 0, 2)

	var output io.Writer

	if l.Options.Pretty {
		output = zerolog.ConsoleWriter{
			Out:        colorable.NewColorableStdout(),
			TimeFormat: "2006-01-02 15:04:05.999999999",
		}
	} else {
		output = os.Stdout
	}

	writers = append(writers, output)

	return io.MultiWriter(writers...)
}

func (l *Logger) getLevel(module string) zerolog.Level {
	var levelName string

	levelName, ok := l.Options.Levels[module]

	if !ok {
		levelName = l.Options.Levels["any"]
	}

	level, err := zerolog.ParseLevel(levelName)

	if err != nil {
		return zerolog.InfoLevel
	}

	return level
}

func (l *Logger) ErrorWithStack(err error) {
	l.GetLogger().Error().Stack().Err(errors.WithStack(err)).Send()
}
