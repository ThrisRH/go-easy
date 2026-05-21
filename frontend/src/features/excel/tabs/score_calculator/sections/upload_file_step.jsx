import React, { useState } from "react";
import { Check, UploadCloud, FileSpreadsheet, RefreshCw } from "lucide-react";

export function UploadFileStep({
  isActive,
  isCompleted,
  isDisabled,
  file,
  setFile,
  setSourcePreview,
  sourceHeaderRow,
  setSourceHeaderRow,
  sourceDataStartRow,
  setSourceDataStartRow,
  sourcePreview,
  onNext,
  onPrev,
}) {
  const [isLoading, setIsLoading] = useState(false);

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
            // Gọi Backend Go để xử lý dữ liệu file nhị phân của người dùng dưới dạng Base64
            const previewData =
              await window.go.wailsapp.App.PreviewExcelBase64(base64Str);

            setFile({
              name: selectedFile.name,
              size: previewData.totalRows + " dòng điểm mới",
              base64: base64Str,
            });
            setSourcePreview(previewData);
          } else {
            alert(
              "⚠️ LỖI KẾT NỐI: Không tìm thấy Backend Wails!\n\nBạn đang chạy ứng dụng trên Trình duyệt thường (cổng 3000). Tính năng đọc file Excel thật yêu cầu Backend Go hoạt động.\n\nHướng dẫn khắc phục:\n1. Mở Terminal mới.\n2. Chạy lệnh: cd backend && wails dev\n3. Mở ứng dụng Desktop vừa xuất hiện để sử dụng!",
            );
          }
        } catch (error) {
          console.error("Lỗi khi đọc file nguồn Base64:", error);
          alert(
            "❌ LỖI ĐỊNH DẠNG: Không thể đọc file Excel điểm bộ môn. Chi tiết lỗi: " +
              (error.message || error) +
              "\n\nVui lòng kiểm tra lại định dạng file của bạn.",
          );
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleHeaderRowChange = (val) => {
    setSourceHeaderRow(val);
    setSourceDataStartRow(val + 1);
  };

  const handleNext = () => {
    if (file) {
      onNext();
    }
  };

  return (
    <div className={`step-card-wrapper`}>
      <div
        className={`step-card ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${isDisabled ? "disabled" : ""}`}
      >
        <div className="step-header">
          <div className="step-number">
            {isCompleted ? <Check size={16} /> : 2}
          </div>
          <div className="step-title-block">
            <h3 className="step-title">Bước 2: Tải lên bảng điểm bộ môn của giáo viên</h3>
            <p className="step-description">
              Bảng điểm bộ môn là file Excel do chính giáo viên bộ môn tự nhập và theo dõi trong quá trình giảng dạy.
            </p>
          </div>
          <span
            className={`step-badge ${isCompleted ? "success" : isActive ? "inprogress" : "pending"}`}
          >
            {isCompleted
              ? "Đã tải bảng điểm"
              : isActive
                ? "Đang thực hiện"
                : "Chờ thực hiện"}
          </span>
        </div>

        {isActive && (
          <div className="step-body">
            {!file && !isLoading && (
              <div
                className="upload-zone"
                onClick={() =>
                  document.getElementById("source-file-input").click()
                }
              >
                <input
                  id="source-file-input"
                  type="file"
                  accept=".xlsx, .xls"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <UploadCloud size={48} className="upload-zone-icon" />
                <div className="upload-zone-title">
                  Kéo thả bảng điểm bộ môn vào đây
                </div>
                <div className="upload-zone-hint">
                  File Excel do giáo viên bộ môn tự nhập điểm (.xlsx, .xls)
                </div>
                <span
                  className="btn btn-secondary"
                  style={{ marginTop: "12px" }}
                >
                  Chọn bảng điểm bộ môn
                </span>
              </div>
            )}

            {isLoading && (
              <div className="upload-zone" style={{ cursor: "default" }}>
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
                  style={{ marginTop: "12px" }}
                >
                  Đang đọc bảng điểm bộ môn...
                </div>
              </div>
            )}

            {file && !isLoading && (
              <div className="file-info-box" style={{ marginBottom: "12px" }}>
                <div className="file-details">
                  <FileSpreadsheet
                    size={32}
                    style={{ color: "var(--color-green-600)" }}
                  />
                  <div>
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{file.size}</div>
                  </div>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setFile(null);
                    setSourcePreview(null);
                  }}
                  style={{ height: "28px", padding: "0 8px", fontSize: "12px" }}
                >
                  Thay đổi
                </button>
              </div>
            )}

            {/* Bảng xem trước cấu trúc file nguồn (Bảng điểm giáo viên) */}
            {file && sourcePreview && sourcePreview.rows && sourcePreview.rows.length > 0 && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'var(--color-gray-50)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px' }}>
                      Dòng bắt đầu Tiêu đề (Header):
                    </label>
                    <select
                      value={sourceHeaderRow}
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
                      Dòng bắt đầu Dữ liệu điểm học sinh:
                    </label>
                    <select
                      value={sourceDataStartRow}
                      onChange={(e) => setSourceDataStartRow(Number(e.target.value))}
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
                        <option key={r} value={r} disabled={r <= sourceHeaderRow}>
                          Dòng {r} {r === sourceHeaderRow + 1 ? "(Đề xuất)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '6px', maxHeight: '220px', background: '#ffffff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                    <tbody>
                      {sourcePreview.rows.slice(0, 10).map((row, rIdx) => {
                        const isHeader = rIdx === sourceHeaderRow - 1;
                        const isDataStart = rIdx === sourceDataStartRow - 1;
                        const isData = rIdx >= sourceDataStartRow - 1;

                        let rowBg = 'transparent';
                        let labelText = 'Bỏ qua';
                        let labelColor = 'var(--color-gray-500)';

                        if (isHeader) {
                          rowBg = 'rgba(34, 197, 94, 0.08)';
                          labelText = 'Header';
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
                              <td key={cIdx} style={{ padding: '6px 12px', borderRight: '1px solid var(--border-color)', whiteSpace: 'nowrap', color: isData ? 'var(--color-gray-700)' : 'var(--color-gray-900)', fontWeight: isHeader ? '600' : 'normal' }}>
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
                  💡 Chọn chính xác dòng chứa tiêu đề cột (Ví dụ: Họ và tên, GK, CK) và dòng bắt đầu danh sách học sinh có điểm ở bảng trên.
                </span>
              </div>
            )}

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={onPrev}>Quay lại</button>
              <button className="btn btn-primary" onClick={handleNext} disabled={!file || isLoading}>
                Xác nhận & Tiếp tục
              </button>
            </div>
          </div>
        )}

        {isCompleted && file && (
          <div className="step-body">
            <div className="quick-actions" style={{ marginTop: "0px" }}>
              <span className="quick-chip" style={{ cursor: "default" }}>
                Bảng điểm bộ môn: <strong>{file.name}</strong>
              </span>
              <span className="quick-chip" style={{ cursor: "default" }}>
                Tiêu đề: <strong>Dòng {sourceHeaderRow}</strong>
              </span>
              <span className="quick-chip" style={{ cursor: "default" }}>
                Học sinh bắt đầu: <strong>Dòng {sourceDataStartRow}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="step-connector"></div>
    </div>
  );
}
