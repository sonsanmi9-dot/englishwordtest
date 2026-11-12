import React, { useState, useEffect } from 'react';
import { X, Plus, Save, BookOpen, FileText, CheckSquare, Square } from 'lucide-react';

export default function WordModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [memorized, setMemorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setWord(initialData.word || '');
      setMeaning(initialData.meaning || '');
      setExample(initialData.example || '');
      setMemorized(Boolean(initialData.memorized));
    } else {
      setWord('');
      setMeaning('');
      setExample('');
      setMemorized(false);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim()) {
      setError('영어 단어를 입력해 주세요.');
      return;
    }
    if (!meaning.trim()) {
      setError('단어의 뜻을 입력해 주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit({
        word: word.trim(),
        meaning: meaning.trim(),
        example: example.trim(),
        memorized
      });
      onClose();
    } catch (err) {
      setError(err.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              {isEditMode ? <Save size={20} /> : <Plus size={20} />}
            </div>
            <h3>{isEditMode ? '단어 수정' : '새 단어 추가'}</h3>
          </div>
          <button onClick={onClose} className="btn-icon-close" title="닫기">
            <X size={20} />
          </button>
        </div>

        {error && <div className="modal-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="word">
              <BookOpen size={15} /> 영어 단어 <span className="required">*</span>
            </label>
            <input
              id="word"
              type="text"
              placeholder="예: resilient, ubiquitous, meticulous"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="meaning">
              <FileText size={15} /> 뜻 (한글) <span className="required">*</span>
            </label>
            <input
              id="meaning"
              type="text"
              placeholder="예: 회복력 있는, 탄력 있는"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="example">
              <span>✍️</span> 예문 (선택)
            </label>
            <textarea
              id="example"
              rows={3}
              placeholder="예: She showed a resilient spirit during the crisis."
              value={example}
              onChange={(e) => setExample(e.target.value)}
            />
          </div>

          <div className="form-check-group" onClick={() => setMemorized(!memorized)}>
            <button type="button" className="checkbox-btn">
              {memorized ? <CheckSquare size={20} className="text-primary" /> : <Square size={20} />}
            </button>
            <div className="check-label-wrap">
              <span className="check-label">외움 완료 표시</span>
              <span className="check-sub">체크하면 '외움 완료' 상태로 등록됩니다.</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>
              취소
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : isEditMode ? '수정 완료' : '단어 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
