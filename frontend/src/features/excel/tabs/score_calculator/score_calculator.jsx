import React from 'react';
import { UploadSection } from './sections/upload_section';
import { ResultSection } from './sections/result_section';

export function ScoreCalculator() {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Tính điểm</h1>
      <p className="page-subtitle">Tải lên file Excel — hệ thống sẽ tự động tính toán và xuất kết quả điểm số.</p>
      <UploadSection />
      <ResultSection />
    </div>
  );
}
