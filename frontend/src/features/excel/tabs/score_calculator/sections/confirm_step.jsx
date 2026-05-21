import React, { useState } from 'react';
import { Check, RefreshCw } from 'lucide-react';

export function ConfirmStep({
  isActive,
  isCompleted,
  isDisabled,
  selectedSubject,
  targetFile,
  file,
  mergeResult,
  onNext,
  onPrev
}) {
  const [isImporting, setIsImporting] = useState(false);

  const handleConfirm = () => {
    setIsImporting(true);
    // Simulating final output generation for premium UI/UX feel
    setTimeout(() => {
      setIsImporting(false);
      onNext();
    }, 1200);
  };

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

  const successCount = mergeResult ? mergeResult.successCount : 0;
  const failCount = mergeResult ? mergeResult.failCount : 0;

  return (
    <div className={`step-card-wrapper`}>
      <div className={`step-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isDisabled ? 'disabled' : ''}`}>
        <div className="step-header">
          <div className="step-number">
            {isCompleted ? <Check size={16} /> : 6}
          </div>
          <div className="step-title-block">
            <h3 className="step-title">Bước 6: Xác nhận & Tiến hành Gộp file Excel</h3>
            <p className="step-description">Kiểm tra thông tin gộp tệp tin lần cuối trước khi xuất file</p>
          </div>
          <span className={`step-badge ${isCompleted ? 'success' : isActive ? 'inprogress' : 'pending'}`}>
            {isCompleted ? 'Đã gộp file' : isActive ? 'Đang thực hiện' : 'Chờ thực hiện'}
          </span>
        </div>

        {isActive && (
          <div className="step-body">
            {!isImporting ? (
              <>
                <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--color-gray-500)' }}>
                  ⚠️ Hãy kiểm tra kỹ các thông tin so khớp tệp tin bên dưới trước khi tiến hành tạo file gộp:
                </div>

                <div className="success-meta-list" style={{ maxWidth: '100%', marginBottom: '20px' }}>
                  <div className="success-meta-item">
                    <span className="success-meta-label">File gốc cần ghi điểm (Đích)</span>
                    <span className="success-meta-value">{targetFile?.name}</span>
                  </div>
                  <div className="success-meta-item">
                    <span className="success-meta-label">File chứa điểm mới (Nguồn)</span>
                    <span className="success-meta-value">{file?.name}</span>
                  </div>
                  <div className="success-meta-item">
                    <span className="success-meta-label">Môn học áp dụng</span>
                    <span className="success-meta-value">{getSubjectName(selectedSubject)}</span>
                  </div>
                  <div className="success-meta-item">
                    <span className="success-meta-label">Số học sinh được gộp điểm</span>
                    <span className="success-meta-value" style={{ color: 'var(--color-green-600)', fontWeight: 'bold' }}>{successCount} học sinh</span>
                  </div>
                  <div className="success-meta-item">
                    <span className="success-meta-label">Số học sinh bị bỏ qua do lỗi</span>
                    <span className="success-meta-value" style={{ color: failCount > 0 ? '#e53e3e' : 'var(--color-gray-500)', fontWeight: 'bold' }}>{failCount} học sinh</span>
                  </div>
                </div>

                <div className="step-actions">
                  <button className="btn btn-secondary" onClick={onPrev}>Quay lại</button>
                  <button className="btn btn-primary" onClick={handleConfirm}>
                    Bắt đầu gộp file Excel
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: '12px' }}>
                <RefreshCw size={32} className="spinning" style={{ color: 'var(--color-green-600)', animation: 'spin 2s linear infinite' }} />
                <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-gray-900)' }}>Đang ghi điểm số từ File nguồn vào File đích...</div>
                <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>Hệ thống đang xuất bản tệp tin Excel kết quả</div>
              </div>
            )}
          </div>
        )}

        {isCompleted && (
          <div className="step-body">
            <div style={{ fontSize: '13px', color: 'var(--color-gray-500)' }}>
              Quá trình gộp bảng điểm đã hoàn tất thành công.
            </div>
          </div>
        )}
      </div>

      <div className="step-connector"></div>
    </div>
  );
}
