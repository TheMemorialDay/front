<h1 style='background-color: rgba(55, 55, 55, 0.4); text-align: center'>API 설계(명세)서_Auth </h1>

해당 API 명세서는 '더 메모리얼 데이 - The Memorial Day'의 REST API를 명세하고 있습니다.  

- Domain : http://localhost:4000    

***
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Auth 모듈</h2>

The Memorial Day 서비스의 인증 및 인가와 관련된 REST API 모듈입니다.
로그인, 회원가입, 소셜 로그인, 아이디 찾기, 비밀번호 찾기, 비밀번호 재설정 등의 API가 포함되어 있습니다.
Auth 모듈은 인증 없이 요청할 수 있습니다.
  
- url : /api/v1/auth

***

#### - 로그인  
  
##### 설명

클라이언트는 사용자 아이디와 평문의 비밀번호를 입력하여 요청하고 아이디와 비밀번호가 일치한다면 인증에 사용될 token과 해당 token의 만료 기간을 응답 데이터로 전달 받습니다.  
만약 아이디 혹은 비밀번호가 하나라도 틀린다면 로그인 정보 불일치에 해당하는 응답을 받게됩니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러, 토큰 생성 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/sign-in**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 사용자의 아이디 | O |
| password | String | 사용자의 비밀번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/sign-in" \
 -d "userId=qwer1234" \
 -d "password=P!ssw0rd"
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
| accessToken | String | Bearer token 인증 방식에 사용될 JWT | O |
| expiration | Integer | JWT 만료 기간 (초단위) | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success.",
  "accessToken": "${ACCESS_TOKEN}",
  "expiration": 32400
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

**응답 실패 (로그인 정보 불일치)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "SF",
  "message": "Sign in failed."
}
```

**응답 실패 (토큰 생성 실패)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "TCF",
  "message": "Token creation failed."
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

#### - 아이디 찾기 (이름, 전화번호 확인)
  
##### 설명

클라이언트는 찾으려는 계정의 이름과 숫자로만 이루어진 11자리 전화번호를 입력합니다.  
이름과 전화번호의 일치 여부를 확인한 후 일치한다면 인증번호를 전송합니다.  
일치하지 않는다면 일치하는 정보가 없다는 응답을 받습니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러, 문자 전송 실패가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/id-search-first**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| name | String | 사용자의 이름 | O |
| telNumber | String | 사용자의 전화번호 (11자의 숫자) | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/id-search-first" \
 -d "name=홍길동"\
 -d "telNumber=01011112222"\
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

**응답 : 실패 (존재하지 않는 정보)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NF",
  "message": "No exist info."
}
```

**응답 실패 (인증번호 전송 실패)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "TF",
  "message": "Auth number send failed."
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

#### - 아이디 찾기 (전화번호, 인증번호 확인)
  
##### 설명

클라이언트는 사용자 전화번호와 인증번호를 입력하여 요청하고 해당하는 전화번호와 인증번호가 서로 일치하는지 확인합니다.  
일치한다면 성공에 대한 응답을 받고 이름, 전화번호, 아이디를 보여줍니다.  
만약 일치하지 않는다면 전화번호 인증 실패에 대한 응답을 받습니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/id-search-middle**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| telNumber | String | 인증 번호를 확인할 사용자 전화번호 | O |
| telAuthNumber | String | 인증 확인에 사용할 인증 번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/id-search-middle" \
 -d "telNumber=01011112222" \
 -d "telAuthNumber=1234"
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

**응답 : 실패 (전화번호 인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "TAF",
  "message": "Tel number authentication failed."
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

#### - 아이디 찾기 (이름, 전화번호, 인증번호 확인 후 결과)
  
##### 설명

클라이언트는 사용자 이름, 전화번호, 인증번호를 입력하여 요청하고 전부 일치하는지 확인합니다.    
일치한다면 성공에 대한 응답을 받고 이름, 전화번호, 아이디를 보여줍니다.  
만약 일치하지 않는다면 인증 실패에 대한 응답을 받습니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/id-search-result**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| name | String | 인증 번호를 확인할 사용자 이름 | O |
| telNumber | String | 인증 번호를 확인할 사용자 전화번호 | O |
| telAuthNumber | String | 인증 확인에 사용할 인증 번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/id-search-result" \
 -d "name=홍길동"\
 -d "telNumber=01011112222" \
 -d "telAuthNumber=1234"
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
| name | String | 사용자의 이름 | O |
| telNumber | String | 사용자의 전화번호 | O |
| userId | String | 사용자의 아이디 | O |

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

**응답 : 실패 (존재하지 않는 정보)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NF",
  "message": "No exist info."
}
```

**응답 : 실패 (전화번호 인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "TAF",
  "message": "Tel number authentication failed."
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

#### - 비밀번호 재설정 (아이디, 전화번호 확인)
  
##### 설명

클라이언트는 찾으려는 아이디와, 숫자로만 이루어진 11자리 전화번호를 입력하여 아이디와 전화번호의 일치 여부를 확인한 후 일치한다면 인증번호를 요청하고 4자리의 인증번호를 해당 전화번호에 문자로 전송합니다.  
인증번호가 정상적으로 전송이 된다면 성공 응답을 받습니다.  
만약 아이디나 전화번호가 존재하지 않는다면 그에 대한 실패 응답을 받습니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러, 문자 전송 실패가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/password-search**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 사용자의 아이디 | O |
| telNumber | String | 사용자의 전화번호 (11자의 숫자) | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/password-search" \
 -d "userId=qwer1234"\
 -d "telNumber=01011112222"\
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

**응답 : 실패 (존재하지 않는 정보)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NI",
  "message": "No exist info."
}
```

