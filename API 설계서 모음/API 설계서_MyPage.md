<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>회원 정보 수정 모듈</h2>

The Memorial Day 서비스의 회원 정보 수정과 관련된 REST API 모듈입니다.  
회원 정보 수정 모듈은 비밀번호 확인 후 수행할 수 있습니다.
  
- url : /mypage/userInfo

***

#### - (회원정보 수정화면에 진입 시) 비밀번호 확인
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함해야 합니다.
사용자는 본인의 비밀번호를 입력하고 본인임을 인증해야 합니다.
만약 비밀번호가 데이터베이스에 입력된 값과 다른 경우 원래 입력된 값과 다름에 대한 응답을 받습니다.  
성공할 경우 개인정보를 불러옵니다.  
네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- URL : **/password-check**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| password | string | 사용자 비밀번호(8-13자의 영문 + 숫자) | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/mypage/userInfo/password-check" \
 -h "Authorization=Bearer XXXX" \
 -d "password=qwer1234"
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
| password | string | 사용자 비밀번호(8-13자의 영문 + 숫자) | O |
| name | string | 사용자 이름 | O |
| birth | String | 사용자의 생년월일(yyyymmdd) | O |
| gender | String | 사용자의 성별(남/녀) | O |
| telNumber | String | 사용자의 전화번호(11자의 숫자) | O |

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

**응답 실패 (비밀번호 불일치)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 : 실패 (존재하지 않는 회원)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NU",
  "message": "No exist user."
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

***

#### - 전화번호 인증 (회원정보 수정)  
  
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
curl -v -X POST "http://localhost:4000/api/v1/mypage/userInfo/tel-auth" \
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

#### - 전화번호, 인증번호 확인 (회원정보 수정)  
  
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
| telAuthNumber | String | 인증 확인에 사용할 인증 번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/mypage/userInfo/tel-auth-check" \
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

#### - 개인 정보 수정 (전화번호 없이)
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함해야 합니다.
이름, 생년월일, 비밀번호, 성별을 입력하여 요청하고 수정이 성공적으로 이루어지면 성공에 대한 응답을 받습니다.  
유효하지 않은 값이나 빈 값이 있을 경우 실패에 대한 응답을 받습니다.    
네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.   

- method : **PATCH**  
- URL : **/patch-info**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| password | string | 사용자 비밀번호(8-13자의 영문 + 숫자) | O |
| name | string | 사용자 이름 | O |
| birth | String | 사용자의 생년월일(yyyymmdd) | O |
| gender | String | 사용자의 성별(남/녀) | O |


###### Example

```bash
curl -v -X PATCH "http://localhost:4000/api/v1/mypage/userInfo/qwer1234" \
 -h "Authorization=Bearer XXXX" \
 -d "password=qwer1234" \
 -d "name=홍길동" \
 -d "birth=010101" \
 -d "gender=남" \
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

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
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

***

#### - 개인 정보 수정 (전화번호 포함)
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함해야 합니다.
이름, 생년월일, 비밀번호, 성별, 전화번호, 전화번호 인증번호를 입력하여 요청하고 수정이 성공적으로 이루어지면 성공에 대한 응답을 받습니다.  
만약 유효하지 않은 값, 빈 값, 인증에 실패할 경우 실패에 대한 응답을 받습니다.    
네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다.   

- method : **PATCH**  
- URL : **/patch-info**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| password | string | 사용자 비밀번호(8-13자의 영문 + 숫자) | O |
| name | string | 사용자 이름 | O |
| birth | String | 사용자의 생년월일(yyyymmdd) | O |
| gender | String | 사용자의 성별(남/녀) | O |
| telNumber | String | 사용자의 전화번호(11자의 숫자) | O |
| telAuthNumber | String | 전화번호 인증번호 | O |


###### Example

```bash
curl -v -X PATCH "http://localhost:4000/api/v1/mypage/userInfo/qwer1234" \
 -h "Authorization=Bearer XXXX" \
 -d "password=qwer1234" \
 -d "name=홍길동" \
 -d "birth=010101" \
 -d "gender=남" \
 -d "telNumber=01012123456" \
 -d "telAuthNumber=5678"
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

