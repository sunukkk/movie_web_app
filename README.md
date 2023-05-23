# Movie web app
넷플릭스와 같은 구성의 영화 앱입니다.<br />
Axios를 사용해 외부 API(TMDB)의 데이터를 전달받아 보여줍니다.<br />
Firebase로 회원가입, 로그인 및 소셜로그인 기능, 프로필 설정 및 좋아요 기능을 구현했습니다.<br />
일부 컴포넌트에는 styledComponent 가 적용되어있습니다.<br />

### 제작에 사용된 기술목록
<a href="/" target="_blank"><img src="https://img.shields.io/badge/Javascript-EEE?style=for-the-badge&logo=javascript&logoColor=F7DF1E"/></a> 
<a href="/" target="_blank"><img src="https://img.shields.io/badge/html5-EEE?style=for-the-badge&logo=html5&logoColor=E34F26"/></a> 
<a href="/" target="_blank"><img src="https://img.shields.io/badge/css3-EEE?style=for-the-badge&logo=css3&logoColor=1572B6"/></a> 
<a href="/" target="_blank"><img src="https://img.shields.io/badge/sass-EEE?style=for-the-badge&logo=sass&logoColor=CC6699"/></a>
<a href="/" target="_blank"><img src="https://img.shields.io/badge/styledcomponents-EEE?style=for-the-badge&logo=styledcomponents&logoColor=F24E1E"/></a> 
<a href="/" target="_blank"><img src="https://img.shields.io/badge/react-EEE?style=for-the-badge&logo=react&logoColor=61DAFB"/></a>
<a href="/" target="_blank"><img src="https://img.shields.io/badge/firebase-EEE?style=for-the-badge&logo=firebase&logoColor=FFCA28"/></a>

### 주요 내용
- React로 만든 웹페이지 입니다.
- Firebase를 사용해 NoSQL 기반 서버리스 구조의 웹앱입니다.
- Firebase Authentication를 사용해 회원가입 및 로그인, 소셜로그인 기능을 구현했습니다.
- Firebase Database, Storage를 사용해 각계정의 프로필 및 좋아요 목록 기능을 구현했습니다.
   - 계정마다 5개의 프로필을 가질 수 있고, 각 프로필마다 좋아요 목록이 따로 저장됩니다.
- 검색 기능, Modal 관련 사용자 정의 Hook 함수를 제작해 사용했습니다.
- Axios로 TMDB API를 호출해 영화관련 데이터를 받아서 Modal에 출력합니다.
- Swiper 라이브러리로 각 영화 목록의 캐러셀을 구현했습니다.

### 사용된 주요 라이브러리
- axios : api통신을 위해 사용했습니다.
- gh-pages: GitHub 페이지에 정적 리소스를 호스팅했습니다.
- react-router-dom 으로 React 기반 SPA의 라우팅을 관리합니다.
- sass : scss, styledcomponent를 활용한 스타일링으로 제작했습니다.
- fontawesome : 아이콘을 위해 사용한 라이브러리입니다.

### 특이사항
- 영화정보등을 보여주는 Modal에서, <br />
  axios 모듈로 api를요청 할 때, 한국어의 정보를 받아오기 위해 ko-KR 쿼리 파라미터를 추가하면, <br />
  이미지 등 다른 정보를 못받아오기때문에(쿼리 파라미터를 추가하면 포스터등의 이미지가 포함되어있지 않음), <br />
  axiosimage 모듈을 추가로 제작해 기본설정(영어) 데이터에 있는 <br />
  이미지(poster)들 중 언어(iso_639_1)가 ko 인 이미지들의 배열을 필터링해 매핑했습니다.

- 동영상은 api 요청시 "videos" 쿼리 파라미터를 추가, <br />
  추가적인 포스터등의 이미지는 "images" 쿼리 파라미터를 추가해 받았습니다.
  
감사합니다.
