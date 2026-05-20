import React from 'react';
import { UploadCloud } from 'lucide-react';

export function UploadSection() {
  return (
    <div className="card">
      <div className="card-title">Tải lên file Excel</div>
      <div className="upload-zone">
        <UploadCloud size={36} className="upload-zone-icon" />
        <div className="upload-zone-title">Kéo thả file vào đây</div>
        <div className="upload-zone-hint">Hỗ trợ định dạng .xlsx · .xls — tối đa 20 MB</div>
        <button className="btn btn-secondary">Chọn file từ máy tính</button>
      </div>
    </div>
  );
}
