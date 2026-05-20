import React, { useState } from "react";
import "./app.css";
import { Sidebar } from "./components/sidebar/sidebar";
import { Home } from "./features/home/home";
import { Excel } from "./features/excel/excel";
import { Support } from "./features/support/support";
import { Settings } from "./features/settings/settings";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeSubTab, setActiveSubTab] = useState("");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "excel":
        return <Excel activeSubTab={activeSubTab} />;
      case "support":
        return <Support />;
      case "settings":
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />
      <main className="main-content">{renderContent()}</main>
    </div>
  );
}
