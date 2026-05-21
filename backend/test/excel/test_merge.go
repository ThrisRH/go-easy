package main

import (
	"encoding/base64"
	"fmt"
	"os"

	"goeasy/internal/modules/importer/application/services"
	"github.com/xuri/excelize/v2"
)

func createMockTarget() string {
	f := excelize.NewFile()
	sheet := "Sheet1"

	// Row 1: STT, Họ và tên, Toán (merged), Văn (merged)
	f.SetCellValue(sheet, "A1", "STT")
	f.SetCellValue(sheet, "B1", "Họ và tên")
	f.SetCellValue(sheet, "C1", "Toán")
	f.SetCellValue(sheet, "E1", "Văn")

	// Row 2: GK, CK, GK, CK
	f.SetCellValue(sheet, "C2", "GK")
	f.SetCellValue(sheet, "D2", "CK")
	f.SetCellValue(sheet, "E2", "GK")
	f.SetCellValue(sheet, "F2", "CK")

	// Merge cells to simulate real-world layout
	f.MergeCell(sheet, "A1", "A2")
	f.MergeCell(sheet, "B1", "B2")
	f.MergeCell(sheet, "C1", "D1")
	f.MergeCell(sheet, "E1", "F1")

	// Students
	f.SetCellValue(sheet, "A3", "1")
	f.SetCellValue(sheet, "B3", "Nguyễn Văn Anh")

	f.SetCellValue(sheet, "A4", "2")
	f.SetCellValue(sheet, "B4", "Trần Thị Bình")

	buffer, _ := f.WriteToBuffer()
	return base64.StdEncoding.EncodeToString(buffer.Bytes())
}

func createMockSource() string {
	f := excelize.NewFile()
	sheet := "Sheet1"

	// Headers
	f.SetCellValue(sheet, "A1", "Họ và tên")
	f.SetCellValue(sheet, "B1", "Giữa Kỳ")
	f.SetCellValue(sheet, "C1", "Cuối Kỳ")

	// Grades
	f.SetCellValue(sheet, "A2", "Nguyễn Văn Anh")
	f.SetCellValue(sheet, "B2", "8.5")
	f.SetCellValue(sheet, "C2", "9.0")

	f.SetCellValue(sheet, "A3", "Trần Thị Bình")
	f.SetCellValue(sheet, "B3", "7.0")
	f.SetCellValue(sheet, "C3", "8.0")

	buffer, _ := f.WriteToBuffer()
	return base64.StdEncoding.EncodeToString(buffer.Bytes())
}

func main() {
	fmt.Println("=== Starting Merge Validation Test ===")

	targetB64 := createMockTarget()
	sourceB64 := createMockSource()

	mappings := map[string]string{
		"matchKey":        "col_0",
		"midtermScore":    "col_1",
		"finaltermScore":  "col_2",
	}

	service := services.NewMergeService()
	res, err := service.Merge(targetB64, sourceB64, "math", mappings, 1, 1)
	if err != nil {
		fmt.Printf("FAIL: Merge returned error: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("SuccessCount: %d\n", res.SuccessCount)
	fmt.Printf("FailCount: %d\n", res.FailCount)
	fmt.Printf("Preview Students Count: %d\n", len(res.Students))

	for _, s := range res.Students {
		fmt.Printf("Student: ID=%s, Name=%q, Midterm=%s, Final=%s, Status=%s\n",
			s.ID, s.Name, s.Midterm, s.Final, s.Status)
	}

	// Save merged output and check final cell values
	mergedData, _ := base64.StdEncoding.DecodeString(res.MergedBase64)
	outPath := "test/excel/merged_output.xlsx"
	_ = os.WriteFile(outPath, mergedData, 0644)
	defer os.Remove(outPath)

	outFile, _ := excelize.OpenFile(outPath)
	defer outFile.Close()

	sheet := outFile.GetSheetList()[0]

	// Verify cell values
	v3C, _ := outFile.GetCellValue(sheet, "C3") // Toán_GK for student 1
	v3D, _ := outFile.GetCellValue(sheet, "D3") // Toán_CK for student 1
	v4C, _ := outFile.GetCellValue(sheet, "C4") // Toán_GK for student 2
	v4D, _ := outFile.GetCellValue(sheet, "D4") // Toán_CK for student 2

	fmt.Printf("Nguyễn Văn Anh: Math GK = %s (expected 8.5), CK = %s (expected 9.0)\n", v3C, v3D)
	fmt.Printf("Trần Thị Bình: Math GK = %s (expected 7.0), CK = %s (expected 8.0)\n", v4C, v4D)

	if v3C == "8.5" && v3D == "9.0" && v4C == "7.0" && v4D == "8.0" {
		fmt.Println("SUCCESS: All cells merged with correct diacritic-insensitive matching!")
	} else {
		fmt.Println("FAIL: Merged cell values are incorrect!")
		os.Exit(1)
	}
}
