<h1 style='background-color: rgba(55, 55, 55, 0.4); text-align: center'>API 설계(명세)서_Join</h1>

해당 API 명세서는 '더 메모리얼 데이 - The Memorial Day'의 REST API를 명세하고 있습니다.  

- Domain : http://localhost:4000

***

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Join 모듈</h2>

The Memorial Day 서비스의 가게 등록과 관련된 REST API 모듈입니다.  
  
- url : /join

***

#### - 사업자 등록  
  
##### 설명

클라이언트는 사업자 등록번호, 사업자 등록증 파일을 입력하여 요청하고 사업자 인증에 성공할 시 권한이 일반에서 사장으로 변경됩니다. 네트워크 에러, 서버 에러, 인증 에러, 데이티베이스 에러가 발생할 수 있습니다.   

- method : **PATCH**  
- URL : **/{userId}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| businessNumber | String | 사업자 등록번호 | O |
| businessUrl | String | 사업자 등록증 파일 링크 | O |
| businessOpendate | String | 사업 개시일 | O |
| permission | String | 회원 권한 | O |

###### Example

```bash
curl -v -X PATCH "http://localhost:4000/stores/join/qwer1234" \
 -h "Authorization=Bearer XXXX" \
 -d "businessNumber=5646531351" \
 -d "businessUrl=http://localhost:4000/file/bebd4a76-5278-4fe6-b140-4f87ed5e3151.jpg" \
 -d "businessOpendate=20210101" \
 -d "permission=사장"

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

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success."
}
```

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 실패 (존재하지 않는 회원)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NU",
  "message": "No Exist User."
}
```

**응답 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication fail."
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