**응답 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "VF",
  "message": "Validation failed."
}
```

**응답 : 실패 (존재하지 않는 고객)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NU",
  "message": "No exist user."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8

{
  "code": "AF",
  "message": "Authentication fail."
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

***

#### - 회원 탈퇴
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함해야 합니다.
탈퇴 버튼을 눌러 탈퇴를 요청합니다.    
요청에 성공한 경우 성공에 대한 응답을 받습니다.  
실패할 경우 실패에 대한 응답을 받습니다.      
네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다.   

- method : **DELETE**  
- URL : **/delete-user/me**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

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

**응답 : 실패 (존재하지 않는 고객)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NU",
  "message": "No exist user."
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

***

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>주문 내역 모듈</h2>

The Memorial Day 서비스의 주문 내역과 관련된 REST API 모듈입니다.  
  
- url : /mypage/order-detail

#### - 주문내역 리스트 불러오기

#### 설명

요청 헤더에 Bearer 인증 토큰을 포함하여 요청하고 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 주문일 경우 존재하지 않는 주문에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Example

```bash
curl -X GET "http://localhost:4000/api/v1/mypage/order-detail" \
 -h "Authorization=Bearer XXXX"
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
| orders | Order[] | 주문 리스트 | O |

**Order**
| name | type | description | required |
|---|:---:|:---:|:---:|
| orderCode | String | 주문코드 | O |
| productNumber | Integer | 상품번호 | O |
| userId | String | 유저아이디 | O |
| storeNumber | Integer | 가게번호 | O |
| productContent | String | 요청사항 | O |
| pickupTime | String | 픽업시간 | O |
| orderStatus | String | 주문상태 | O |
| productCount | Integer | 수량 | O |
| totalPrice | Integer | 총금액 | O |
| orderTime | String | 주문시간 | O |
| cancelCode | String | 거부코드 | X |
| cancelReason | String | 거부기타사유 | X |
| optionSelect | String | 선택된 옵션 | O |


###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success",
  "orders": [
    "orderCode": "20241018023921",
    "productNumber": "32",
    "userId": "qwer1234",
    "storeNumber": "12",
    "productContent": "최대한 맛있게 기깔나게 부탁드립니다.",
    "pickupIime": "2024-10-11 22:30",
    "orderStatus": "승인대기중",
    "productCount": "1",
    "totalPrice": "35000",
    "orderTime": "2024-10-18 11:00",
    "cancel_code": "X",
    "cancel_reason": "X",
    "optionSelect": "1호, 빨강, 초코"
  ]
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 : 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "DataBase error."
}
```

<hr>

***

#### - 주문 취소

#### 설명

요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 주문코드를 포함하여 요청하고 용품삭제가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 주문일 경우 존재하지 않는 주문에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 인증 실패, 데이터베이스 에러가 발생할 수 있습니다.

- method : **DELETE**  
- URL : **/{orderCode}**  

##### Request

#### Header
| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Example

```bash
curl -X DELETE "http://localhost:4000/api/v1/mypage/order-detail/20241018112233" \
 -h "Authorization=Bearer XXXX"
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

