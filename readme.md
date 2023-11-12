# 실행 방식
- 실행: npm run serve
- 빌드: npm run build
- 린트: npm run lint

# 환경 구성
webpack, babel, typescript, css

# 코드 간략 설명

### 저장소
TodoStoreRepository.ts
todoList 데이터에 대한 CRUD 기능을 하는 저장소 부분

### 렌더링
DomRenderingRepository.ts
화면에 그려지는 액션을 정의한 부분

### 컨트롤러
저장소 레포지토리와 렌더링 레포지토리 인스턴스를 통해
비즈니스 로직을 정의한 부분