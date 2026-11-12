# 나만의 영어 단어장 (English Wordbook)

Firebase(Auth, Firestore)와 Vite + React로 제작된 개인 맞춤형 영어 단어장 웹 애플리케이션입니다.

---

## 🌟 주요 기능

1. **Google 계정 로그인 / 로그아웃**
   - Google 계정으로 1초 만에 간편 로그인
   - 로그인된 사용자 프로필(이름, 이메일, 프로필 사진) 표시

2. **실시간 Firestore 클라우드 동기화**
   - 단어 추가, 수정, 삭제, 암기 상태 변경 시 실시간 반영
   - 기기를 변경하거나 새로고침해도 데이터 영구 보존

3. **철저한 사용자별 데이터 격리**
   - 모든 단어 데이터는 Firestore의 `users/{userId}/words/{wordId}` 경로에 저장
   - 본인의 데이터만 조회/수정/삭제 가능 (보안 규칙 적용)

4. **스마트 학습 편의 기능**
   - 🔊 **원어민 발음 듣기 (TTS)**: Web Speech API를 활용한 영어 발음 듣기 지원
   - 🔒 **뜻 가리기 (암기 테스트 모드)**: 카드를 뒤집듯이 뜻을 가려 셀프 테스트 가능
   - 📊 **암기 달성률 & 통계 대시보드**: 전체 단어 수, 외우는 중, 외움 완료 및 달성률(%) 시각화
   - 🔍 **실시간 검색 및 필터링**: 단어/뜻/예문 검색, 상태별 필터(전체/외우는 중/외움 완료), 최신순/알파벳순 정렬

---

## 🚀 로컬 실행 방법

1. **터미널에서 프로젝트 폴더로 이동:**
   ```bash
   cd c:\Users\user\Desktop\AI연습\englishwordtest
   ```

2. **개발 서버 실행:**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:5173` 링크가 열립니다.

---

## ⚙️ Firebase 콘솔 필수 설정 안내 (최초 1회)

웹앱이 Firebase와 정상적으로 통신하려면 Firebase 웹 콘솔에서 아래 **2가지**를 활성화해야 합니다:

### 1. Google 로그인 활성화
1. [Firebase Console](https://console.firebase.google.com/) 접속 -> `englishwordtest` 프로젝트 선택
2. 좌측 메뉴 **Build(빌드)** -> **Authentication** 클릭 -> **시작하기(Get Started)**
3. **Sign-in method** 탭에서 **Google** 선택 -> **사용 설정(Enable)** 토글 켜기 -> 프로젝트 지원 이메일 선택 후 **저장**

### 2. Cloud Firestore 활성화
1. 좌측 메뉴 **Build(빌드)** -> **Firestore Database** 클릭 -> **데이터베이스 만들기(Create database)**
2. 위치 선택 (예: `asia-northeast3` 서울)
3. 보안 규칙은 우선 **테스트 모드**로 시작하시거나, 프로젝트 폴더에 생성된 `firestore.rules` 파일 내용을 복사하여 **규칙(Rules)** 탭에 붙여넣고 게시하시면 완벽한 보안이 적용됩니다.

---

## 📁 프로젝트 구조

```text
englishwordtest/
├── .env                  # VITE_FIREBASE_* 환경 변수 (설정 완료)
├── .env.example          # 환경 변수 템플릿
├── firestore.rules       # Firestore 보안 규칙 (users/{userId} 격리)
├── index.html            # 웹앱 진입 HTML
├── package.json          # 의존성 패키지 명세
├── vite.config.js        # Vite 설정 파일
└── src/
    ├── firebase.js       # Firebase SDK 초기화 및 Auth/Firestore export
    ├── main.jsx          # React 엔트리포인트
    ├── App.jsx           # 메인 대시보드 및 라우팅 로직
    ├── index.css         # 모던 반응형 스타일시트
    ├── services/
    │   └── wordService.js# Firestore CRUD 및 실시간 구독 함수
    └── components/
        ├── Navbar.jsx    # 상단 내비게이션 & 로그인/로그아웃
        ├── StatsBar.jsx  # 통계 및 암기 달성률 바
        ├── WordCard.jsx  # 개별 단어 카드 (TTS, 뜻 가리기, 외움 토글)
        └── WordModal.jsx # 단어 추가 / 수정 모달
```