**응답 : 실패 (존재하지 않는 주문코드)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NT",
  "message": "No exist ordercode."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 : 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "DataBase error."
}
```

<hr>

***

#### - 리뷰 작성
  
##### 설명

요청 헤더에 Bearer 인증 토큰을 포함하고 별점, 리뷰내용 리뷰사진을 입력하여 요청하고 리뷰 등록이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **POST**  
- URL : **/** 

##### Request

##### Header
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| reviewRating | 별점 | Float | O |
| reviewContents | 리뷰 내용 | String | X |
| reviewPhotoUrl | 리뷰 사진 url | String[] | X |

###### Example
```bash
curl -v -X POST "http://localhost:4000/mypage/order-detail/" \
 -h "Authorization=Bearer XXXX",
 -d "reviewRating = 4.4" \
 -d "reviewContents : '제가 먹어본 케이크 중에 끝내줘요 ..' " \
 -d "reviewUrl = '[image.png]'" \
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
**응답 : 실패 (존재하지 않는 주문코드)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NT",
  "message": "No exist ordercode."
}
```

**응답 : 실패 (인증 실패)**
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
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>주문 내역 모듈</h2>

The Memorial Day 서비스의 리뷰 관리와 관련된 REST API 모듈입니다.  
  
- url : /mypage/review

<hr>

***

#### - 리뷰리스트 불러오기 
  
##### 설명

요청 헤더에 Bearer 인증 토큰을 포함하고 해당 가게의 리뷰 리스트 조회를 요청합니다. 이 동작이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 리뷰일 경우 존재하지 않는 리뷰에 대한 응답을 받습니다. 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/** 

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -X GET "http://localhost:4000/api/v1/mypage/review" \
 -h "Authorization=Bearer XXXX"
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
| reviews | Review[] | 리뷰 리스트 | O |

**Review**
| reviewNumber | 리뷰번호 | Integer | O |
| storeName | 가게명 | String | O |
| reviewRating | 별점 | Float | O |
| reviewDay | 작성일 | Date | O |
| reviewContents | 리뷰 내용 | String | O |
| productName | 상품 이름 | String | O |
| reviewPhotoUrl | 리뷰 사진 url | String[] | X |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
  "reviews":  [
    {
      "reviewNumber": "22",
      "storeName": "부산 케이크",
      "reviewRating": "4.5",
      "reviewDay": "2024.01.03",
      "reviewContents": "모양도 예쁘고 맛도 있었어요!",
      "productName": "케이크1",
      "reviewPhotoUrl": "[http://localhost:4000/file/review_image.jpg]"
    }
  ]
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 : 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "DataBase error."
}
```

<hr>

***

#### - 리뷰 삭제
  
##### 설명

요청 헤더에 Bearer 인증 토큰을 포함하고 해당 가게의 리뷰 삭제를 요청합니다. 이 동작이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 리뷰일 경우 존재하지 않는 리뷰에 대한 응답을 받습니다. 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **DELETE**  
- URL : **/{reviewNumber}** 

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|


###### Example

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

**응답 : 실패 (존재하지 않는 리뷰)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NT",
  "message": "No exist review."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 : 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "DataBase error."
}
```

<hr>

***
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>주문 내역 모듈</h2>

The Memorial Day 서비스의 찜과 관련된 REST API 모듈입니다.  
  
- url : /mypage/like

<h2>

***

#### - 찜 관리
  
##### 설명

요청 헤더에 Bearer 인증 토큰을 포함하고 찜한 가게의 리스트를 요청합니다. 이 동작이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 찜일 경우 존재하지 않는 찜 리스트에 대한 응답을 받습니다. 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/** 

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|


###### Example
```bash
curl -X GET "http://localhost:4000/api/v1/mypage/like" \
 -h "Authorization=Bearer XXXX"
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
| likes | Like[] | 리뷰 리스트 | O |

**Like**
| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| storeNumber | Integer | 가게번호 | O |
| userId | String | 유저 아이디 | O |


###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success.",
  "likes": [
    "storeNumber" : 12,
    "userId" : qwer1234
  ]
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

**응답 : 실패 (존재하지 않는 찜)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NT",
  "message": "No exist like."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 : 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "DataBase error."
}
```

<h2>

***

#### - 찜 관리
  
##### 설명

요청 헤더에 Bearer 인증 토큰을 포함하고 찜한 가게의를 삭제합니다. 이 동작이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 찜일 경우 존재하지 않는 찜 리스트에 대한 응답을 받습니다. 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **DELETE**  
- URL : **/** 

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|


###### Example

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
  "message": "Success.",
  "likes": [
    "storeNumber" : 12,
    "userId" : qwer1234
  ]
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

**응답 : 실패 (존재하지 않는 찜)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NT",
  "message": "No exist like."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 : 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "DataBase error."
}
```