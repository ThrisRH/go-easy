package dto

type ImportPreview struct {
	Sheets    []string   `json:"sheets"`
	Rows      [][]string `json:"rows"`
	TotalRows int        `json:"totalRows"`
	SheetName string     `json:"sheetName"`
}
