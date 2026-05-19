package services

import (
	"goeasy/internal/modules/importer/dto"
	"strconv"
)

type ParseRowsService struct{}

func NewParseRowsService() *ParseRowsService {
	return &ParseRowsService{}
}

func (s *ParseRowsService) Parse(
	rows [][]string,
	mapping dto.ImportMapping,
) ([]dto.ImportStudentRow, error) {

	var result []dto.ImportStudentRow

	for i := mapping.DataStartRow; i < len(rows); i++ {
		row := rows[i]

		student := dto.ImportStudentRow{
			Scores: map[string]float64{},
		}

		for field, columnIndex := range mapping.FieldMappings {

			if columnIndex >= len(row) {
				continue
			}

			value := row[columnIndex]

			switch field {

			case "student_name":
				student.StudentName = value

			default:
				score, err := strconv.ParseFloat(value, 64)
				if err != nil {
					continue
				}

				student.Scores[field] = score
			}
		}

		result = append(result, student)
	}

	return result, nil
}
