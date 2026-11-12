import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

// 단어 목록 실시간 구독 (users/{userId}/words)
export const subscribeWords = (userId, onNext, onError) => {
  if (!userId) return () => {};

  const wordsRef = collection(db, 'users', userId, 'words');
  const q = query(wordsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const words = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      onNext(words);
    },
    (error) => {
      console.error('Firestore Subscribe Error:', error);
      if (onError) onError(error);
    }
  );
};

// 단어 추가
export const addWord = async (userId, { word, meaning, example, memorized = false }) => {
  if (!userId) throw new Error('로그인이 필요합니다.');

  const wordsRef = collection(db, 'users', userId, 'words');
  const docRef = await addDoc(wordsRef, {
    word: word.trim(),
    meaning: meaning.trim(),
    example: example ? example.trim() : '',
    memorized: Boolean(memorized),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

// 단어 수정
export const updateWord = async (userId, wordId, { word, meaning, example, memorized }) => {
  if (!userId || !wordId) throw new Error('잘못된 요청입니다.');

  const wordRef = doc(db, 'users', userId, 'words', wordId);
  const updateData = {
    updatedAt: serverTimestamp()
  };

  if (word !== undefined) updateData.word = word.trim();
  if (meaning !== undefined) updateData.meaning = meaning.trim();
  if (example !== undefined) updateData.example = example ? example.trim() : '';
  if (memorized !== undefined) updateData.memorized = Boolean(memorized);

  await updateDoc(wordRef, updateData);
};

// 외움 여부 토글
export const toggleWordMemorized = async (userId, wordId, currentStatus) => {
  if (!userId || !wordId) return;
  const wordRef = doc(db, 'users', userId, 'words', wordId);
  await updateDoc(wordRef, {
    memorized: !currentStatus,
    updatedAt: serverTimestamp()
  });
};

// 단어 삭제
export const deleteWord = async (userId, wordId) => {
  if (!userId || !wordId) throw new Error('잘못된 요청입니다.');
  const wordRef = doc(db, 'users', userId, 'words', wordId);
  await deleteDoc(wordRef);
};
