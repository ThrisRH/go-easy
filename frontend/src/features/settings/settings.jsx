import React from 'react';

export function Settings() {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Cài đặt</h1>
      <p className="page-subtitle">Cấu hình hệ thống và tuỳ chỉnh công cụ theo nhu cầu.</p>

      <div className="card">
        <div className="card-title">Tuỳ chọn chung</div>
        <div className="card-divider" />
        <div className="empty-state">
          <span className="empty-state-text">Chưa có cấu hình nào được áp dụng.</span>
        </div>
      </div>
    </div>
  );
}
