import React, { useState } from "react";
import { Check, FileSpreadsheet, RefreshCw } from "lucide-react";

export function ClassSubjectStep({
  isActive,
  isCompleted,
  selectedSubject,
  setSelectedSubject,
  targetFile,
  setTargetFile,
  setTargetPreview,
  targetHeaderRow,
  setTargetHeaderRow,
  targetDataStartRow,
  setTargetDataStartRow,
  targetPreview,
  onNext,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const subjects = [
    { value: "math", label: "Toán học" },
    { value: "physics", label: "Vật lý" },
    { value: "chemistry", label: "Hóa học" },
    { value: "literature", label: "Ngữ văn" },
    { value: "english", label: "Tiếng Anh" },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          let base64Str = event.target.result;
          const commaIdx = base64Str.indexOf(",");
          if (commaIdx !== -1) {
            base64Str = base64Str.substring(commaIdx + 1);
          }

          if (window.go && window.go.wailsapp && window.go.wailsapp.App) {
            // Gọi Backend Go xử lý chuỗi Base64 file Excel của người dùng
            const previewData =
              await window.go.wailsapp.App.PreviewExcelBase64(base64Str);

            setTargetFile({
              name: selectedFile.name,
              size: previewData.totalRows + " dòng dữ liệu",
              base64: base64Str,
            });
            setTargetPreview(previewData);
          } else {
            alert(
              "⚠️ LỖI KẾT NỐI: Không tìm thấy Backend Wails!\n\nBạn đang chạy ứng dụng trên Trình duyệt thường (cổng 3000). Tính năng đọc file Excel thật yêu cầu Backend Go hoạt động.\n\nHướng dẫn khắc phục:\n1. Mở Terminal mới.\n2. Chạy lệnh: cd backend && wails dev\n3. Mở ứng dụng Desktop vừa xuất hiện để sử dụng!",
            );
          }
        } catch (error) {
          console.error("Lỗi khi đọc file đích Base64:", error);
          alert(
            "❌ LỖI ĐỊNH DẠNG: Không thể phân tích file Excel này!\n\nChi tiết lỗi: " +
              (error.message || error) +
              "\n\nVui lòng đảm bảo file của bạn là file Excel hợp lệ (.xlsx) và không bị mật khẩu bảo vệ.",
          );
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleHeaderRowChange = (val) => {
    setTargetHeaderRow(val);
    // Tự động đẩy dòng dữ liệu bắt đầu xuống dưới header (Header 1 và Header 2 chiếm 2 dòng)
    setTargetDataStartRow(val + 2);
  };

  const handleNext = () => {
    if (selectedSubject && targetFile) {
      onNext();
    }
  };

  return (
    <div className={`step-card-wrapper`}>
      <div
        className={`step-card ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
      >
        <div className="step-header">
          <div className="step-number">
            {isCompleted ? <Check size={16} /> : 1}
          </div>
          <div className="step-title-block">
            <h3 className="step-title">
              Bước 1: Chọn môn học và tải lên bảng tổng hợp điểm lớp
            </h3>
            <p className="step-description">
              Tải lên bảng tổng hợp điểm lớp do giáo viên chủ nhiệm hoặc nhà trường cung cấp — đây là file chứa danh sách học sinh với các cột điểm còn trống cần được điền.
            </p>
          </div>
          <span
            className={`step-badge ${isCompleted ? "success" : isActive ? "inprogress" : "pending"}`}
          >
            {isCompleted
              ? "Hoàn tất"
              : isActive
                ? "Đang thực hiện"
                : "Chờ thực hiện"}
          </span>
        </div>

        {isActive && (
          <div className="step-body">
            <div
              className="selection-grid"
              style={{
                gridTemplateColumns: "1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="subject-select">
                  Môn học cần nhập điểm
                </label>
                <select
                  id="subject-select"
                  className="mapping-select"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">-- Chọn môn học --</option>
                  {subjects.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <span className="form-helper">
                  Điểm sẽ được ghi vào đúng cột của môn học này trong bảng tổng hợp
                </span>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label className="form-label">
                Bảng tổng hợp điểm lớp <span style={{ color: '#e53e3e' }}>*</span>
              </label>
              {!targetFile && !isLoading && (
                <div
                  className="upload-zone"
                  onClick={() =>
                    document.getElementById("target-file-input").click()
                  }
                  style={{ padding: "24px 16px" }}
                >
                  <input
                    id="target-file-input"
                    type="file"
                    accept=".xlsx, .xls"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <FileSpreadsheet size={32} className="upload-zone-icon" />
                  <div
                    className="upload-zone-title"
                    style={{ fontSize: "13px" }}
                  >
                    Nhấp để chọn bảng tổng hợp điểm lớp
                  </div>
                  <div
                    className="upload-zone-hint"
                    style={{ fontSize: "11px" }}
                  >
                    File do giáo viên chủ nhiệm hoặc nhà trường cung cấp (.xlsx, .xls)
                  </div>
                </div>
              )}

              {isLoading && (
                <div
                  className="upload-zone"
                  style={{ cursor: "default", padding: "24px 16px" }}
                >
                  <RefreshCw
                    size={32}
                    className="upload-zone-icon spinning"
                    style={{
                      color: "var(--color-green-600)",
                      animation: "spin 2s linear infinite",
                    }}
                  />
                  <div
                    className="upload-zone-title"
                    style={{ fontSize: "13px", marginTop: "8px" }}
                  >
                    Đang đọc bảng tổng hợp điểm lớp...
                  </div>
                </div>
              )}

              {targetFile && !isLoading && (
                <div className="file-info-box" style={{ marginBottom: '12px' }}>
                  <div className="file-details">
                    <FileSpreadsheet
                      size={24}
                      style={{ color: "var(--color-green-600)" }}
                    />
                    <div>
                      <div className="file-name" style={{ fontSize: "13px" }}>
                        {targetFile.name}
                      </div>
                      <div className="file-size" style={{ fontSize: "11px" }}>
                        {targetFile.size}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setTargetFile(null);
                      setTargetPreview(null);
                    }}
                    style={{
                      height: "28px",
                      padding: "0 8px",
                      fontSize: "12px",
                    }}
                  >
                    Thay đổi
                  </button>
                </div>
              )}

              {/* Bảng xem trước cấu trúc file Tổng để cấu hình dòng bắt đầu */}
              {targetFile && targetPreview && targetPreview.rows && targetPreview.rows.length > 0 && (
                <div style={{ marginTop: '20px', padding: '16px', background: 'var(--color-gray-50)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '12px' }}>
                        Dòng bắt đầu Tiêu đề (Header 1):
                      </label>
                      <select
                        value={targetHeaderRow}
                        onChange={(e) => handleHeaderRowChange(Number(e.target.value))}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: '#ffffff',
                          cursor: 'pointer',
                          width: '100%',
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(r => (
                          <option key={r} value={r}>Dòng {r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '12px' }}>
                        Dòng bắt đầu Dữ liệu học sinh:
                      </label>
                      <select
                        value={targetDataStartRow}
                        onChange={(e) => setTargetDataStartRow(Number(e.target.value))}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: '#ffffff',
                          cursor: 'pointer',
                          width: '100%',
                        }}
                      >
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(r => (
                          <option key={r} value={r} disabled={r <= targetHeaderRow}>
                            Dòng {r} {r === targetHeaderRow + 2 ? "(Đề xuất)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '6px', maxHeight: '220px', background: '#ffffff' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                      <tbody>
                        {targetPreview.rows.slice(0, 10).map((row, rIdx) => {
                          const isHeader1 = rIdx === targetHeaderRow - 1;
                          const isHeader2 = rIdx === targetHeaderRow;
                          const isDataStart = rIdx === targetDataStartRow - 1;
                          const isData = rIdx >= targetDataStartRow - 1;

                          let rowBg = 'transparent';
                          let labelText = 'Bỏ qua';
                          let labelColor = 'var(--color-gray-500)';

                          if (isHeader1) {
                            rowBg = 'rgba(34, 197, 94, 0.08)';
                            labelText = 'Header 1';
                            labelColor = 'var(--color-green-700)';
                          } else if (isHeader2) {
                            rowBg = 'rgba(34, 197, 94, 0.04)';
                            labelText = 'Header 2';
                            labelColor = 'var(--color-green-700)';
                          } else if (isDataStart) {
                            rowBg = 'rgba(245, 158, 11, 0.08)';
                            labelText = 'Bắt đầu Dữ liệu';
                            labelColor = 'var(--color-amber-700)';
                          } else if (isData) {
                            rowBg = 'rgba(59, 130, 246, 0.02)';
                            labelText = 'Dữ liệu';
                            labelColor = 'var(--color-blue-600)';
                          }

                          return (
                            <tr key={rIdx} style={{ background: rowBg, borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '6px 8px', fontWeight: 'bold', color: 'var(--color-gray-500)', borderRight: '1px solid var(--border-color)', width: '35px', textAlign: 'center', background: 'var(--color-gray-50)' }}>
                                {rIdx + 1}
                              </td>
                              <td style={{ padding: '6px 8px', fontWeight: '600', color: labelColor, borderRight: '1px solid var(--border-color)', width: '90px' }}>
                                {labelText}
                              </td>
                              {(row || []).map((cell, cIdx) => (
                                <td key={cIdx} style={{ padding: '6px 12px', borderRight: '1px solid var(--border-color)', whiteSpace: 'nowrap', color: isData ? 'var(--color-gray-700)' : 'var(--color-gray-900)', fontWeight: (isHeader1 || isHeader2) ? '600' : 'normal' }}>
                                  {cell || ''}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <span className="form-helper" style={{ marginTop: '8px', display: 'block', fontSize: '11px', color: 'var(--color-gray-500)' }}>
                    💡 Giáo viên có thể tự do điều chỉnh Tiêu đề môn học và điểm xuất phát của học sinh ở bảng trên để phù hợp với bố cục riêng biệt của file Excel.
                  </span>
                </div>
              )}
            </div>

            <div className="step-actions">
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!selectedSubject || !targetFile || isLoading}
              >
                Xác nhận & Tiếp tục
              </button>
            </div>
          </div>
        )}

        {isCompleted && targetFile && (
          <div className="step-body">
            <div className="quick-actions" style={{ marginTop: "0px" }}>
              <span className="quick-chip" style={{ cursor: "default" }}>
                Môn học:{" "}
                <strong>
                  {subjects.find((s) => s.value === selectedSubject)?.label}
                </strong>
              </span>
              <span className="quick-chip" style={{ cursor: "default" }}>
                Bảng tổng hợp: <strong>{targetFile.name}</strong>
              </span>
              <span className="quick-chip" style={{ cursor: "default" }}>
                Tiêu đề: <strong>Dòng {targetHeaderRow}</strong>
              </span>
              <span className="quick-chip" style={{ cursor: "default" }}>
                Học sinh bắt đầu: <strong>Dòng {targetDataStartRow}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="step-connector"></div>
    </div>
  );
}
