<h1 style='background-color: rgba(55, 55, 55, 0.4); text-align: center'>API 설계(명세)서_Main </h1>

해당 API 명세서는 '더 메모리얼 데이 - The Memorial Day'의 REST API를 명세하고 있습니다.  

- Domain : http://localhost:4000    

***

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>인기 키워드 모듈</h2>

The Memorial Day 서비스의 인기 키워드와 관련된 REST API 모듈입니다.  
사용자들의 인기 키워드 순위, 키워드 검색 등의 API가 포함되어 있습니다.  
인증 없이 요청할 수 있습니다.
  
- url : /

***

#### - 인기 키워드 불러오기 (인기 검색어)
  
##### 설명

클라이언트는 메인 홈화면에서 실시간 인기 키워드를 확인할 수 있습니다.    
네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **GET**  
- end point : **/hot-keyword**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/hot-keyword"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |
| keyword | String[] | 인기 검색어 리스트 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "keyword": [
	"쿠키", "웨딩", "이벤트"
  ]
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database error."
}
```

***

#### - 인기 테마 불러오기 (인기 테마)
  
##### 설명

클라이언트는 메인 홈화면에서 실시간 인기 테마를 확인할 수 있습니다.    
네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **GET**  
- end point : **/hot-theme**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/hot-theme"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |
| theme | String[] | 인기 테마 리스트 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "theme": [
	"심플", "펑키", "화려함"
  ]
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database error."
}
```