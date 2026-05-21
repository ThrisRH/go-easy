import React from 'react';
import { Check } from 'lucide-react';

export function PreviewStep({
  isActive,
  isCompleted,
  isDisabled,
  targetPreview,
  sourcePreview,
  mappings,
  mergeResult,
  onNext,
  onPrev
}) {
  
  // Tạo danh sách học sinh so khớp động từ 2 file Excel thật
  let displayStudents = [];

  if (mergeResult && mergeResult.students) {
    displayStudents = mergeResult.students;
  } else {
    // Fallback Mock tuyệt đẹp trong trường hợp người dùng chưa tải file lên
    displayStudents = [
      { id: 'HS001', name: 'Nguyễn Văn Anh', mouth: '8.0', midterm: '8.5', final: '9.0', status: 'normal' },
      { id: 'HS002', name: 'Trần Thị Bình', mouth: 'Trống', midterm: '7.5', final: '8.0', status: 'warning' },
      { id: 'HS003', name: 'Lê Hoàng Cường', mouth: '9.0', midterm: 'Trống', final: '8.5', status: 'warning' }
    ];
  }

  return (
    <div className={`step-card-wrapper`}>
      <div className={`step-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isDisabled ? 'disabled' : ''}`}>
        <div className="step-header">
          <div className="step-number">
            {isCompleted ? <Check size={16} /> : 4}
          </div>
          <div className="step-title-block">
            <h3 className="step-title">Bước 4: Kiểm tra kết quả so khớp điểm</h3>
            <p className="step-description">Đối chiếu danh sách học sinh và dữ liệu điểm từ 2 bảng trước khi ghi vào</p>
          </div>
          <span className={`step-badge ${isCompleted ? 'success' : isActive ? 'inprogress' : 'pending'}`}>
            {isCompleted ? 'Đã xem trước' : isActive ? 'Đang thực hiện' : 'Chờ thực hiện'}
          </span>
        </div>

        {isActive && (
          <div className="step-body">
            <div style={{ marginBottom: '12px', fontSize: '13px', color: 'var(--color-gray-500)' }}>
              Kết quả so khớp học sinh giữa bảng tổng hợp và bảng điểm bộ môn của giáo viên:
            </div>

            <div className="preview-table-container">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>Mã Học Sinh</th>
                    <th>Họ và Tên</th>
                    <th style={{ background: '#eff6ff' }}>Điểm Miệng (Mới)</th>
                    <th style={{ background: '#eff6ff', fontWeight: 'bold' }}>Điểm Giữa Kỳ (Mới)</th>
                    <th style={{ background: '#f0fdf4', fontWeight: 'bold' }}>Điểm Cuối Kỳ (Mới)</th>
                    <th>Trạng thái so khớp</th>
                  </tr>
                </thead>
                <tbody>
                  {displayStudents.map((st, idx) => (
                    <tr
                      key={idx}
                      className={st.status === 'error' ? 'row-error' : st.status === 'warning' ? 'row-warning' : ''}
                    >
                      <td style={{ fontWeight: 'bold' }}>{st.id}</td>
                      <td>{st.name}</td>
                      
                      <td style={{ color: st.mouth === 'Trống' ? '#d69e2e' : 'inherit' }}>{st.mouth}</td>
                      <td style={{ fontWeight: 'bold', color: st.midterm === 'Trống' ? '#e53e3e' : 'var(--color-blue-600)' }}>{st.midterm}</td>
                      <td style={{ fontWeight: 'bold', color: st.final === 'Trống' ? '#e53e3e' : 'var(--color-green-600)' }}>{st.final}</td>

                      <td>
                        {st.status === 'error' ? (
                          <span style={{ color: '#e53e3e', fontSize: '11px', fontWeight: 'bold' }}>Không tìm thấy trong bảng điểm bộ môn</span>
                        ) : st.status === 'warning' ? (
                          <span style={{ color: '#d69e2e', fontSize: '11px' }}>Thiếu một số cột điểm</span>
                        ) : (
                          <span style={{ color: 'var(--color-green-600)', fontSize: '11px' }}>Khớp đầy đủ</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={onPrev}>Quay lại</button>
              <button className="btn btn-primary" onClick={onNext}>
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="step-body">
            <div style={{ fontSize: '13px', color: 'var(--color-gray-700)' }}>
              Đã kiểm tra so khớp dữ liệu của <strong>{displayStudents.length} học sinh</strong> thành công.
            </div>
          </div>
        )}
      </div>

      <div className="step-connector"></div>
    </div>
  );
}
