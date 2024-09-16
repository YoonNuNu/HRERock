# 🎥HRERock
![image](https://github.com/user-attachments/assets/9ec816e1-ff2c-4794-867d-ec6fcf9b66dd)


# 📄프로젝트 소개
![image](https://github.com/user-attachments/assets/c8e44710-e5a1-4acb-9068-bf534f994639)
![image](https://github.com/user-attachments/assets/32d1aeba-536c-46d0-b5b8-4d9a05c84d26)


# 🧑‍💻팀원 소개 및 역할
![image](https://github.com/user-attachments/assets/c4fb1392-9ff1-4677-a53e-74204496bb8d)

# 📔개발 개요
![image](https://github.com/user-attachments/assets/1168a681-f2d2-4ec6-9e3c-261c491793bf)

# 📆개발 일정
![image](https://github.com/user-attachments/assets/dd3957bf-0aa7-4467-936b-1ed14a009064)

# 🔍주요 기능
▶ 영화 기능
  - 영화에 대한 정보 제공 (감독, 배우, 장르, 줄거리, 포스터. 예고편, 본편)
  - 각 영화에 대한 감정/리뷰 포인트와 리뷰의 작성/수정/삭제 기능 제공
  - 각 리뷰에 대한 '좋아요' 기능 구현, 리뷰 리스트의 '좋아요순', '최신순' 정렬 기능 구현
  - 각 영화에 대한 찜 기능 제공
  - 개인별 영화 추천 기능 제공 (리뷰에 작성된 포인트 기반 협업필터링, 컨텐츠필터링, 배우, 감독, 장르의 빈도 기반의 협업기반 필터링)
  - imdb 공식을 활용한 영화 순위 리스트 제공
  - 신규 추가된 영화 리스트 제공 (+ 예고편)
  - 사용자 시청기록 저장을 통해 이어보기, 최근 시청리스트를 시청률을 표시하여 제공
  - 영화 재생 기능을 제공하며, 사용자의 시청기록을 db에 저장

▶ 회원 기능
  - 회원 가입 (아이디, 이메일, 핸드폰번호 중복확인, 이메일 인증코드)
  - 로그인
  - 아이디/비밀번호 찾기 (비밀번호 재설정: 이메일 인증을 통한 재설정 페이지 이동)
  - 회원정보 수정
  - 회원탈퇴

▶ 검색 기능
  - 영화 제목, 제작 감독, 출연 배우, 장르를 기준으로 영화를 검색
  - 검색 순위 기능 제공
    
▶ 챗봇 기능
  - 웹 소켓(WebSocket)을 통한 관리자, 사용자 간의 실시간 채팅

▶ 마이페이지 기능
  - 개인화된 사용자 프로필 사진 설정 기능 제공
  - 최근 시청 내역 조회/삭제 기능 제공
  - 영화의 찜 내역 조회/삭제 기능 제공
  - 개인별 작성 리뷰의 조회/삭제 기능 제공

▶ 관리자페이지 기능
  - 공지사항 작성/수정/삭제 기능 제공
  - 회원 조회/삭제 기능 제공
  - 영화 조회/추가/수정/삭제 기능 제공

# 🛠기술 스택
![image](https://github.com/user-attachments/assets/5c50e200-db18-422e-8ced-23daf6265f54)

# 📂폴더구조
![image](https://github.com/user-attachments/assets/0aa0ab5c-22ff-419a-ad20-8b974a294ada)



주요 구성:
- `data_visualization`: 프론트엔드 관련 파일들
- `src/java`: Java 백엔드 코드
- `src/python`: Python 스크립트 및 데이터 처리 관련 파일들
- 루트 디렉토리: 프로젝트 설정 및 빌드, 임시 생성 관련 파일들
