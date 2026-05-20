import React from 'react';

export function ResultSection() {
  return (
    <div className="card">
      <div className="card-title">Kết quả tính toán</div>
      <div className="card-divider" />
      <div className="empty-state">
        <span className="empty-state-text">Tải lên file Excel để xem kết quả tính điểm.</span>
      </div>
    </div>
  );
}
