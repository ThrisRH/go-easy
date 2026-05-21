import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export function MappingStep({
  isActive,
  isCompleted,
  isDisabled,
  targetColumns,
  sourceColumns,
  mappings,
  setMappings,
  onNext,
  onPrev
}) {
  const mergeRules = [
    { 
      targetKey: 'targetMatchKey', 
      sourceKey: 'sourceMatchKey', 
      label: 'Họ và tên / Đối chiếu học sinh', 
      required: true, 
      desc: 'Bắt buộc dùng để đối sánh danh tính học sinh' 
    },
    { 
      targetKey: 'targetMouthScore', 
      sourceKey: 'sourceMouthScore', 
      label: 'Điểm miệng / Chuyên cần', 
      required: false, 
      desc: 'Không bắt buộc' 
    },
    { 
      targetKey: 'targetQuizScore', 
      sourceKey: 'sourceQuizScore', 
      label: 'Điểm 15 phút / Điểm Quiz', 
      required: false, 
      desc: 'Không bắt buộc' 
    },
    { 
      targetKey: 'targetMidtermScore', 
      sourceKey: 'sourceMidtermScore', 
      label: 'Điểm Giữa Kỳ (GK)', 
      required: true, 
      desc: 'Bắt buộc để gộp điểm giữa kỳ' 
    },
    { 
      targetKey: 'targetFinaltermScore', 
      sourceKey: 'sourceFinaltermScore', 
      label: 'Điểm Cuối Kỳ (CK)', 
      required: true, 
      desc: 'Bắt buộc để gộp điểm cuối kỳ' 
    }
  ];

  const handleSelectChange = (key, value) => {
    setMappings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNext = () => {
    const isAllRequiredMapped = mergeRules
      .filter(r => r.required)
      .every(r => mappings[r.targetKey] && mappings[r.sourceKey]);

    if (isAllRequiredMapped) {
      onNext();
    }
  };

  const isFormValid = mergeRules
    .filter(r => r.required)
    .every(r => mappings[r.targetKey] && mappings[r.sourceKey]);

  return (
    <div className={`step-card-wrapper`}>
      <div className={`step-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isDisabled ? 'disabled' : ''}`}>
        <div className="step-header">
          <div className="step-number">
            {isCompleted ? <Check size={16} /> : 3}
          </div>
          <div className="step-title-block">
            <h3 className="step-title">Bước 3: Khớp cột dữ liệu điểm chi tiết</h3>
            <p className="step-description">Chọn cột tương ứng từ File Điểm Bộ Môn để điền vào cột tương ứng trong File Tổng hợp lớp.</p>
          </div>
          <span className={`step-badge ${isCompleted ? 'success' : isActive ? 'inprogress' : 'pending'}`}>
            {isCompleted ? 'Đã thiết lập' : isActive ? 'Đang thực hiện' : 'Chờ thực hiện'}
          </span>
        </div>

        {isActive && (
          <div className="step-body">
            <div style={{ marginBottom: '20px', fontSize: '13px', color: 'var(--color-gray-600)', background: 'rgba(59, 130, 246, 0.05)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
              💡 Hệ thống đã **tự động phân tích và đề xuất** so khớp cột dựa trên từ khóa. Vui lòng kiểm tra lại thật kỹ và điều chỉnh thủ công nếu file Excel của bạn có định dạng riêng đặc biệt.
            </div>

            <div className="mapping-grid" style={{ gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 3fr', gap: '8px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', fontWeight: '600', fontSize: '12px', color: 'var(--color-gray-500)' }}>
                <div>Loại dữ liệu</div>
                <div>Cột nguồn (Bảng Bộ Môn)</div>
                <div style={{ textAlign: 'center' }}></div>
                <div>Cột nhận (Bảng Tổng Hợp)</div>
              </div>

              {mergeRules.map((rule) => (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 3fr', gap: '8px', alignItems: 'center', padding: '4px 0' }} key={rule.targetKey}>
                  {/* Cột 1: Nhãn dữ liệu */}
                  <div style={{ fontSize: '12px', fontWeight: '500', display: 'flex', flexDirection: 'column' }}>
                    <span>
                      {rule.label}
                      {rule.required && <span style={{ color: '#e53e3e', marginLeft: '2px' }}>*</span>}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', fontWeight: 'normal' }}>
                      {rule.desc}
                    </span>
                  </div>

                  {/* Cột 2: Dropdown Bảng nguồn */}
                  <div>
                    <select
                      className="mapping-select"
                      value={mappings[rule.sourceKey] || ''}
                      onChange={(e) => handleSelectChange(rule.sourceKey, e.target.value)}
                      style={{ fontSize: '12px', padding: '6px' }}
                    >
                      <option value="">-- Không sử dụng --</option>
                      {sourceColumns.map((col) => (
                        <option key={col.value} value={col.value}>{col.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cột 3: Arrow */}
                  <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-gray-400)' }}>
                    <ArrowRight size={16} />
                  </div>

                  {/* Cột 4: Dropdown Bảng đích */}
                  <div>
                    <select
                      className="mapping-select"
                      value={mappings[rule.targetKey] || ''}
                      onChange={(e) => handleSelectChange(rule.targetKey, e.target.value)}
                      style={{ fontSize: '12px', padding: '6px' }}
                    >
                      <option value="">-- Không sử dụng --</option>
                      {targetColumns.map((col) => (
                        <option key={col.value} value={col.value}>{col.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="step-actions" style={{ marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={onPrev}>Quay lại</button>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!isFormValid}
              >
                Xác nhận & Tiếp tục
              </button>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="step-body">
            <div className="quick-actions" style={{ marginTop: '0px' }}>
              <span className="quick-chip" style={{ cursor: 'default', fontSize: '12px' }}>
                Đối sánh Họ tên: <strong>{sourceColumns.find(c => c.value === mappings.sourceMatchKey)?.label?.split(':')[0] || 'Chưa chọn'} ➔ {targetColumns.find(c => c.value === mappings.targetMatchKey)?.label?.split(':')[0] || 'Chưa chọn'}</strong>
              </span>
              {mergeRules.slice(1).map(r => {
                if (mappings[r.sourceKey] && mappings[r.targetKey]) {
                  const srcCol = sourceColumns.find(c => c.value === mappings[r.sourceKey]);
                  const destCol = targetColumns.find(c => c.value === mappings[r.targetKey]);
                  return (
                    <span className="quick-chip" key={r.targetKey} style={{ cursor: 'default', fontSize: '12px' }}>
                      Gộp {r.label}: <strong>{srcCol?.label?.split(':')[0]} ➔ {destCol?.label?.split(':')[0]}</strong>
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>

      <div className="step-connector"></div>
    </div>
  );
}
