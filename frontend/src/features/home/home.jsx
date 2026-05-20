import React from "react";
import { Table2, Calculator, Search } from "lucide-react";

export function Home() {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Trang chủ</h1>
      <p className="page-subtitle">
        Chào mừng bạn đến với NoName — bộ công cụ xử lý dữ liệu Excel.
      </p>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Tổng file đã xử lý</div>
          <div className="stat-value">—</div>
          <div className="stat-meta">Chưa có dữ liệu</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Lần dùng cuối</div>
          <div className="stat-value">—</div>
          <div className="stat-meta">Chưa có dữ liệu</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Công cụ khả dụng</div>
          <div className="stat-value">2</div>
          <div className="stat-meta">Tính điểm · Tra cứu</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Bắt đầu nhanh</div>
        <p
          style={{
            fontSize: "var(--font-size-sm)",
            color: "var(--color-gray-500)",
            marginBottom: "var(--space-5)",
          }}
        >
          Chọn một công cụ từ menu bên trái hoặc nhấn vào nút bên dưới.
        </p>
        <div className="quick-actions">
          <span className="quick-chip">
            <Calculator size={15} /> Tính điểm Excel
          </span>
          <span className="quick-chip">
            <Search size={15} /> Tra cứu dữ liệu
          </span>
        </div>
      </div>
    </div>
  );
}
