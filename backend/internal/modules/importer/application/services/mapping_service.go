package services

import (
	"errors"
	"fmt"
	"goeasy/internal/modules/importer/dto"
)

type MappingService struct{}

func NewMappingService() *MappingService {
	return &MappingService{}
}

func (s *MappingService) Validate(
	mapping dto.ImportMapping,
) error {

	if mapping.SheetName == "" {
		return errors.New("sheet name is required")
	}

	if mapping.DataStartRow < 0 {
		return errors.New("data start row is invalid")
	}

	if len(mapping.FieldMappings) == 0 {
		return errors.New("field mappings are required")
	}

	requiredFields := []string{
		"student_name",
	}

	for _, field := range requiredFields {

		if _, exists := mapping.FieldMappings[field]; !exists {
			return fmt.Errorf("%s mapping is required", field)
		}
	}

	usedColumns := map[int]bool{}

	for field, columnIndex := range mapping.FieldMappings {

		if columnIndex < 0 {
			return fmt.Errorf(
				"%s column index is invalid",
				field,
			)
		}

		if usedColumns[columnIndex] {
			return fmt.Errorf(
				"duplicate column mapping detected at column %d",
				columnIndex,
			)
		}

		usedColumns[columnIndex] = true
	}

	return nil
}
