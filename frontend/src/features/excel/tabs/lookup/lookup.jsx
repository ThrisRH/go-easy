import React from 'react';

export function Lookup() {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Tra cứu</h1>
      <p className="page-subtitle">Tìm kiếm thông tin học sinh theo mã số hoặc họ tên.</p>

      <div className="card">
        <div className="card-title">Tìm kiếm</div>
        <div className="input-row">
          <input
            className="form-input"
            type="text"
            placeholder="Nhập mã số hoặc họ tên..."
          />
          <button className="btn btn-primary">Tra cứu</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Kết quả</div>
        <div className="card-divider" />
        <div className="empty-state">
          <span className="empty-state-text">Nhập từ khoá và nhấn Tra cứu để xem kết quả.</span>
        </div>
      </div>
    </div>
  );
}
