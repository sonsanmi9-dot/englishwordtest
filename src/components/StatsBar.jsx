import React from 'react';
import { BookMarked, CheckCircle2, Clock, Trophy } from 'lucide-react';

export default function StatsBar({ words }) {
  const total = words.length;
  const memorized = words.filter((w) => w.memorized).length;
  const learning = total - memorized;
  const percentage = total > 0 ? Math.round((memorized / total) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-icon icon-total">
          <BookMarked size={20} />
        </div>
        <div className="stat-meta">
          <span className="stat-label">총 단어 수</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon icon-learning">
          <Clock size={20} />
        </div>
        <div className="stat-meta">
          <span className="stat-label">외우는 중</span>
          <span className="stat-value">{learning}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon icon-memorized">
          <CheckCircle2 size={20} />
        </div>
        <div className="stat-meta">
          <span className="stat-label">외움 완료</span>
          <span className="stat-value">{memorized}</span>
        </div>
      </div>

      <div className="stat-card stat-progress-card">
        <div className="stat-icon icon-trophy">
          <Trophy size={20} />
        </div>
        <div className="stat-meta full-width">
          <div className="progress-header">
            <span className="stat-label">암기 달성률</span>
            <span className="stat-percentage">{percentage}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
