package dto

type ImportStudentRow struct {
	StudentName string `json:"studentName"`

	Scores map[string]float64 `json:"scores"`
}
