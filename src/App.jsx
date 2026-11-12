import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle } from './firebase';
import {
  subscribeWords,
  addWord,
  updateWord,
  deleteWord,
  toggleWordMemorized
} from './services/wordService';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import WordCard from './components/WordCard';
import WordModal from './components/WordModal';
import {
  Plus,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Database,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [words, setWords] = useState([]);
  const [wordsLoading, setWordsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 검색 및 필터 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'learning' | 'memorized'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'alphabetical'

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState(null);

  // Auth 구독
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 단어 데이터 실시간 구독
  useEffect(() => {
    if (!user) {
      setWords([]);
      setWordsLoading(false);
      return;
    }

    setWordsLoading(true);
    setErrorMsg('');

    const unsubscribe = subscribeWords(
      user.uid,
      (fetchedWords) => {
        setWords(fetchedWords);
        setWordsLoading(false);
      },
      (error) => {
        setWordsLoading(false);
        console.error('Word subscription error:', error);
        if (error.code === 'permission-denied') {
          setErrorMsg(
            'Firestore 접근 권한이 없거나 데이터베이스가 아직 생성되지 않았습니다. Firebase 콘솔에서 Firestore 데이터베이스 및 보안 규칙을 확인해 주세요.'
          );
        } else {
          setErrorMsg('단어를 불러오는 중 오류가 발생했습니다: ' + error.message);
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  // 필터 및 정렬된 단어 목록 계산
  const filteredWords = useMemo(() => {
    let result = [...words];

    // 검색어 필터
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q) ||
          (w.example && w.example.toLowerCase().includes(q))
      );
    }

    // 상태 필터
    if (statusFilter === 'learning') {
      result = result.filter((w) => !w.memorized);
    } else if (statusFilter === 'memorized') {
      result = result.filter((w) => w.memorized);
    }

    // 정렬
    if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.word.localeCompare(b.word));
    }
    // 'newest'는 Firestore 쿼리에서 이미 정렬되어 옴

    return result;
  }, [words, searchQuery, statusFilter, sortBy]);

  // 추가 / 수정 핸들러
  const handleModalSubmit = async (formData) => {
    if (!user) return;
    if (editingWord) {
      await updateWord(user.uid, editingWord.id, formData);
    } else {
      await addWord(user.uid, formData);
    }
  };

  // 삭제 핸들러
  const handleDeleteWord = async (wordId, wordText) => {
    if (!user) return;
    if (window.confirm(`'${wordText}' 단어를 삭제하시겠습니까?`)) {
      try {
        await deleteWord(user.uid, wordId);
      } catch (err) {
        alert('삭제 실패: ' + err.message);
      }
    }
  };

  // 외움 토글
  const handleToggleMemorized = async (wordId, currentStatus) => {
    if (!user) return;
    try {
      await toggleWordMemorized(user.uid, wordId, currentStatus);
    } catch (err) {
      alert('상태 변경 실패: ' + err.message);
    }
  };

  // 모달 열기
  const openAddModal = () => {
    setEditingWord(null);
    setIsModalOpen(true);
  };

  const openEditModal = (wordItem) => {
    setEditingWord(wordItem);
    setIsModalOpen(true);
  };

  return (
    <div className="app-layout">
      <Navbar user={user} loading={authLoading} />

      <main className="main-content">
        {authLoading ? (
          <div className="loading-fullscreen">
            <div className="spinner" />
            <p>사용자 정보를 불러오는 중입니다...</p>
          </div>
        ) : !user ? (
          /* 비로그인 랜딩 페이지 */
          <section className="hero-landing">
            <div className="hero-badge">
              <Sparkles size={16} /> Firebase Firestore 연동 웹 단어장
            </div>
            <h1 className="hero-title">
              나만의 스마트한 <br />
              <span className="text-gradient">영어 단어장</span>
            </h1>
            <p className="hero-desc">
              단어, 한글 뜻, 맞춤 예문부터 원어민 발음 듣기까지! <br />
              Google 계정으로 로그인하면 언제 어디서든 나만의 단어장이 Firestore에 안전하게 보관됩니다.
            </p>

            <div className="hero-cta-box">
              <button onClick={loginWithGoogle} className="btn-hero-login">
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="google-icon"
                />
                Google 계정으로 시작하기
              </button>
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon icon-auth">
                  <ShieldCheck size={24} />
                </div>
                <h3>개인별 안전한 보관</h3>
                <p>Firestore의 <code>users/&#123;userId&#125;</code> 경로 아래에 저장되어 본인만 조회하고 관리할 수 있습니다.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon icon-sync">
                  <Database size={24} />
                </div>
                <h3>실시간 클라우드 동기화</h3>
                <p>단어를 추가하거나 수정한 내용이 실시간으로 반영되어 기기를 바꾸어도 항상 유지됩니다.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon icon-study">
                  <BookOpen size={24} />
                </div>
                <h3>스마트 암기 학습 모드</h3>
                <p>외운 단어 체크, 뜻 가리기 셀프 테스트, TTS 발음 듣기 기능으로 효율적인 학습을 지원합니다.</p>
              </div>
            </div>
          </section>
        ) : (
          /* 로그인 후 메인 대시보드 */
          <section className="dashboard">
            {errorMsg && (
              <div className="alert-box error">
                <AlertCircle size={20} />
                <div>
                  <strong>알림: </strong>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            <div className="dashboard-header">
              <div>
                <h2 className="dashboard-title">
                  {user.displayName ? `${user.displayName}님의 단어장` : '나만의 단어장'}
                </h2>
                <p className="dashboard-sub">
                  Firestore 경로: <code>users/{user.uid}/words</code>
                </p>
              </div>
              <button onClick={openAddModal} className="btn-add-word">
                <Plus size={18} />
                <span>새 단어 추가</span>
              </button>
            </div>

            {/* 통계 요약 바 */}
            <StatsBar words={words} />

            {/* 컨트롤 바 (검색, 필터, 정렬) */}
            <div className="controls-bar">
              <div className="search-wrap">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="단어, 뜻, 예문 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-group">
                <div className="filter-tabs">
                  <button
                    className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                  >
                    전체 ({words.length})
                  </button>
                  <button
                    className={`tab-btn ${statusFilter === 'learning' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('learning')}
                  >
                    외우는 중 ({words.filter((w) => !w.memorized).length})
                  </button>
                  <button
                    className={`tab-btn ${statusFilter === 'memorized' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('memorized')}
                  >
                    외움 완료 ({words.filter((w) => w.memorized).length})
                  </button>
                </div>

                <div className="sort-dropdown-wrap">
                  <ArrowUpDown size={15} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="select-sort"
                  >
                    <option value="newest">최신순</option>
                    <option value="alphabetical">알파벳순 (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 단어 카드 목록 */}
            {wordsLoading ? (
              <div className="loading-card-list">
                <div className="spinner" />
                <p>단어장을 불러오는 중입니다...</p>
              </div>
            ) : filteredWords.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📖</div>
                {searchQuery || statusFilter !== 'all' ? (
                  <>
                    <h3>조건에 맞는 단어가 없습니다</h3>
                    <p>검색어를 변경하거나 다른 필터 탭을 선택해 보세요.</p>
                  </>
                ) : (
                  <>
                    <h3>등록된 단어가 아직 없습니다</h3>
                    <p>상단의 '+ 새 단어 추가' 버튼을 눌러 첫 단어를 등록해 보세요!</p>
                    <button onClick={openAddModal} className="btn-primary mt-3">
                      <Plus size={16} /> 첫 단어 추가하기
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="word-grid">
                {filteredWords.map((wordItem) => (
                  <WordCard
                    key={wordItem.id}
                    wordItem={wordItem}
                    onEdit={openEditModal}
                    onDelete={handleDeleteWord}
                    onToggleMemorized={handleToggleMemorized}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* 단어 추가/수정 모달 */}
      <WordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingWord}
      />
    </div>
  );
}
