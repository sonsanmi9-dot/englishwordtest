import React, { useState } from 'react';
import { Volume2, Edit2, Trash2, CheckCircle, Circle, Eye, EyeOff } from 'lucide-react';

export default function WordCard({ wordItem, onEdit, onDelete, onToggleMemorized }) {
  const [hideMeaning, setHideMeaning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('브라우저가 음성 읽기(TTS)를 지원하지 않습니다.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(wordItem.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`word-card ${wordItem.memorized ? 'is-memorized' : ''}`}>
      <div className="card-top-row">
        <button
          className={`btn-memorize-toggle ${wordItem.memorized ? 'memorized' : 'learning'}`}
          onClick={() => onToggleMemorized(wordItem.id, wordItem.memorized)}
          title={wordItem.memorized ? '외움 완료됨 (클릭하여 취소)' : '외우는 중 (클릭하여 외움 완료)'}
        >
          {wordItem.memorized ? (
            <>
              <CheckCircle size={15} />
              <span>외움 완료</span>
            </>
          ) : (
            <>
              <Circle size={15} />
              <span>외우는 중</span>
            </>
          )}
        </button>

        <div className="card-actions">
          <button
            className="btn-card-action"
            onClick={() => setHideMeaning(!hideMeaning)}
            title={hideMeaning ? '뜻 보기' : '뜻 가리기 (암기 테스트)'}
          >
            {hideMeaning ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            className="btn-card-action"
            onClick={() => onEdit(wordItem)}
            title="수정"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn-card-action btn-delete"
            onClick={() => onDelete(wordItem.id, wordItem.word)}
            title="삭제"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="card-word-section">
        <div className="word-heading-wrap">
          <h4 className="word-text">{wordItem.word}</h4>
          <button
            className={`btn-pronounce ${isSpeaking ? 'speaking' : ''}`}
            onClick={handleSpeak}
            title="발음 듣기"
          >
            <Volume2 size={18} />
          </button>
        </div>

        <div className="word-meaning-wrap">
          {hideMeaning ? (
            <div
              className="meaning-hidden-mask"
              onClick={() => setHideMeaning(false)}
              title="클릭하여 뜻 확인"
            >
              🔒 뜻 가림 (클릭하여 확인)
            </div>
          ) : (
            <p className="word-meaning">{wordItem.meaning}</p>
          )}
        </div>
      </div>

      {wordItem.example && (
        <div className="word-example-section">
          <span className="example-label">예문</span>
          <p className="example-text">{wordItem.example}</p>
        </div>
      )}
    </div>
  );
}
