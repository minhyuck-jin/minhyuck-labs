# Java 기술 규칙

Java / Spring 코드에 적용한다.
언어 무관 안전 규칙은 `quality.md`, HTTP 메서드·URI 설계는 `api.md` 를 따른다.

## Spring Boot 4 (labs-api)

`backend/java/labs-api` 는 Spring Boot **4.x**, Java toolchain **25** 를 쓴다.

- REST: **`spring-boot-starter-webmvc`** (Boot 3 의 `spring-boot-starter-web` 예제를 그대로 가져오지 않는다)
- JSON: Boot 4 기본 **Jackson 3** (`tools.jackson` 계열). 튜토리얼의 Jackson 2 `ObjectMapper` 수동 `@Bean` 을 기본으로 두지 않는다
- JSON 커스터마이즈가 필요하면 Boot 4 의 **`JsonMapperBuilderCustomizer`** (예전 `Jackson2ObjectMapperBuilderCustomizer` 아님) 를 쓴다
- 마이그레이션 세부: [Spring Boot 4.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide)

## 패키지 (feature · MSA 지향 — labs-api)

`backend/java/labs-api` 는 **업무(도메인)별 패키지**로 나눈다. 한 JVM 모노리스이지만, 패키지 경계는 **나중 MSA 서비스 분리**를 염두에 둔다.

### 트리

```text
com.minhyuck.labs
├── LabsApiApplication.java
├── config/                 앱 전역 @Configuration (Jackson, OpenAPI 등)
├── common/                 도메인 **공통** (아래 규칙)
└── {domain}/               업무별 (예: ping, order). 소문자, api.md URI 자원명과 맞춤
    ├── controller/         @RestController, *RequestDto, *ResponseDto
    └── service/            @Service
```

- HTTP 어댑터 패키지 이름은 **`controller`** 를 쓴다. **`web` 패키지명은 쓰지 않는다.**
- **Repository 레이어 패키지는 기본으로 두지 않는다.** 영속이 필요하면 `{domain}.service` 가 Mapper·Spring Data 포트를 직접 쓴다. Mapper 클래스는 `{domain}.mapper` 등 **그 도메인 아래**에 둔다.

### common

- **여러 도메인**에서 쓰는 **기술·횡단** 코드만 둔다 (예: `@RestControllerAdvice`, 공통 오류 DTO, 공통 상수).
- **특정 업무 규칙·Service·Controller** 는 `common` 에 두지 않는다. 한 도메인만 쓰면 `{domain}` 아래에 둔다.
- `common` 이 비대해지면 도메인으로 내리거나, 사용자와 나눌지 정한다.

### 흐름

- 기본 호출: **`{domain}.controller` → `{domain}.service`**
- 요청 없는 추상 상위 클래스·범용 util 남발은 하지 않는다 (`common.md` 와 같음).

## 이름
- 접미사: `Controller`, `Service`, `Dto`
- API 입출력: `{Feature}RequestDto` / `{Feature}ResponseDto`
- 메서드 파라미터·지역변수: `requestDto` / `responseDto` (`request`, `response` 단독 금지)
- 컬렉션 변수: `{단수}List` (예: `userList`). 복수형 변수명(`users`)은 쓰지 않는다
- 패키지 이름은 소문자만 쓴다. 언더스코어·대문자로 단어를 나누지 않는다
- 패키지 루트는 애플리케이션을 만들 때 정한다

## 값 다루기
- 문자열이 비었는지는 `isBlank` 계열, 객체·컬렉션은 `isEmpty` 계열로 확인한다. `== null` 단독 비교를 기본으로 쓰지 않는다
- 컬렉션 반복은 향상된 for 또는 Stream 을 쓴다. 인덱스가 반드시 필요할 때만 일반 for·while 을 쓴다
- 변수는 쓰이는 지점 가까이에서 선언한다. 메서드 앞에 몰아 선언하지 않는다
- 한 번만 쓰이고 의미가 분명하면 인라인한다. 재사용되거나 이름이 설명을 도울 때만 변수를 만든다

## 클래스 구성
- Lombok — Controller / Service: `@RequiredArgsConstructor` + `@Slf4j`
- Lombok — DTO: `@Getter` `@Setter` `@NoArgsConstructor` 를 기본으로 한다. 필요하면 `@Builder`, `@ToString`
- `@Lazy` self 주입·수동 생성자로 Lombok 생성자를 우회하지 않는다
- Service 필드 선언 순서: 다른 Service → 변환기(MapStruct) → 저장 포트(Mapper·Repository) → enum·상수 → 그 밖의 빈. 그룹 사이에 빈 줄을 둔다. 그룹 안은 메서드에서 쓰이는 순서
- Service 에 매직 값을 `private static final` 상수로 쌓지 않는다. 포맷터 등은 쓰는 메서드 안에서 만든다
- 값만 담는 객체(VO)는 `record` 로 만든다

## DTO와 검증
- API 필수값 검증은 Bean Validation(`@Valid`, `@NotBlank` 등)으로 한다. Service 안에 수동 검증을 흩뿌리지 않는다
- 외부 응답을 받는 DTO 는 모르는 필드를 무시한다 (`@JsonIgnoreProperties(ignoreUnknown = true)`)
- DTO 간 변환은 MapStruct 를 쓰고 생성자 주입으로 받는다. getter/setter 매핑 코드를 길게 직접 쓰지 않는다
- springdoc `@Schema` 로 설명을 달았으면 같은 설명을 Javadoc·`//` 로 중복해 쓰지 않는다

## 스타일
- import 와일드카드(`*`)를 쓰지 않는다
- 한 줄에 문장 하나. 변수 선언도 한 줄에 하나
- `if` / `for` / `while` 본문은 한 줄이어도 중괄호를 쓴다
- 중괄호는 K&R (선언과 같은 줄에 `{`)
- `else` / `catch` / `finally` 는 닫는 `}` 와 같은 줄
- 메서드 시그니처·호출·생성자가 한 줄에 담기 어렵거나 파라미터가 많으면 파라미터별로 줄을 나눈다
- `if` 조건에 `&&` 또는 `||` 가 있으면 연산자부터 다음 줄로 내린다
- `return` 앞에는 빈 줄을 둔다. 메서드 본문이 `return` 하나면 두지 않는다

## 메서드 흐름과 주석
단계가 있는 메서드는 번호 블록 주석으로 나눈다. 번호는 0부터 시작할 수 있다.

```
/********************************************************************
 * 0. 입력 파라미터 검증
 ********************************************************************/

/********************************************************************
 * 1. 파라미터 세팅
 ********************************************************************/

/********************************************************************
 * 2. 메인 로직
 ********************************************************************/
```

- 공통 앞단: `0`(필요할 때만) → `1`(파라미터 세팅) → `2`부터 업무
- 복잡한 단계는 `2-1`, `2-2` 를 쓴다
- 코드가 하는 일을 적고, 뻔한 한 줄 주석은 쓰지 않는다
