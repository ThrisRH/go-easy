import React from 'react';
import { CheckCircle, Download } from 'lucide-react';

export function CompleteStep({
  isActive,
  isDisabled,
  selectedSubject,
  targetFile,
  mergeResult,
  onReset
}) {
  if (isDisabled) {
    return (
      <div className={`step-card-wrapper`}>
        <div className="step-card disabled">
          <div className="step-header">
            <div className="step-number">7</div>
            <div className="step-title-block">
              <h3 className="step-title">Bước 7: Tải xuống file Excel kết quả</h3>
              <p className="step-description">Nhận tệp tin Excel đã được điền và gộp điểm hoàn tất</p>
            </div>
            <span className="step-badge pending">Chờ thực hiện</span>
          </div>
        </div>
      </div>
    );
  }

  const getSubjectName = (val) => {
    switch (val) {
      case 'math': return 'Toán học';
      case 'physics': return 'Vật lý';
      case 'chemistry': return 'Hóa học';
      case 'literature': return 'Ngữ văn';
      case 'english': return 'Tiếng Anh';
      default: return val;
    }
  };

  const handleDownload = async () => {
    if (!mergeResult?.mergedBase64) {
      alert("⚠️ Không tìm thấy dữ liệu file gộp!");
      return;
    }
    try {
      const defaultName = `Merged_${targetFile?.name || 'file.xlsx'}`;
      if (window.go && window.go.wailsapp && window.go.wailsapp.App) {
        const filePath = await window.go.wailsapp.App.SaveExcelFile(mergeResult.mergedBase64, defaultName);
        if (filePath) {
          alert(`🎉 Đã gộp và lưu file thành công tại:\n${filePath}`);
        }
      } else {
        alert("⚠️ Không tìm thấy Wails Backend để lưu file!");
      }
    } catch (err) {
      console.error("Lỗi khi lưu file:", err);
      alert("❌ Lỗi khi lưu file Excel: " + (err.message || err));
    }
  };

  const successCount = mergeResult ? mergeResult.successCount : 0;

  return (
    <div className={`step-card-wrapper`}>
      <div className="step-card active" style={{ borderColor: 'var(--color-green-600)' }}>
        <div className="success-screen">
          <div className="success-icon-wrapper">
            <CheckCircle size={36} />
          </div>
          <h2 className="success-title">Gộp file Excel thành công!</h2>
          <p className="success-desc">
            Điểm môn <strong>{getSubjectName(selectedSubject)}</strong> đã được ghi chính xác vào các ô điểm tương ứng trong file <strong>{targetFile?.name}</strong>.
          </p>

          <div className="success-meta-list">
            <div className="success-meta-item">
              <span className="success-meta-label">Môn học đã gộp</span>
              <span className="success-meta-value">{getSubjectName(selectedSubject)}</span>
            </div>
            <div className="success-meta-item">
              <span className="success-meta-label">Học sinh đã cập nhật</span>
              <span className="success-meta-value" style={{ color: 'var(--color-green-600)', fontWeight: 'bold' }}>{successCount} học sinh</span>
            </div>
            <div className="success-meta-item">
              <span className="success-meta-label">File kết quả tải về</span>
              <span className="success-meta-value" style={{ fontWeight: 'bold' }}>
                Merged_{targetFile?.name || 'file.xlsx'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '300px' }}>
            <button className="btn btn-primary" onClick={handleDownload} style={{ justifyContent: 'center', height: '42px', fontSize: '14px' }}>
              <Download size={18} />
              Tải xuống File Excel đã gộp
            </button>
            <button className="btn btn-secondary" onClick={onReset} style={{ justifyContent: 'center' }}>
              Gộp tiếp file khác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
