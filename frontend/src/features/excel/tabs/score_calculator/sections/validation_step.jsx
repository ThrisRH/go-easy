import React, { useState } from 'react';
import { Check, AlertTriangle, AlertCircle } from 'lucide-react';

export function ValidationStep({
  isActive,
  isCompleted,
  isDisabled,
  mergeResult,
  onNext,
  onPrev
}) {
  const [ignoreErrors, setIgnoreErrors] = useState(false);

  const handleNext = () => {
    onNext();
  };

  const errorStudents = mergeResult ? mergeResult.students.filter(st => st.status === 'error') : [];
  const warningStudents = mergeResult ? mergeResult.students.filter(st => st.status === 'warning') : [];
  
  const hasErrors = errorStudents.length > 0 || warningStudents.length > 0;
  const canProceed = !hasErrors || ignoreErrors;

  const validCount = mergeResult ? (mergeResult.students.length - errorStudents.length) : 0;

  return (
    <div className={`step-card-wrapper`}>
      <div className={`step-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isDisabled ? 'disabled' : ''}`}>
        <div className="step-header">
          <div className="step-number">
            {isCompleted ? <Check size={16} /> : 5}
          </div>
          <div className="step-title-block">
            <h3 className="step-title">Bước 5: Kiểm tra và Validate lỗi so khớp</h3>
            <p className="step-description">Hệ thống phát hiện các điểm bất thường khi gộp hai file Excel</p>
          </div>
          <span className={`step-badge ${isCompleted ? 'success' : isActive ? 'inprogress' : 'pending'}`}>
            {isCompleted ? 'Đã kiểm tra' : isActive ? 'Đang thực hiện' : 'Chờ thực hiện'}
          </span>
        </div>

        {isActive && (
          <div className="step-body">
            <div className="warnings-container">
              {!hasErrors ? (
                <div className="warning-block success" style={{ borderColor: 'var(--color-green-600)', background: '#f0fdf4', display: 'flex', gap: '12px', padding: '16px', borderRadius: '6px', border: '1px solid var(--color-green-200)' }}>
                  <Check style={{ color: 'var(--color-green-600)', flexShrink: 0 }} size={24} />
                  <div className="warning-block-content">
                    <div className="warning-block-title" style={{ color: 'var(--color-green-800)', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>Tuyệt vời! Không phát hiện lỗi nào</div>
                    <div className="warning-block-desc" style={{ color: 'var(--color-green-700)', fontSize: '13px' }}>
                      Tất cả học sinh trong danh sách lớp đều được so khớp chính xác với điểm từ bảng điểm bộ môn của giáo viên.
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cảnh báo 1: Học sinh không khớp */}
                  {errorStudents.length > 0 && (
                    <div className="warning-block error">
                      <AlertCircle className="warning-block-icon" size={20} />
                      <div className="warning-block-content">
                        <div className="warning-block-title">Lỗi 1: Học sinh trong lớp thiếu thông tin điểm số</div>
                        <div className="warning-block-desc">
                          Không tìm thấy dữ liệu điểm của {errorStudents.length} học sinh sau trong file điểm của giáo viên bộ môn:
                          <ul className="warning-list" style={{ maxHeight: '120px', overflowY: 'auto', marginTop: '8px' }}>
                            {errorStudents.map((st, idx) => (
                              <li key={idx}>Học sinh <strong>{st.id || 'N/A'} - {st.name}</strong> không có trong file điểm nguồn.</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cảnh báo 2: Thiếu điểm */}
                  {warningStudents.length > 0 && (
                    <div className="warning-block warning">
                      <AlertTriangle className="warning-block-icon" size={20} />
                      <div className="warning-block-content">
                        <div className="warning-block-title">Lỗi 2: Trống điểm ở một số cột bắt buộc</div>
                        <div className="warning-block-desc">
                          Phát hiện {warningStudents.length} học sinh bị trống một số đầu điểm trong file điểm nguồn:
                          <ul className="warning-list" style={{ maxHeight: '120px', overflowY: 'auto', marginTop: '8px' }}>
                            {warningStudents.map((st, idx) => (
                              <li key={idx}>Học sinh <strong>{st.id || 'N/A'} - {st.name}</strong> bị trống một số đầu điểm.</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {hasErrors && (
              <div style={{ padding: '12px 16px', background: 'var(--color-gray-50)', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: 'var(--color-gray-900)' }}>
                  <input
                    type="checkbox"
                    checked={ignoreErrors}
                    onChange={(e) => setIgnoreErrors(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-green-600)' }}
                  />
                  Tôi đồng ý bỏ qua các dòng lỗi (hệ thống sẽ chỉ gộp điểm cho {validCount} học sinh hoàn toàn hợp lệ)
                </label>
              </div>
            )}

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={onPrev}>Quay lại</button>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!canProceed}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="step-body">
            <div style={{ fontSize: '13px', color: 'var(--color-green-600)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} />
              {hasErrors ? (
                `Đã xác nhận xử lý bỏ qua lỗi so khớp. ${validCount} bản ghi hợp lệ đã sẵn sàng để gộp.`
              ) : (
                "Đã kiểm tra. Tất cả các bản ghi học sinh đều hoàn toàn hợp lệ!"
              )}
            </div>
          </div>
        )}
      </div>

      <div className="step-connector"></div>
    </div>
  );
}