**응답 실패 (인증번호 전송 실패)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "TF",
  "message": "Auth number send failed."
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

#### - 비밀번호 재설정 (전화번호, 인증번호 확인)  
  
##### 설명

클라이언트는 사용자 전화번호와 인증번호를 입력하여 요청하고 해당하는 전화번호와 인증번호가 서로 일치하는지 확인합니다.  
일치한다면 성공에 대한 응답을 받고 비밀번호 재설정을 시도할 수 있습니다.  
만약 일치하지 않는다면 전화번호 인증 실패에 대한 응답을 받습니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/password-search-tel-auth-check**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| telNumber | String | 인증 번호를 확인할 사용자 전화번호 | O |
| telAuthNumber | String | 인증 확인에 사용할 인증 번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/password-search-tel-auth-check" \
 -d "telNumber=01011112222" \
 -d "telAuthNumber=1234"
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

**응답 : 실패 (전화번호 인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "TAF",
  "message": "Tel number authentication failed."
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

#### - 비밀번호 재설정 (아이디, 전화번호, 인증번호 확인)  
  
##### 설명

클라이언트는 사용자 아이디, 전화번호, 인증번호를 입력하여 요청하고 해당하는 아이디, 전화번호, 인증번호가 서로 일치하는지 확인합니다.   
일치한다면 성공에 대한 응답을 받고 비밀번호 재설정을 시도할 수 있습니다.  
만약 일치하지 않는다면 전화번호 인증 실패에 대한 응답을 받습니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/password-search-final**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 인증 번호를 확인할 사용자 아이디 | O |
| telNumber | String | 인증 번호를 확인할 사용자 전화번호 | O |
| telAuthNumber | String | 인증 확인에 사용할 인증 번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/password-search-final" \
 -d "userId=qwer1234" \
 -d "telNumber=01011112222" \
 -d "telAuthNumber=1234"
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

**응답 : 실패 (전화번호 인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "TAF",
  "message": "Tel number authentication failed."
}
```

**응답 : 실패 (존재하지 않는 정보)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NI",
  "message": "No exist info."
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

#### - 비밀번호 재설정  
  
##### 설명

클라이언트는 재설정할 비밀번호를 입력하여 확인한 후 요청하고, 재설정이 성공적으로 이루어지면 성공에 대한 응답을 받습니다.  
이전 비밀번호와 변경하려는 비밀번호가 일치한다면 실패에 대한 응답을 받습니다.  
일치하지 않는다면 성공적으로 비밀번호가 변경됩니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **PATCH**  
- end point : **/password-resetting**  

##### Request

###### Request Body

| name | type | description | required |
| password | String | 사용자의 비밀번호 (8~13자의 영문 + 숫자) | O |

###### Example

```bash
curl -v -X PATCH "http://localhost:4000/api/v1/auth/password-resetting" \
  -d "password=P!ssw0rd"\
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

**응답 실패 (비밀번호 중복)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "DP",
  "message": "Duplicated password."
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

#### - SNS 로그인  
  
##### 설명

클라이언트는 OAuth 인증서버를 입력하여 요청하고 해당하는 Redirect 응답을 받습니다. 회원가입이 되어있는 사용자의 경우 쿼리 매개변수로 접근 토큰과 토큰 만료 기간을 반환하며 회원가입이 되어있지 않은 사용자의 경우 쿼리 매개변수로 sns 아이디와 해당하는 sns 서비스의 이름을 반환합니다. 

- method : **POST**  
- end point : **/sns-sign-in/{registerId}**  

##### Request

###### Path Variable

| name | type | description | required |
|---|:---:|:---:|:---:|
| registerId | String | 사용 SNS (카카오: 'kakao', 네이버: 'naver', 구글: 'google') | O |

###### Example

```bash
curl -X POST "http://localhost:4000/api/v1/auth/sns-sign-in/{kakao}" 
```

##### Response

###### Example

**응답 성공 (회원 O)**
```bash
HTTP/1.1 302 Found 
Location: http://localhost:3000/sns-success?accessToken=${accessToken}&expiration=36000
```

**응답 성공 (회원 X)**
```bash
HTTP/1.1 302 Found 
Location: http://localhost:3000/auth?snsId=${snsId}&joinPath=${joinPath}
```

***

#### - 아이디 중복 확인  
  
##### 설명

클라이언트는 사용할 아이디를 입력하여 요청하고 중복되지 않는 아이디라면 성공 응답을 받습니다. 만약 아이디가 중복된다면 아이디 중복에 해당하는 응답을 받게됩니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/id-check**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 중복확인 할 사용자의 아이디 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/id-check" \
 -d "userId=qwer1234"
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

**응답 : 실패 (중복된 아이디)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "DI",
  "message": "Duplicated user id."
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

#### - 전화번호 인증 (회원가입)  
  
##### 설명

클라이언트는 숫자로만 이루어진 11자리 전화번호를 입력하여 요청하고 이미 사용중인 전화번호인지 확인 후 4자리의 인증번호를 해당 전화번호에 문자를 전송합니다.  
인증번호가 정상적으로 전송이 된다면 성공 응답을 받습니다.  
만약 중복된 전화번호를 입력한다면 중복된 전화번호에 해당하는 응답을 받게됩니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러, 문자 전송 실패가 발생할 수 있습니다.  

- method : **POST**  
- URL : **/tel-auth**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| telNumber | String | 인증 번호를 전송할 사용자의 전화번호 (11자리 숫자) | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/tel-auth" \
 -d "telNumber=01011112222"
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

**응답 : 실패 (중복된 전화번호)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "DT",
  "message": "Duplicated user tel number."
}
```

**응답 실패 (인증번호 전송 실패)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8

{
  "code": "TF",
  "message": "Auth number send failed."
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

#### - 전화번호, 인증번호 확인 (회원가입)  
  
##### 설명

클라이언트는 사용자 전화번호와 인증번호를 입력하여 요청하고 해당하는 전화번호와 인증번호가 서로 일치하는지 확인합니다.  
일치한다면 성공에 대한 응답을 받습니다.  
만약 일치하지 않는 다면 전화번호 인증 실패에 대한 응답을 받습니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- end point : **/tel-auth-check**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| telNumber | String | 인증 번호를 확인할 사용자 전화번호 | O |
| teltelAuthNumber | String | 인증 확인에 사용할 인증 번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/tel-auth-check" \
 -d "telNumber=01011112222" \
 -d "telAuthNumber=1234"
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

**응답 : 실패 (전화번호 인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "TAF",
  "message": "Tel number authentication failed."
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

#### - 회원가입
  
##### 설명

클라이언트는 사용자 이름, 사용자 아이디, 비밀번호, 전화번호, 인증 번호, 가입 경로, 생년월일, 성별을 입력하여 요청 하고 회원가입이 성공적으로 이루어지면 성공에 대한 응답을 받습니다.  
만약 존재하는 아이디일 경우, 중복된 아이디에 대한 응답을 받습니다.  
또한 존재하는 전화번호일 경우 중복된 전화번호에 대한 응답을 받습니다.  
전화번호와 인증번호가 일치하지 않으면 전화번호 인증 실패에 대한 응답을 받습니다.  
네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **POST**  
- URL : **/sign-up**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | string | 사용자의 아이디 | O |
| password | string | 사용자 비밀번호(8-13자의 영문 + 숫자) | O |
| name | string | 사용자 이름 | O |
| birth | String | 사용자의 생년월일(yyyymmdd) | O |
| gender | String | 사용자의 성별(남/녀) | O |
| telNumber | String | 사용자의 전화번호(11자의 숫자) | O |
| teltelAuthNumber | String | 전화번호 인증번호 | O |
| joinPath | String | 회원가입 경로 (기본: 'HOME', 카카오: 'KAKAO', 네이버: 'NAVER', 구글: 'GOOGLE') | O |
| snsId | String | SNS 가입 시 sns oauth2 ID | X |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/sign-up" \
 -d "userId=qwer1234" \
 -d "password=qwer1234" \
 -d "name=홍길동" \
 -d "birth=010425" \
 -d "gender=여" \
 -d "telNumber=01012345678" \
 -d "teltelAuthNumber=1234" \
 -d "joinPath=HOME" 
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환되는 Response Body의 Content Type (application/json) | O |

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
  "message": "Success"
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "Validation Failed"
}
```

**응답 : 실패 (중복된 아이디)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "DI",
  "message": "Duplicated userId"
}
```

**응답 : 실패 (중복된 전화번호)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "DT",
  "message": "Duplicated TelNumber"
}
```

**응답 : 실패 (전화번호 인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "TAF",
  "message": "Telnumber Authentication Failed"
}
```

**응답 : 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "DataBase Error"
}
```