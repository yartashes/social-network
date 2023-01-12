package responses

type ErrorDetail struct {
	Message string `json:"message"`
}

type ErrorLine struct {
	Error       string      `json:"error"`
	ErrorDetail ErrorDetail `json:"errorDetail"`
}

type Response struct {
	Stream string `json:"stream"`
}
