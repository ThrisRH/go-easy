package wailsapp

import (
	"context"
	"encoding/base64"
	"goeasy/internal/modules/importer/application/services"
	"goeasy/internal/modules/importer/dto"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) SelectExcelFile() (string, error) {
	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Chọn file Excel",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Excel Files (*.xlsx;*.xls)",
				Pattern:     "*.xlsx;*.xls",
			},
		},
	})
}

func (a *App) PreviewExcel(path string) (*dto.ImportPreview, error) {
	service := services.NewPreviewImportService()

	return service.PreviewImport(path)
}

func (a *App) PreviewExcelData(data []byte) (*dto.ImportPreview, error) {
	service := services.NewPreviewImportService()

	return service.PreviewImportFromBytes(data)
}

func (a *App) PreviewExcelBase64(base64Str string) (*dto.ImportPreview, error) {
	data, err := base64.StdEncoding.DecodeString(base64Str)
	if err != nil {
		return nil, err
	}
	service := services.NewPreviewImportService()

	return service.PreviewImportFromBytes(data)
}

func (a *App) MergeScores(
	targetBase64 string,
	sourceBase64 string,
	mappings map[string]string,
	targetHeaderRow int,
	targetDataStartRow int,
	sourceHeaderRow int,
	sourceDataStartRow int,
) (*dto.MergeResult, error) {
	service := services.NewMergeService()

	return service.Merge(
		targetBase64,
		sourceBase64,
		mappings,
		targetHeaderRow,
		targetDataStartRow,
		sourceHeaderRow,
		sourceDataStartRow,
	)
}

func (a *App) SaveExcelFile(base64Str string, defaultName string) (string, error) {
	filePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Lưu file Excel đã gộp",
		DefaultFilename: defaultName,
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Excel Files (*.xlsx)",
				Pattern:     "*.xlsx",
			},
		},
	})
	if err != nil {
		return "", err
	}
	if filePath == "" {
		return "", nil // User cancelled
	}

	data, err := base64.StdEncoding.DecodeString(base64Str)
	if err != nil {
		return "", err
	}

	err = os.WriteFile(filePath, data, 0644)
	if err != nil {
		return "", err
	}

	return filePath, nil
}
