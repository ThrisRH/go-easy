package services

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"regexp"
	"strings"

	"goeasy/internal/modules/importer/dto"
	"github.com/xuri/excelize/v2"
)

type MergeService struct{}

func NewMergeService() *MergeService {
	return &MergeService{}
}

// Vietnamese diacritics replacer mapped from infrastructure/excel/normalize.go
var replacer = strings.NewReplacer(
	// a
	"à", "a", "á", "a", "ạ", "a", "ả", "a", "ã", "a",
	"ă", "a", "ằ", "a", "ắ", "a", "ặ", "a", "ẳ", "a", "ẵ", "a",
	"â", "a", "ầ", "a", "ấ", "a", "ậ", "a", "ẩ", "a", "ẫ", "a",

	// e
	"è", "e", "é", "e", "ẹ", "e", "ẻ", "e", "ẽ", "e",
	"ê", "e", "ề", "e", "ế", "e", "ệ", "e", "ể", "e", "ễ", "e",

	// i
	"ì", "i", "í", "i", "ị", "i", "ỉ", "i", "ĩ", "i",

	// o
	"ò", "o", "ó", "o", "ọ", "o", "ỏ", "o", "õ", "o",
	"ô", "o", "ồ", "o", "ố", "o", "ộ", "o", "ổ", "o", "ỗ", "o",
	"ơ", "o", "ờ", "o", "ớ", "o", "ợ", "o", "ở", "o", "ỡ", "o",

	// u
	"ù", "u", "ú", "u", "ụ", "u", "ủ", "u", "ũ", "u",
	"ư", "u", "ừ", "u", "ứ", "u", "ự", "u", "ử", "u", "ữ", "u",

	// y
	"ỳ", "y", "ý", "y", "ỵ", "y", "ỷ", "y", "ỹ", "y",

	// d
	"đ", "d",

	// uppercase
	"À", "A", "Á", "A", "Ạ", "A", "Ả", "A", "Ã", "A",
	"Ă", "A", "Ằ", "A", "Ắ", "A", "Ặ", "A", "Ẳ", "A", "Ẵ", "A",
	"Â", "A", "Ầ", "A", "Ấ", "A", "Ậ", "A", "Ẩ", "A", "Ẫ", "A",

	"È", "E", "É", "E", "Ẹ", "E", "Ẻ", "E", "Ẽ", "E",
	"Ê", "E", "Ề", "E", "Ế", "E", "Ệ", "E", "Ể", "E", "Ễ", "E",

	"Ì", "I", "Í", "I", "Ị", "I", "Ỉ", "I", "Ĩ", "I",

	"Ò", "O", "Ó", "O", "Ọ", "O", "Ỏ", "O", "Õ", "O",
	"Ô", "O", "Ồ", "O", "Ố", "O", "Ộ", "O", "Ổ", "O", "Ỗ", "O",
	"Ơ", "O", "Ờ", "O", "Ớ", "O", "Ợ", "O", "Ở", "O", "Ỡ", "O",

	"Ù", "U", "Ú", "U", "Ụ", "U", "Ủ", "U", "Ũ", "U",
	"Ư", "U", "Ừ", "U", "Ứ", "U", "Ự", "U", "Ử", "U", "Ữ", "U",

	"Ỳ", "Y", "Ý", "Y", "Ỵ", "Y", "Ỷ", "Y", "Ỹ", "Y",

	"Đ", "D",
)

func NormalizeName(name string) string {
	name = strings.TrimSpace(name)
	name = strings.ToLower(name)
	name = replacer.Replace(name)
	// Remove all non-alphanumeric characters to make matching extremely robust
	reg := regexp.MustCompile(`[^a-z0-9]`)
	name = reg.ReplaceAllString(name, "")
	return name
}

func getColIndex(colKey string) int {
	if !strings.HasPrefix(colKey, "col_") {
		return -1
	}
	var idx int
	_, err := fmt.Sscanf(colKey, "col_%d", &idx)
	if err != nil {
		return -1
	}
	return idx
}

