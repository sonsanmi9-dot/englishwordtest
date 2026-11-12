import React from 'react';
import { BookOpen, LogIn, LogOut, Sparkles } from 'lucide-react';
import { loginWithGoogle, logout } from '../firebase';

export default function Navbar({ user, loading }) {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        alert('로그인 중 오류가 발생했습니다: ' + err.message);
      }
    }
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        await logout();
      } catch (err) {
        alert('로그아웃 실패: ' + err.message);
      }
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <div className="brand-icon">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="brand-title">
              나만의 영어 단어장
              <span className="badge-beta">
                <Sparkles size={12} /> Cloud Sync
              </span>
            </div>
            <div className="brand-subtitle">englishwordtest · Firestore 연동</div>
          </div>
        </div>

        <div className="nav-actions">
          {loading ? (
            <div className="skeleton-pill">계정 확인 중...</div>
          ) : user ? (
            <div className="user-profile">
              <div className="user-avatar-wrap">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
                ) : (
                  <div className="user-avatar-fallback">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{user.displayName || '사용자'}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="로그아웃">
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="btn-google-login">
              <LogIn size={18} />
              <span>Google로 로그인</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
