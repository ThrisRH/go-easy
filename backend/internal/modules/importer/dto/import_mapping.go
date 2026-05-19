package dto

type ImportMapping struct {
	SheetName     string         `json:"sheetName"`
	HeaderRow     int            `json:"headerRow"`
	DataStartRow  int            `json:"dataStartRow"`
	FieldMappings map[string]int `json:"fieldMappings"`
}