func (s *MergeService) Merge(
	targetBase64 string,
	sourceBase64 string,
	mappings map[string]string,
	targetHeaderRow int,
	targetDataStartRow int,
	sourceHeaderRow int,
	sourceDataStartRow int,
) (*dto.MergeResult, error) {
	// Decode base64
	targetData, err := base64.StdEncoding.DecodeString(targetBase64)
	if err != nil {
		return nil, fmt.Errorf("không thể giải mã file tổng (target): %v", err)
	}

	sourceData, err := base64.StdEncoding.DecodeString(sourceBase64)
	if err != nil {
		return nil, fmt.Errorf("không thể giải mã file điểm nguồn: %v", err)
	}

	// Open readers
	targetFile, err := excelize.OpenReader(bytes.NewReader(targetData))
	if err != nil {
		return nil, fmt.Errorf("không thể mở file tổng: %v", err)
	}
	defer targetFile.Close()

	sourceFile, err := excelize.OpenReader(bytes.NewReader(sourceData))
	if err != nil {
		return nil, fmt.Errorf("không thể mở file điểm nguồn: %v", err)
	}
	defer sourceFile.Close()

	// Get sheets
	targetSheets := targetFile.GetSheetList()
	if len(targetSheets) == 0 {
		return nil, fmt.Errorf("file tổng không có sheet nào")
	}
	targetSheet := targetSheets[0]

	sourceSheets := sourceFile.GetSheetList()
	if len(sourceSheets) == 0 {
		return nil, fmt.Errorf("file điểm nguồn không có sheet nào")
	}
	sourceSheet := sourceSheets[0]

	// Read target rows
	targetRows, err := targetFile.GetRows(targetSheet)
	if err != nil {
		return nil, fmt.Errorf("không thể đọc các dòng trong file tổng: %v", err)
	}

	// Translate target header and data rows to 0-based indices
	tIdx := targetHeaderRow - 1
	if tIdx < 0 {
		tIdx = 0
	}
	tDataIdx := targetDataStartRow - 1
	if tDataIdx < 0 {
		tDataIdx = 2
	}

	// Translate source header and data rows to 0-based indices
	sIdx := sourceHeaderRow - 1
	if sIdx < 0 {
		sIdx = 0
	}
	sDataIdx := sourceDataStartRow - 1
	if sDataIdx < 0 {
		sDataIdx = 1
	}

	if len(targetRows) < tIdx+1 {
		return nil, fmt.Errorf("bố cục file tổng không đúng (yêu cầu tiêu đề bắt đầu từ dòng %d)", targetHeaderRow)
	}

	// Parse mappings
	targetNameColIdx := getColIndex(mappings["targetMatchKey"])
	targetMouthColIdx := getColIndex(mappings["targetMouthScore"])
	targetQuizColIdx := getColIndex(mappings["targetQuizScore"])
	targetMidtermColIdx := getColIndex(mappings["targetMidtermScore"])
	targetFinaltermColIdx := getColIndex(mappings["targetFinaltermScore"])

	sourceNameIdx := getColIndex(mappings["sourceMatchKey"])
	sourceMouthIdx := getColIndex(mappings["sourceMouthScore"])
	sourceQuizIdx := getColIndex(mappings["sourceQuizScore"])
	sourceMidtermIdx := getColIndex(mappings["sourceMidtermScore"])
	sourceFinaltermIdx := getColIndex(mappings["sourceFinaltermScore"])

	if targetNameColIdx == -1 {
		return nil, fmt.Errorf("chưa chọn cột Họ và Tên trong bảng tổng hợp")
	}
	if sourceNameIdx == -1 {
		return nil, fmt.Errorf("chưa chọn cột Họ và Tên trong bảng điểm nguồn")
	}

	// Read source rows
	sourceRows, err := sourceFile.GetRows(sourceSheet)
	if err != nil {
		return nil, fmt.Errorf("không thể đọc các dòng trong file điểm nguồn: %v", err)
	}
	if len(sourceRows) < sIdx+1 {
		return nil, fmt.Errorf("file điểm nguồn không có tiêu đề bắt đầu từ dòng %d", sourceHeaderRow)
	}

	// O(N) lookup map for source file
	sourceStudentMap := make(map[string][]string)
	for i := sDataIdx; i < len(sourceRows); i++ {
		sRow := sourceRows[i]
		if sourceNameIdx >= len(sRow) {
			continue
		}
		name := sRow[sourceNameIdx]
		normName := NormalizeName(name)
		if normName != "" {
			sourceStudentMap[normName] = sRow
		}
	}

	successCount := 0
	failCount := 0
	var previewStudents []dto.PreviewStudent

	// Merge by matching student name starting from selected data start row
	for targetRowIdx := tDataIdx; targetRowIdx < len(targetRows); targetRowIdx++ {
		tRow := targetRows[targetRowIdx]
		if len(tRow) == 0 {
			continue
		}

		studentID := ""
		if len(tRow) > 0 {
			studentID = strings.TrimSpace(tRow[0])
		}

		studentName := ""
		if targetNameColIdx < len(tRow) {
			studentName = tRow[targetNameColIdx]
		}

		normTargetName := NormalizeName(studentName)
		if normTargetName == "" || normTargetName == "hovaten" || normTargetName == "hoten" || normTargetName == "stt" {
			continue
		}

		sRow, found := sourceStudentMap[normTargetName]

		previewSt := dto.PreviewStudent{
			ID:      studentID,
			Name:    studentName,
			Mouth:   "Trống",
			Midterm: "Trống",
			Final:   "Trống",
			Status:  "error",
		}

		if found {
			status := "normal"
			hasMissingScore := false

			// Mouth Score
			if targetMouthColIdx != -1 && sourceMouthIdx != -1 && sourceMouthIdx < len(sRow) {
				val := strings.TrimSpace(sRow[sourceMouthIdx])
				if val != "" {
					previewSt.Mouth = val
					cell, _ := excelize.CoordinatesToCellName(targetMouthColIdx+1, targetRowIdx+1)
					targetFile.SetCellValue(targetSheet, cell, val)
				} else {
					hasMissingScore = true
				}
			} else if targetMouthColIdx == -1 {
				previewSt.Mouth = "Bỏ qua"
			}

			// Quiz Score
			if targetQuizColIdx != -1 && sourceQuizIdx != -1 && sourceQuizIdx < len(sRow) {
				val := strings.TrimSpace(sRow[sourceQuizIdx])
				if val != "" {
					cell, _ := excelize.CoordinatesToCellName(targetQuizColIdx+1, targetRowIdx+1)
					targetFile.SetCellValue(targetSheet, cell, val)
				}
			}

			// Midterm Score
			if targetMidtermColIdx != -1 && sourceMidtermIdx != -1 && sourceMidtermIdx < len(sRow) {
				val := strings.TrimSpace(sRow[sourceMidtermIdx])
				if val != "" {
					previewSt.Midterm = val
					cell, _ := excelize.CoordinatesToCellName(targetMidtermColIdx+1, targetRowIdx+1)
					targetFile.SetCellValue(targetSheet, cell, val)
				} else {
					hasMissingScore = true
				}
			} else if targetMidtermColIdx == -1 {
				previewSt.Midterm = "Bỏ qua"
			}

			// Finalterm Score
			if targetFinaltermColIdx != -1 && sourceFinaltermIdx != -1 && sourceFinaltermIdx < len(sRow) {
				val := strings.TrimSpace(sRow[sourceFinaltermIdx])
				if val != "" {
					previewSt.Final = val
					cell, _ := excelize.CoordinatesToCellName(targetFinaltermColIdx+1, targetRowIdx+1)
					targetFile.SetCellValue(targetSheet, cell, val)
				} else {
					hasMissingScore = true
				}
			} else if targetFinaltermColIdx == -1 {
				previewSt.Final = "Bỏ qua"
			}

			if hasMissingScore {
				status = "warning"
			}
			previewSt.Status = status
			successCount++
		} else {
			failCount++
		}

		previewStudents = append(previewStudents, previewSt)
	}

	// Save target to buffer
	var buf bytes.Buffer
	if err := targetFile.Write(&buf); err != nil {
		return nil, fmt.Errorf("không thể xuất file Excel kết quả: %v", err)
	}

	mergedBase64 := base64.StdEncoding.EncodeToString(buf.Bytes())

	return &dto.MergeResult{
		SuccessCount: successCount,
		FailCount:    failCount,
		Students:     previewStudents,
		MergedBase64: mergedBase64,
	}, nil
}
