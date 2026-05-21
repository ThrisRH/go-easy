package excel

import (
	"bytes"
	"fmt"

	"github.com/xuri/excelize/v2"
)

type Reader struct {
	file *excelize.File
}

func NewReader(path string) (*Reader, error) {
	f, err := excelize.OpenFile(path)
	if err != nil {
		return nil, fmt.Errorf("Failed to open Excel file: %s", err.Error())
	}

	return &Reader{file: f}, nil
}

func NewReaderFromBytes(data []byte) (*Reader, error) {
	f, err := excelize.OpenReader(bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("Failed to open Excel file from bytes: %s", err.Error())
	}

	return &Reader{file: f}, nil
}

func (r *Reader) ReadSheets() []string {
	return r.file.GetSheetList()
}

func (r *Reader) ReadRows(sheetName string) ([][]string, error) {
	rows, err := r.file.GetRows(sheetName)
	if err != nil {
		return nil, fmt.Errorf("Failed to read sheet: %s", err.Error())
	}

	return rows, nil
}

func (r *Reader) Close() error {
	if err := r.file.Close(); err != nil {
		return fmt.Errorf("Failed to close Excel file: %s\n", err.Error())
	}
	return nil
}
