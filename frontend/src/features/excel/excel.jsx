import React from 'react';

export function Excel({ activeSubTab }) {
  // lazy-load sub-tabs only when needed
  const { ScoreCalculator } = require('./tabs/score_calculator/score_calculator');
  const { Lookup } = require('./tabs/lookup/lookup');

  switch (activeSubTab) {
    case 'score_calculator':
      return <ScoreCalculator />;
    case 'lookup':
      return <Lookup />;
    default:
      return (
        <div className="page-wrapper">
          <h1 className="page-title">Công cụ Excel</h1>
          <p className="page-subtitle">Chọn một công cụ từ menu bên trái để bắt đầu.</p>
          <div className="card">
            <div className="empty-state">
              <span className="empty-state-text">Chưa chọn công cụ nào.</span>
            </div>
          </div>
        </div>
      );
  }
}
