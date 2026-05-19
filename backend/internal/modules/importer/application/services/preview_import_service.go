package services

import (
	"goeasy/internal/modules/importer/dto"
	"goeasy/internal/modules/importer/infrastructure/excel"
)

type PreviewImportService struct{}

func NewPreviewImportService() *PreviewImportService {
	return &PreviewImportService{}
}

func (pis *PreviewImportService) PreviewImport(path string) (*dto.ImportPreview, error) {
	reader, err := excel.NewReader(path)
	if err != nil {
		return nil, err
	}
	defer reader.Close()

	sheets := reader.ReadSheets()

	if len(sheets) == 0 {
		return nil, err
	}

	sheetName := sheets[0]

	rows, err := reader.ReadRows(sheetName)
	if err != nil {
		return nil, err
	}

	previewLimit := 20

	if len(rows) > previewLimit {
		rows = rows[:previewLimit]
	}

	return &dto.ImportPreview{
		Sheets:    sheets,
		Rows:      rows,
		TotalRows: len(rows),
		SheetName: sheetName,
	}, nil
}
