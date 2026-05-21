package dto

type PreviewStudent struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Mouth   string `json:"mouth"`
	Midterm string `json:"midterm"`
	Final   string `json:"final"`
	Status  string `json:"status"` // "normal", "warning", "error"
}

type MergeResult struct {
	SuccessCount int              `json:"successCount"`
	FailCount    int              `json:"failCount"`
	Students     []PreviewStudent `json:"students"`
	MergedBase64 string           `json:"mergedBase64"`
}
