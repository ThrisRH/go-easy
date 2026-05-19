package main

import (
	"fmt"
	"goeasy/internal/bootstrap"
	"goeasy/internal/modules/importer/application/services"
	"goeasy/internal/modules/importer/dto"
	"log"
)

func main() {
	bootstrap.Run()

	previewService := services.NewPreviewImportService()

	preview, err := previewService.PreviewImport(
		"test/excel/Book1.xlsx",
	)
	if err != nil {
		log.Fatal(err)
	}

	mapping := dto.ImportMapping{
		SheetName: "Sheet1",

		HeaderRow: 0,

		DataStartRow: 1,

		FieldMappings: map[string]int{
			"student_name":  0,
			"math_score":    1,
			"english_score": 3,
		},
	}

	mappingService := services.NewMappingService()

	err = mappingService.Validate(mapping)
	if err != nil {
		log.Fatal(err)
	}

	parseService := services.NewParseRowsService()

	result, err := parseService.Parse(
		preview.Rows,
		mapping,
	)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%+v\n", result)
}
