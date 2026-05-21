import React, { useState, useMemo, useEffect } from 'react';
import './score_calculator.css';
import { ClassSubjectStep } from './sections/class_subject_step';
import { UploadFileStep } from './sections/upload_file_step';
import { MappingStep } from './sections/mapping_step';
import { PreviewStep } from './sections/preview_step';
import { ValidationStep } from './sections/validation_step';
import { ConfirmStep } from './sections/confirm_step';
import { CompleteStep } from './sections/complete_step';

export function ScoreCalculator() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // File Đích (Target File)
  const [targetFile, setTargetFile] = useState(null); 
  const [targetPreview, setTargetPreview] = useState(null); 
  const [targetHeaderRow, setTargetHeaderRow] = useState(1); 
  const [targetDataStartRow, setTargetDataStartRow] = useState(3); 

  // File Nguồn (Source File)
  const [file, setFile] = useState(null); 
  const [sourcePreview, setSourcePreview] = useState(null); 
  const [sourceHeaderRow, setSourceHeaderRow] = useState(1); 
  const [sourceDataStartRow, setSourceDataStartRow] = useState(2); 

  const [mappings, setMappings] = useState({
    targetMatchKey: '',
    targetMouthScore: '',
    targetQuizScore: '',
    targetMidtermScore: '',
    targetFinaltermScore: '',

    sourceMatchKey: '',
    sourceMouthScore: '',
    sourceQuizScore: '',
    sourceMidtermScore: '',
    sourceFinaltermScore: ''
  });

  // State lưu kết quả gộp điểm từ Backend
  const [mergeResult, setMergeResult] = useState(null);

  // Tính toán danh sách cột của File Đích động và xử lý merged cells
  const targetColumns = useMemo(() => {
    if (!targetPreview || !targetPreview.rows || targetPreview.rows.length < targetHeaderRow) return [];
    
    const row1 = targetPreview.rows[targetHeaderRow - 1] || [];
    const row2 = targetPreview.rows[targetHeaderRow] || [];
    
    // Khôi phục merge cell dòng 1: điền giá trị từ trái sang phải
    const resolvedRow1 = [];
    let lastVal = "";
    const maxLen = Math.max(row1.length, row2.length);
    
    for (let i = 0; i < maxLen; i++) {
      const val = (row1[i] || "").trim();
      if (val) {
        lastVal = val;
        resolvedRow1.push(val);
      } else {
        resolvedRow1.push(lastVal);
      }
    }

    const cols = [];
    for (let i = 0; i < maxLen; i++) {
      const r1Val = resolvedRow1[i] || "";
      const r2Val = (row2[i] || "").trim();
      const colChar = String.fromCharCode(65 + i); // Cột A, B, C...
      
      let label = `Cột ${colChar}`;
      if (r1Val && r2Val) {
        label = `${colChar}: ${r1Val} - ${r2Val}`;
      } else if (r1Val) {
        label = `${colChar}: ${r1Val}`;
      } else if (r2Val) {
        label = `${colChar}: ${r2Val}`;
      }
      
      cols.push({
        value: `col_${i}`,
        label: label
      });
    }
    return cols;
  }, [targetPreview, targetHeaderRow]);

  // Tính toán danh sách cột của File Nguồn động
  const sourceColumns = useMemo(() => {
    if (!sourcePreview || !sourcePreview.rows || sourcePreview.rows.length < sourceHeaderRow) return [];
    
    const row = sourcePreview.rows[sourceHeaderRow - 1] || [];
    return row.map((cell, index) => {
      const colChar = String.fromCharCode(65 + index);
      const cellVal = (cell || "").trim();
      return {
        value: `col_${index}`,
        label: cellVal ? `${colChar}: ${cellVal}` : `Cột ${colChar}`
      };
    });
  }, [sourcePreview, sourceHeaderRow]);

  // Tự động khớp cột thông minh khi các cột được tải/thay đổi
  useEffect(() => {
    if (targetColumns.length === 0 || sourceColumns.length === 0) return;

    const autoMatch = {
      targetMatchKey: '',
      targetMouthScore: '',
      targetQuizScore: '',
      targetMidtermScore: '',
      targetFinaltermScore: '',

      sourceMatchKey: '',
      sourceMouthScore: '',
      sourceQuizScore: '',
      sourceMidtermScore: '',
      sourceFinaltermScore: ''
    };

    // 1. So khớp thông minh File Nguồn
    sourceColumns.forEach(col => {
      const lbl = col.label.toLowerCase();
      const val = col.value;
      if (lbl.includes("họ") || lbl.includes("tên") || lbl.includes("mã") || lbl.includes("mshs") || lbl.includes("id")) {
        if (!autoMatch.sourceMatchKey) autoMatch.sourceMatchKey = val;
      } else if (lbl.includes("miệng") || lbl.includes("chuyên cần") || lbl.includes("cc")) {
        autoMatch.sourceMouthScore = val;
      } else if (lbl.includes("15") || lbl.includes("quiz") || lbl.includes("15p")) {
        autoMatch.sourceQuizScore = val;
      } else if (lbl.includes("giữa") || lbl.includes("gk") || lbl.includes("giuaky")) {
        autoMatch.sourceMidtermScore = val;
      } else if (lbl.includes("cuối") || lbl.includes("ck") || lbl.includes("cuoiky")) {
        autoMatch.sourceFinaltermScore = val;
      }
    });

    // 2. So khớp thông minh File Đích theo môn học đã chọn
    targetColumns.forEach(col => {
      const lbl = col.label.toLowerCase();
      const val = col.value;
      
      const isSubject = (selectedSubject === "math" && (lbl.includes("toán") || lbl.includes("toan"))) ||
                        (selectedSubject === "physics" && (lbl.includes("lý") || lbl.includes("ly") || lbl.includes("vật lý") || lbl.includes("vatly"))) ||
                        (selectedSubject === "chemistry" && (lbl.includes("hóa") || lbl.includes("hoa"))) ||
                        (selectedSubject === "literature" && (lbl.includes("văn") || lbl.includes("van") || lbl.includes("ngữ văn") || lbl.includes("nguvan"))) ||
                        (selectedSubject === "english" && (lbl.includes("anh") || lbl.includes("tiếng anh") || lbl.includes("tienganh")));

      if (lbl.includes("họ và tên") || lbl.includes("họ tên") || lbl.includes("học sinh") || lbl.includes("tên học sinh")) {
        if (!autoMatch.targetMatchKey) autoMatch.targetMatchKey = val;
      }

      if (isSubject) {
        if (lbl.includes("miệng") || lbl.includes("mieng") || lbl.includes("chuyên cần") || lbl.includes("cc") || lbl.includes("m1") || lbl.includes("m2")) {
          autoMatch.targetMouthScore = val;
        } else if (lbl.includes("15") || lbl.includes("quiz") || lbl.includes("15p")) {
          autoMatch.targetQuizScore = val;
        } else if (lbl.includes("giữa") || lbl.includes("gk") || lbl.includes("giuaky")) {
          autoMatch.targetMidtermScore = val;
        } else if (lbl.includes("cuối") || lbl.includes("ck") || lbl.includes("cuoiky")) {
          autoMatch.targetFinaltermScore = val;
        }
      }
    });

    // Cung cấp các phương án fallback
    if (!autoMatch.sourceMatchKey && sourceColumns.length > 0) autoMatch.sourceMatchKey = 'col_0';
    if (!autoMatch.targetMatchKey && targetColumns.length > 0) {
      // Tìm cột có từ khóa "họ và tên" hoặc mặc định là cột thứ hai (Cột B)
      autoMatch.targetMatchKey = targetColumns.find(c => c.label.toLowerCase().includes("họ"))?.value || 'col_1';
    }

    setMappings(autoMatch);
  }, [targetColumns, sourceColumns, selectedSubject]);

  const handleNext = () => {
    setActiveStep(prev => Math.min(prev + 1, 7));
  };

  const handlePrev = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setActiveStep(1);
    setSelectedSubject('');
    setTargetFile(null);
    setTargetPreview(null);
    setTargetHeaderRow(1);
    setTargetDataStartRow(3);
    setFile(null);
    setSourcePreview(null);
    setSourceHeaderRow(1);
    setSourceDataStartRow(2);
    setMappings({
      targetMatchKey: '',
      targetMouthScore: '',
      targetQuizScore: '',
      targetMidtermScore: '',
      targetFinaltermScore: '',

      sourceMatchKey: '',
      sourceMouthScore: '',
      sourceQuizScore: '',
      sourceMidtermScore: '',
      sourceFinaltermScore: ''
    });
    setMergeResult(null);
  };

  const executeMerge = async () => {
    if (!targetFile?.base64 || !file?.base64) {
      alert("⚠️ Thiếu file tổng hoặc file điểm bộ môn!");
      return false;
    }
    try {
      if (window.go && window.go.wailsapp && window.go.wailsapp.App) {
        const res = await window.go.wailsapp.App.MergeScores(
          targetFile.base64,
          file.base64,
          mappings,
          targetHeaderRow,
          targetDataStartRow,
          sourceHeaderRow,
          sourceDataStartRow
        );
        setMergeResult(res);
        return true;
      } else {
        alert("⚠️ Không tìm thấy Backend Wails để thực hiện gộp điểm thực tế!");
        return false;
      }
    } catch (err) {
      console.error("Lỗi khi gộp file:", err);
      alert("❌ Lỗi khi gộp file Excel: " + (err.message || err));
      return false;
    }
  };

  const handleNextFromMapping = async () => {
    const success = await executeMerge();
    if (success) {
      handleNext();
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <h1 className="page-title">Nạp Điểm Bộ Môn vào Bảng Tổng Hợp</h1>
      <p className="page-subtitle">
        Giúp giáo viên bộ môn tự động điền điểm từ bảng điểm của mình vào đúng cột trong bảng tổng hợp của lớp do giáo viên chủ nhiệm quản lý.
      </p>

      <div className="workflow-container">
        {/* Step 1: Chọn môn học & Upload File Đích */}
        <ClassSubjectStep
          isActive={activeStep === 1}
          isCompleted={activeStep > 1}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          targetFile={targetFile}
          setTargetFile={setTargetFile}
          setTargetPreview={setTargetPreview}
          targetHeaderRow={targetHeaderRow}
          setTargetHeaderRow={setTargetHeaderRow}
          targetDataStartRow={targetDataStartRow}
          setTargetDataStartRow={setTargetDataStartRow}
          targetPreview={targetPreview}
          onNext={handleNext}
        />

        {/* Step 2: Upload File Nguồn */}
        <UploadFileStep
          isActive={activeStep === 2}
          isCompleted={activeStep > 2}
          isDisabled={activeStep < 2}
          file={file}
          setFile={setFile}
          setSourcePreview={setSourcePreview}
          sourceHeaderRow={sourceHeaderRow}
          setSourceHeaderRow={setSourceHeaderRow}
          sourceDataStartRow={sourceDataStartRow}
          setSourceDataStartRow={setSourceDataStartRow}
          sourcePreview={sourcePreview}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* Step 3: Mapping cột thực tế từ Backend */}
        <MappingStep
          isActive={activeStep === 3}
          isCompleted={activeStep > 3}
          isDisabled={activeStep < 3}
          targetColumns={targetColumns}
          sourceColumns={sourceColumns}
          mappings={mappings}
          setMappings={setMappings}
          onNext={handleNextFromMapping}
          onPrev={handlePrev}
        />

        {/* Step 4: Preview dữ liệu thật sau gộp */}
        <PreviewStep
          isActive={activeStep === 4}
          isCompleted={activeStep > 4}
          isDisabled={activeStep < 4}
          targetPreview={targetPreview}
          sourcePreview={sourcePreview}
          mappings={mappings}
          mergeResult={mergeResult}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* Step 5: Validate lỗi */}
        <ValidationStep
          isActive={activeStep === 5}
          isCompleted={activeStep > 5}
          isDisabled={activeStep < 5}
          mergeResult={mergeResult}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* Step 6: Xác nhận & Gộp điểm */}
        <ConfirmStep
          isActive={activeStep === 6}
          isCompleted={activeStep > 6}
          isDisabled={activeStep < 6}
          selectedSubject={selectedSubject}
          targetFile={targetFile}
          file={file}
          mergeResult={mergeResult}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* Step 7: Hoàn tất */}
        <CompleteStep
          isActive={activeStep === 7}
          isDisabled={activeStep < 7}
          selectedSubject={selectedSubject}
          targetFile={targetFile}
          mergeResult={mergeResult}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
