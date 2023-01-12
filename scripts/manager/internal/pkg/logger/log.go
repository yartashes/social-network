package logger

import (
	"fmt"
	"github.com/rs/zerolog"
	"time"
)

type Log struct {
	log zerolog.Logger
}

func NewLog(l zerolog.Logger) *Log {
	return &Log{
		log: l,
	}
}

func (l *Log) Trace() *zerolog.Event {
	return l.log.Trace()
}

func (l *Log) Debug() *zerolog.Event {
	return l.log.Debug()
}

func (l *Log) Info() *zerolog.Event {
	return l.log.Info()
}

func (l *Log) Warn() *zerolog.Event {
	return l.log.Warn()
}

func (l *Log) Error() *zerolog.Event {
	return l.log.Error()
}

func (l *Log) Fatal() *zerolog.Event {
	return l.log.Fatal()
}

func (l *Log) Panic() *zerolog.Event {
	return l.log.Panic()
}

func (l *Log) TLog(msg string, start time.Time) {
	l.Debug().Dur(msg+", log time", time.Since(start)).Send()
}

func (l *Log) TLogf(msg string, start time.Time, args ...interface{}) {
	str := fmt.Sprintf(msg, args...)
	l.Debug().Dur(str+", log time", time.Since(start)).Send()
}

func (l *Log) TLogMin(msg string, start time.Time, min time.Duration) {
	d := time.Since(start)

	if d >= min {
		l.Debug().Dur(msg+", log time", time.Since(start)).Send()
	}
}

func (l *Log) TLogMinf(msg string, start time.Time, min time.Duration, args ...interface{}) {
	d := time.Since(start)

	if d >= min {
		str := fmt.Sprintf(msg, args...)
		l.Debug().Dur(str+", log time", time.Since(start)).Send()
	}
}

func (l *Log) GetLogger() zerolog.Logger {
	return l.log
}
