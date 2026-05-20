import React, { useState } from "react";
import "./sidebar.css";
import {
  Home,
  Table2,
  Settings,
  HelpCircle,
  ChevronDown,
  Calculator,
  Search,
} from "lucide-react";

export function Sidebar({
  activeTab,
  setActiveTab,
  activeSubTab,
  setActiveSubTab,
}) {
  const [isExcelOpen, setIsExcelOpen] = useState(true);

  const handleExcelClick = () => {
    setIsExcelOpen(!isExcelOpen);
  };

  const selectTab = (tab, subTab = "") => {
    setActiveTab(tab);
    setActiveSubTab(subTab);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">GE</div>
        <h2>NoName</h2>
      </div>

      <nav className="sidebar-nav">
        <div
          className={`nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => selectTab("home")}
        >
          <Home size={20} />
          <span>Trang chủ</span>
        </div>

        {/* Excel Dropdown */}
        <div className="nav-group">
          <div
            className={`nav-item has-children ${activeTab === "excel" ? "active-parent" : ""}`}
            onClick={handleExcelClick}
          >
            <div className="nav-item-content">
              <Table2 size={20} />
              <span>Công cụ Excel</span>
            </div>
            <ChevronDown
              size={16}
              className={`chevron ${isExcelOpen ? "open" : ""}`}
            />
          </div>

          <div className={`nav-children ${isExcelOpen ? "open" : ""}`}>
            <div
              className={`nav-child-item ${activeTab === "excel" && activeSubTab === "score_calculator" ? "active" : ""}`}
              onClick={() => selectTab("excel", "score_calculator")}
            >
              <Calculator size={18} />
              <span>Tính điểm</span>
            </div>
            <div
              className={`nav-child-item ${activeTab === "excel" && activeSubTab === "lookup" ? "active" : ""}`}
              onClick={() => selectTab("excel", "lookup")}
            >
              <Search size={18} />
              <span>Tra cứu</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div
          className={`nav-item ${activeTab === "support" ? "active" : ""}`}
          onClick={() => selectTab("support")}
        >
          <HelpCircle size={20} />
          <span>Hỗ trợ</span>
        </div>
        <div
          className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => selectTab("settings")}
        >
          <Settings size={20} />
          <span>Cài đặt</span>
        </div>
      </div>
    </aside>
  );
}
