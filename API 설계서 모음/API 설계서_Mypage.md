<h1 style='background-color: rgba(55, 55, 55, 0.4); text-align: center'>API 설계(명세)서_Mypage</h1>

해당 API 명세서는 '더 메모리얼 데이 - The Memorial Day'의 REST API를 명세하고 있습니다.  

- Domain : http://localhost:4000

***

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>회원 정보 수정 모듈</h2>

The Memorial Day 서비스의 회원 정보 수정과 관련된 REST API 모듈입니다.  
회원 정보 수정 모듈은 비밀번호 확인 후 수행할 수 있습니다.
  
- url : /mypage/user-info

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
curl -v -X POST "http://localhost:4000/mypage/user-info/password-check" \
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

**응답 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication fail."
}
```

**응답 실패 (존재하지 않는 회원)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NU",
  "message": "No exist user."
}
```

**응답 실패 (데이터베이스 에러)**
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

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| telNumber | String | 인증 번호를 전송할 사용자의 전화번호 (11자리 숫자) | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/mypage/user-info/tel-auth" \
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

**응답 실패 (중복된 전화번호)**
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

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| telNumber | String | 인증 번호를 확인할 사용자 전화번호 | O |
| telAuthNumber | String | 인증 확인에 사용할 인증 번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/mypage/user-info/tel-auth-check" \
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

**응답 실패 (전화번호 인증 실패)**
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
curl -v -X PATCH "http://localhost:4000/mypage/user-info" \
 -h "Authorization=Bearer XXXX" \
 -d "password=qwer1234" \
 -d "name=홍길동" \
 -d "birth=010101" \
 -d "gender=남"
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

**응답 실패 (데이터베이스 에러)**
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
curl -v -X PATCH "http://localhost:4000/mypage/user-info" \
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

**응답 실패 (존재하지 않는 고객)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NU",
  "message": "No exist user."
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

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X DELETE "http://localhost:4000/mypage/user-info/delete-user/me" \
 -h "Authorization=Bearer XXXX"
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

**응답 실패 (존재하지 않는 고객)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NU",
  "message": "No exist user."
}
```

**응답 실패 (데이터베이스 에러)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "DataBase Error"
}
```

***

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>리뷰 관리 모듈</h2>

The Memorial Day 서비스의 리뷰와 관련된 REST API 모듈입니다.  
  
- url : /mypage/review

***

#### - 리뷰 리스트 불러오기
  
##### 설명

요청 헤더에 Bearer 인증 토큰을 포함하고 로그인한 유저가 작성한 리뷰 리스트를 요청할 수 있습니다. get 요청이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/mypage/review**

##### Request

##### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example
```bash
curl -v -X POST "http://localhost:4000/mypage/review?userId=qwer1234" \
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
| myReviews | Myreview[] | 리뷰 리스트 | O |

**Myreview**
| name | type | description | required |
|---|:---:|:---:|:---:|
| storeNumber | Integer | 가게 번호 | O |
| storeName | String | 가게 이름 | O |
| reviewRating | Double | 가게 별점 | O |
| reviewDay | Date | 리뷰 작성일 | O |
| reviewContents | String | 리뷰 내용 | X |
| productName | String | 상품 이름 | O |
| imageUrls | String[] | 리뷰 사진 링크 리스트 | X |


###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
  "myReviews": [
        {
            "storeNumber": 3,
            "storeName": "Wonderland Bakery",
            "reviewRating": 5,
            "reviewDay": "2024-11-10T15:00:00.000+00:00",
            "reviewContents": "맛잇어요~",
            "productName": "망고케이크",
            "imageUrls": [
                "http://localhost:4000/file/ffe7c8df-9491-4f09-8630-9d90e04206c1.jpg"
            ]
        },
        {
            "storeNumber": 1,
            "storeName": "Cafe Delight",
            "reviewRating": 5,
            "reviewDay": "2024-11-05T15:00:00.000+00:00",
            "reviewContents": "맛있어요~",
            "productName": "초코케이크",
            "imageUrls": [
                "http://localhost:4000/file/57ca4ffa-3d95-4b58-b033-b203fd7e2d5f.jpg",
                "http://localhost:4000/file/79a028c5-76b1-47c4-afa4-8ce43f519973.jpg"
            ]
        }
    ]
}
```

**응답 실패 (존재하지 않는 유저)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NU",
  "message": "No existed user."
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

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>주문 관리 모듈</h2>

The Memorial Day 서비스의 회원 주문과 관련된 REST API 모듈입니다.  
  
- url : /mypage/order-detail

***

#### - 주문 내역 불러오기
  
##### 설명

클라이언트는 자신의 주문 내역을 요청하고 요청이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- end : **/{userId}**  

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
curl -v -X GET "http://localhost:4000/mypage/order-detail/qwer1234" \
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
| orderManages | OrderManage[] | 주문 내역 리스트 | O |

**OrderManage**
| name | type | description | required |
|---|:---:|:---:|:---:|
| orderCode | String | 주문번호 | O |
| orderStatus | String | 주문상태 | O |
| orderTime | String | 주문시간 | O |
| storeNumber | Integer | 가게번호 | O |
| storeName | String | 가게이름 | O |
| productName | String | 상품이름 | O |
| productContents | String | 요청사항 | O |
| pickupTime | String | 픽업시간 | O |
| totalPrice | Integer | 총 가격 | O |
| productImageUrl | String | 상품이미지 | O |
| cancelCode | String | 취소코드 | O |
| cancelReason | String | 취소사유 | O |
| options | Option[] | 선택된 옵션 리스트 | O |
| name | String | 주문자 이름 | O |
| telNumber | String | 주문자 전화번호 | O |
| photoUrl | String | 요청 이미지 | O |

**Option**
| name | type | description | required |
|---|:---:|:---:|:---:|
| optionCategoryNumber | Integer | 상품 옵션 카테고리 번호 | O |
| optionNumber | Integer | 상품 옵션 번호 | O |
| productCategory | String | 상품 옵션 카테고리 이름 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json; charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "orderManages": [
        {
            "orderCode": "2024111226955",
            "orderStatus": "결제 대기중",
            "orderTime": "2024-11-12T17:32:21.748189",
            "storeNumber": 36,
            "storeName": "36,진짜로 바꿉니다임",
            "productName": "이미지있음",
            "productContents": "13",
            "pickupTime": "2024.11.21 12:30",
            "totalPrice": 32,
            "productImageUrl": "http://localhost:4000/file/aa5e12c4-8ccb-47d3-b62f-fc250b877c3f.png",
            "cancelCode": null,
            "cancelReason": null,
            "options": [
                {
                    "optionCategoryNumber": 22,
                    "optionNumber": null,
                    "productCategory": "1"
                },
                {
                    "optionCategoryNumber": 23,
                    "optionNumber": null,
                    "productCategory": "1"
                }
            ],
            "name": "홍길동",
            "telNumber": "01012345678",
            "photoUrl": null
        }
    ],
    [
        {
            "orderCode": "2024111226955",
            "orderStatus": "결제 대기중",
            "orderTime": "2024-11-12T17:32:21.748189",
            "storeNumber": 36,
            "storeName": "36,진짜로 바꿉니다임",
            "productName": "이미지있음",
            "productContents": "13",
            "pickupTime": "2024.11.21 12:30",
            "totalPrice": 32,
            "productImageUrl": "http://localhost:4000/file/aa5e12c4-8ccb-47d3-b62f-fc250b877c3f.png",
            "cancelCode": null,
            "cancelReason": null,
            "options": [
                {
                    "optionCategoryNumber": 22,
                    "optionNumber": null,
                    "productCategory": "1"
                },
                {
                    "optionCategoryNumber": 23,
                    "optionNumber": null,
                    "productCategory": "1"
                }
            ],
            "name": "홍길동",
            "telNumber": "01012345678",
            "photoUrl": null
        }
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

**응답 실패 (존재하지 않는 상점)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NU",
  "message": "No exist user id."
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

#### - 주문 상태 변경  
  
##### 설명

클라이언트는 어떠한 조건에 따라 주문상태가 변경되며 주문의 흐름이 완성된다. 상태 변경에 성공하였을 때 성공 응답을 받으며, 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이티베이스 에러가 발생할 수 있습니다.   

- method : **PATCH**  
- URL : **/{orderCode}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| orderCode | String | 주문번호 | O |
| orderStatus | String | 주문상태 | O |

###### Example

```bash
curl -v -X PATCH "http://localhost:4000/mypage/order-detail/2024111400001" \
 -h "Authorization=Bearer XXXX" \
 -d "orderCode=2024111400001" \
 -d "orderStatus=결제 대기중"
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

#### - 결제 완료  
  
##### 설명

클라이언트는 결제창을 이용하여 결제를 한다. 결제가 완료되었을 때 성공 응답을 받으며, 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이티베이스 에러가 발생할 수 있습니다.   

- method : **POST**  
- URL : **/{orderCode}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| orderCode | String | 주문번호 | O |
| paidAmount | Integer | 결제금액 | O |
| success | Boolean | 성공여부 | O |
| userId | String | 결제자 아이디 | O |

###### Example

```bash
curl -v -X PATCH "http://localhost:4000/mypage/order-detail/2024111400001" \
 -h "Authorization=Bearer XXXX" \
 -d "orderCode=2024111400001" \
 -d "paidAmount=15000" \
 -d "success=true" \
 -d "userId=test1"
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

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>찜한 가게 모듈</h2>

The Memorial Day 서비스의 회원이 찜한 가게 리스트와 관련된 REST API 모듈입니다.  
  
- url : /mypage/like/{userId}

***

#### - 찜한 가게 리스트 들고오기  
  
##### 설명

클라이언트는 찜한 가게목록을 불러왔을 때 응답 성공시 클라이언트가 찜한 가게들의 리스트를 응답받고 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이티베이스 에러가 발생할 수 있습니다.   

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
curl -v -X PATCH "http://localhost:4000/mypage/like/qwer1234" \
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
| likes | Like[] | 찜한 가게 리스트 | O |

**Like**
| name | type | description | required |
|---|:---:|:---:|:---:|
| storeNumber | Integer | 가게번호 | O |
| userId | String | 유저아이디 | O |
| storeName | String | 가게명 | O |
| storeIntroduce | String | 간단한 가게 소개 | O |
| storeParticular | String | 상세소개글 | O |
| storeCaution | String | 가게 유의사항 | O |
| storeContact | String | 문의하기 | O |
| storeAddress | String | 가게 주소 | O |
| storeDetailAddress | String | 가게 상세 주소 | O |
| storeGugun | String | 가게 구 주소 | O |
| storeDong | String | 가게 동 주소 | O |
| storeLatitude | String | 가게 위도 | O |
| storeLongtitude | String | 가게 경도 | O |
| storeTel | String | 가게 연락처 | O |
| reviewRating | Float | 리뷰 점수 | O |
| reviewCount | Integer | 리뷰 갯수 | O |
| likeCount | Integer | 찜 수 | O |
| storeImageUrl | String | 가게 이미지 URL | O |
| mondayOpen | Integer | 월요일 오픈시간 | O |
| mondayLast | Integer | 월요일 마감시간 | O |
| tuesdayOpen | Integer | 화요일 오픈시간 | O |
| tuesdayLast | Integer | 화요일 마감시간 | O |
| wednesdayOpen | Integer | 수요일 오픈시간 | O |
| wednesdayLast | Integer | 수요일 마감시간 | O |
| thursdayOpen | Integer | 목요일 오픈시간 | O |
| thursdayLast | Integer | 목요일 마감시간 | O |
| fridayOpen | Integer | 금요일 오픈시간 | O |
| fridayLast | Integer | 금요일 마감시간 | O |
| saturdayOpen | Integer | 토요일 오픈시간 | O |
| saturdayLast | Integer | 토요일 마감시간 | O |
| sundayOpen | Integer | 일요일 오픈시간 | O |
| sundayLast | Integer | 일요일 마감시간 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success."
  "likes": [
        {
          "storeNumber": 41,
          "userId": "test1",
          "storeName": "맛있는 케이크집",
          "storeIntroduce": "여기는 진짜 이쁜 케이크 많아요",
          "storeParticular": "많은 기념일들에 이용할 수 있는 많은 케이크들이 있습니다 ~",
          "storeContact": "인스타그램 : OOOOO , 카카오톡 : OOOOO",
          "storeCaution": "환불은 따로 가게에 연락주세요 ~~ 주문 사항은 가게 내규에 따릅니다.",
          "storeAddress": "부산 동구 범내로 12",
          "storeDetailAddress": "1491-13",
          "storeGugun": "동구",
          "storeDong": "범일동",
          "storeLatitude": "35.1424046336996",
          "storeLongtitude": "129.051536452902",
          "storeTel": "051-123-4567",
          "reviewRating": 0,
          "reviewCount": 0,
          "likeCount": 0,
          "storeImageUrl": "http://localhost:4000/file/aca99ac9-5289-4db8-97e2-7fd2578b27a2.png",
          "mondayOpen": "09:30",
           "mondayLast": "20:00",
          "tuesdayOpen": "휴무일",
          "tuesdayLast": "22:00",
          "wednesdayOpen": "09:30",
          "wednesdayLast": "20:30",
          "thursdayOpen": "10:00",
          "thursdayLast": "22:00",
          "fridayOpen": "10:00",
          "fridayLast": "22:00",
          "saturdayOpen": "11:00",
          "saturdayLast": "19:00",
          "sundayOpen": "휴무일",
          "sundayLast": "휴무일",
        }
  ],
  [
        {
          "storeNumber": 40,
          "userId": "test1",
          "storeName": "맛있는 케이크집",
          "storeIntroduce": "여기는 진짜 이쁜 케이크 많아요",
          "storeParticular": "많은 기념일들에 이용할 수 있는 많은 케이크들이 있습니다 ~",
          "storeContact": "인스타그램 : OOOOO , 카카오톡 : OOOOO",
          "storeCaution": "환불은 따로 가게에 연락주세요 ~~ 주문 사항은 가게 내규에 따릅니다.",
          "storeAddress": "부산 동구 범내로 12",
          "storeDetailAddress": "1491-13",
          "storeGugun": "동구",
          "storeDong": "범일동",
          "storeLatitude": "35.1424046336996",
          "storeLongtitude": "129.051536452902",
          "storeTel": "051-123-4567",
          "reviewRating": 0,
          "reviewCount": 0,
          "likeCount": 0,
          "storeImageUrl": "http://localhost:4000/file/aca99ac9-5289-4db8-97e2-7fd2578b27a2.png",
          "mondayOpen": "09:30",
           "mondayLast": "20:00",
          "tuesdayOpen": "휴무일",
          "tuesdayLast": "22:00",
          "wednesdayOpen": "09:30",
          "wednesdayLast": "20:30",
          "thursdayOpen": "10:00",
          "thursdayLast": "22:00",
          "fridayOpen": "10:00",
          "fridayLast": "22:00",
          "saturdayOpen": "11:00",
          "saturdayLast": "19:00",
          "sundayOpen": "휴무일",
          "sundayLast": "휴무일",
        }
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

#### - 찜한 가게 리뷰 상태 들고오기  
  
##### 설명

클라이언트는 찜한 가게목록을 불러왔을 때 응답 성공시 가게들의 리뷰 상태도 같이 들고오며 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이티베이스 에러가 발생할 수 있습니다.   

- method : **GET**  
- URL : **/info**  

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
curl -v -X PATCH "http://localhost:4000/mypage/like/qwer1234/info" \
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
| reviewNRatings | ReviewNRating[] | 리뷰 상태 리스트 | O |

**ReviewNRating**
| name | type | description | required |
|---|:---:|:---:|:---:|
| storeNumber | Integer | 가게 번호 | O |
| reviewRating | Float | 리뷰 평점 | O |
| reviewCount | Integer | 리뷰갯수 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success."
  "reviewNRatings": [
        {
          "storeNumber": 2,
          "reviewRating": 0.0,
          "reviewCount": 0
        },
        {
          "storeNumber": 1,
          "reviewRating": 0.0,
          "reviewCount": 0
        }

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

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>가게 관리 모듈</h2>

The Memorial Day 서비스의 사장 회원이 가게 관리와 관련된 REST API 모듈입니다.  
  
- url : /mypage/store

***

#### - 가게 등록  
  
##### 설명

클라이언트는 가게명, 가게 연락처, 가게 주소, 간단한 가게 소개, 상세 가게 소개, 태그 최대 5개, 문의하기, 픽업 가능 일시를 입력하여 요청할 수 있습니다. 가게 동록이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 
데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **POST**  
- URL : **/**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 유저아이디 | O |
| storeName | String | 가게명 | O |
| storeTel | String | 가게 연락처 | O |
| storeAddress | String | 가게 주소 | O |
| storeDetailAddress | String | 가게 상세 주소 | O |
| storeDong | String | 가게 동 주소 | O |
| storeGugun | String | 가게 구 주소 | O |
| storeLatitude | String | 가게 위도 | O |
| storeLongtitude | String | 가게 경도 | O |
| storeImageUrl | String | 가게 이미지 URL | X |
| storeIntroduce | String | 간단한 가게 소개 | X |
| storeParticular | String | 상세소개글 | X |
| storeCaution | String | 가게 유의사항 | X |
| storeContact | String | 문의하기 | X |
| mondayOpen          | Integer    | 월요일 오픈시간   | X |
| mondayLast          | Integer    | 월요일 마감시간   | X |
| tuesdayOpen         | Integer    | 화요일 오픈시간   | X |
| tuesdayLast         | Integer    | 화요일 마감시간   | X |
| wednesdayOpen       | Integer    | 수요일 오픈시간   | X |
| wednesdayLast       | Integer    | 수요일 마감시간   | X |
| thursdayOpen        | Integer    | 목요일 오픈시간   | X |
| thursdayLast        | Integer    | 목요일 마감시간   | X |
| fridayOpen          | Integer    | 금요일 오픈시간   | X |
| fridayLast          | Integer    | 금요일 마감시간   | X |
| saturdayOpen        | Integer    | 토요일 오픈시간   | X |
| saturdayLast        | Integer    | 토요일 마감시간   | X |
| sundayOpen          | Integer    | 일요일 오픈시간   | X |
| sundayLast          | Integer    | 일요일 마감시간   | X |

###### Example

```bash
curl -v -X POST "http://localhost:4000/mypage/store" \
 -h "Authorization=Bearer XXXX" \
 -d "userId=qwer1234" \
 -d "storeName=맛있는 케이크집" \
 -d "storeTel=010-1234-5678" \
 -d "storeNddress=부산 동구 범내로 12" \
 -d "storeDetailAddress: 1491-13" \
 -d "storeDong: 범일동" \
 -d "storeGugun: 동구" \
 -d "storeLatitude: 35.1424046336996" \
 -d "storeLongtitude: 129.051536452902" \
 -d "storeImageUrl=http://localhost:4000/file/aca99ac9-5289-4db8-97e2-7fd2578b27a2.png" \
 -d "storeIntroduce=여기는 진짜 이쁜 케이크 많아요" \
 -d "storeParticular=많은 기념일들에 이용할 수 있는 많은 케이크들이 있습니다 ~" \
 -d "storeCaution= 환불은 따로 가게에 연락주세요 ~~ 주문 사항은 가게 내규에 따릅니다." \
 -d "storeContact=인스타그램 : OOOOO , 카카오톡 : OOOOO" \
 -d "sundayOpen=10" \
 -d "sundayLast=22" \
 -d "mondayOpen=10" \
 -d "mondayLast=22" \
 -d "tuesdayOpen=10" \
 -d "tuesdayLast=22" \
 -d "wednesdayOpen=10" \
 -d "wednesdayLast=22" \
 -d "thursdayOpen=10" \
 -d "thursdayLast=22" \
 -d "fridayOpen=10" \
 -d "fridayLast=23" \
 -d "saturdayOpen=10" \
 -d "saturdayLast=23"
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

#### - 가게 수정  
  
##### 설명

클라이언트는 가게명, 가게 연락처, 가게 주소, 간단한 가게 소개, 상세 가게 소개, 태그 최대 5개, 문의하기, 픽업 가능 일시를 입력하여 요청하고 가게 수정이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 
데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **PATCH**  
- URL : **/{storeNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 유저아이디 | O |
| storeName | String | 가게명 | O |
| storeTel | String | 가게 연락처 | O |
| storeAddress | String | 가게 주소 | O |
| storeDetailAddress | String | 가게 상세 주소 | O |
| storeDong | String | 가게 동 주소 | O |
| storeGugun | String | 가게 구 주소 | O |
| storeLatitude | String | 가게 위도 | O |
| storeLongtitude | String | 가게 경도 | O |
| storeImageUrl | String | 가게 이미지 URL | X |
| storeIntroduce | String | 간단한 가게 소개 | X |
| storeParticular | String | 상세소개글 | X |
| storeCaution | String | 가게 유의사항 | X |
| storeContact | String | 문의하기 | X |
| mondayOpen          | Integer    | 월요일 오픈시간   | X |
| mondayLast          | Integer    | 월요일 마감시간   | X |
| tuesdayOpen         | Integer    | 화요일 오픈시간   | X |
| tuesdayLast         | Integer    | 화요일 마감시간   | X |
| wednesdayOpen       | Integer    | 수요일 오픈시간   | X |
| wednesdayLast       | Integer    | 수요일 마감시간   | X |
| thursdayOpen        | Integer    | 목요일 오픈시간   | X |
| thursdayLast        | Integer    | 목요일 마감시간   | X |
| fridayOpen          | Integer    | 금요일 오픈시간   | X |
| fridayLast          | Integer    | 금요일 마감시간   | X |
| saturdayOpen        | Integer    | 토요일 오픈시간   | X |
| saturdayLast        | Integer    | 토요일 마감시간   | X |
| sundayOpen          | Integer    | 일요일 오픈시간   | X |
| sundayLast          | Integer    | 일요일 마감시간   | X |

###### Example

```bash
curl -v -X POST "http://localhost:4000/mypage/store/1" \
 -h "Authorization=Bearer XXXX" \
 -d "userId=qwer1234" \
 -d "storeName=맛있는 케이크집" \
 -d "storeTel=010-1234-5678" \
 -d "storeNddress=부산 동구 범내로 12" \
 -d "storeDetailAddress: 1491-13" \
 -d "storeDong: 범일동" \
 -d "storeGugun: 동구" \
 -d "storeLatitude: 35.1424046336996" \
 -d "storeLongtitude: 129.051536452902" \
 -d "storeImageUrl=http://localhost:4000/file/aca99ac9-5289-4db8-97e2-7fd2578b27a2.png" \
 -d "storeIntroduce=여기는 진짜 이쁜 케이크 많아요" \
 -d "storeParticular=많은 기념일들에 이용할 수 있는 많은 케이크들이 있습니다 ~" \
 -d "storeCaution= 환불은 따로 가게에 연락주세요 ~~ 주문 사항은 가게 내규에 따릅니다." \
 -d "storeContact=인스타그램 : OOOOO , 카카오톡 : OOOOO" \
 -d "sundayOpen=10" \
 -d "sundayLast=22" \
 -d "mondayOpen=10" \
 -d "mondayLast=22" \
 -d "tuesdayOpen=10" \
 -d "tuesdayLast=22" \
 -d "wednesdayOpen=10" \
 -d "wednesdayLast=22" \
 -d "thursdayOpen=10" \
 -d "thursdayLast=22" \
 -d "fridayOpen=10" \
 -d "fridayLast=23" \
 -d "saturdayOpen=10" \
 -d "saturdayLast=23"
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

**응답 실패 (존재하지 않는 상점)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NS",
  "message": "No exist store."
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

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>상품 관리</h2>

The Memoridal Day의 상품 관리와 관련된 REST API 모듈입니다.  
상품 리스트 불러오기, 상품 등록, 상품 삭제, 상품 수정 등의 API가 포함되어 있습니다.  
  
- url : /mypage/product

***

#### 상품 리스트 불러오기

##### 설명

클라이언트는 마이페이지의 상품 리스트를 보는 페이지입니다. 요청 헤더에 Bearer 토큰을 포함하고 URL에 로그인한 유저 아이디를 포함하여 요청할 수 있습니다. 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **GET**  
- end point : **/{userId}**  

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
curl -v -X GET "http://localhost:4000/mypage/product/qwer1234" \
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
| products | Product[] | 상품에 대한 간략한 정보 | O |

**Product**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productNumber | Integer | 상품 번호 | O |
| productName | String | 상품 이름 | O |
| productIntroduce | String | 상품 소개 | O |
| productPrice | Integer | 상품 최소 가격 | O |
| imageUrl | String | 상품 이미지 리스트 | O |
| options | Option[] | 상품 옵션 리스트 | O |
| productImages | String[] | 상품 이미지 링크 리스트 | X |
| productTag | String | 상품 태그 | O |
| productToday | Boolean | 당일 케이크 여부 | O |
| themes | String[] | 상품 테마 리스트 | X |

**Option**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productOptionName | String | 상품 옵션 이름(ex. 크기, 맛) | O |
| optionDetails | OptionDetail[] | 상품 옵션 상세 정보 | O |

**OptionDetail**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productCategory | String | 상품 옵션 카테고리 이름 | O |
| productOptionPrice | Integer | 상품 옵션 카테고리 추가 금액 | O |
| optionCategoryNumber | Integer | 상품 옵션 카테고리 번호 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
    "code": "SU",
    "message": "Success.",
    "products": [
        {
            "productNumber": 2,
            "productName": "블루베리 케이크",
            "productIntroduce": "눈에 좋은 블루베리가 가득",
            "productPrice": 32000,
            "productToday": true,
            "productTag": "레터링",
            "imageUrl": "http://localhost:4000/file/6bb6068f-303d-4077-abe1-6241414843f4.jpg",
            "productImages": [
                "http://localhost:4000/file/6bb6068f-303d-4077-abe1-6241414843f4.jpg"
            ],
            "options": [
                {
                    "productOptionName": "크기",
                    "optionDetails": [
                        {
                            "productCategory": "도시락",
                            "productOptionPrice": 5000,
                            "optionCategoryNumber": 154
                        },
                        {
                            "productCategory": "1호",
                            "productOptionPrice": 10000,
                            "optionCategoryNumber": 155
                        }
                    ]
                },
                {
                    "productOptionName": "맛",
                    "optionDetails": [
                        {
                            "productCategory": "블루베리",
                            "productOptionPrice": 0,
                            "optionCategoryNumber": 156
                        },
                        {
                            "productCategory": "라즈베리",
                            "productOptionPrice": 1000,
                            "optionCategoryNumber": 157
                        }
                    ]
                }
            ],
            "themes": [
                "#귀여움",
                "#심플",
                "#어린이"
            ]
        },
        {
            "productNumber": 3,
            "productName": "체리케이크",
            "productIntroduce": "싱싱한하고 달콤한 체리가 포인트!",
            "productPrice": 42000,
            "productToday": false,
            "productTag": "이단 케이크",
            "imageUrl": "http://localhost:4000/file/15a990cf-aa0f-44bf-9749-79805b1949ec.jpg",
            "productImages": [
                "http://localhost:4000/file/15a990cf-aa0f-44bf-9749-79805b1949ec.jpg"
            ],
            "options": [
                {
                    "productOptionName": "크기",
                    "optionDetails": [
                        {
                            "productCategory": "도시락",
                            "productOptionPrice": 0,
                            "optionCategoryNumber": 110
                        },
                        {
                            "productCategory": "한입",
                            "productOptionPrice": 1000,
                            "optionCategoryNumber": 111
                        }
                    ]
                },
                {
                    "productOptionName": "맛",
                    "optionDetails": [
                        {
                            "productCategory": "체리",
                            "productOptionPrice": 0,
                            "optionCategoryNumber": 112
                        },
                        {
                            "productCategory": "딸기",
                            "productOptionPrice": 1500,
                            "optionCategoryNumber": 113
                        }
                    ]
                }
            ],
            "themes": [
                "#크리스마스",
                "#효도"
            ]
        }
    ]
}
```

**응답 실패 (존재하지 않는 가게)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NS",
  "message": "No exist store."
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

#### - 상품 삭제
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 상품번호를 포함하여 요청할 수 있습니다. 상품 삭제가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 상품일 경우 존재하지 않는 상품에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **DELETE**  
- end point : **/{productNumber}**  

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
curl -v -X DELETE "http://localhost:4000/mypage/product/2" \
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

**응답 실패 (존재하지 않는 상품)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NP",
  "message": "No exist product."
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

#### - 상품 등록 페이지
  
##### 설명

상품 관리 페이지에서 상품 추가 버튼을 클릭하여 상품을 신규로 추가하며 설정하는 페이지입니다. 클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 상품번호를 포함하고 상품 이름, 상품 소개, 가격, 당일 케이크 여부, 상품 옵션 리스트, 상품 테마 리스트, 상품 태그, 상품 사진을 입력하여 요청할 수 있습니다. 상품 등록이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **POST**  
- end point : **/add/{storeNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| storeNumber | Integer | 가게 번호 | O |
| productName | String | 상품 이름 | O |
| productIntroduce | String | 상품 소개 | O |
| productPrice | Integer | 가격 | O |
| productToday | Boolean | 당일 케이크 여부 | O |
| productTag | String | 상품 태그 | O |
| productImages | String[] | 상품사진 | O |
| options | Option[] | 상품옵션 리스트 | O |
| themes | String[] | 상품 테마 리스트 | O |

**Option**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productOptionName | String | 옵션 이름 | O |
| optionDetails | OptionDetail[] | 옵션 소분류 리스트 | O |

**OptionDetail**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productCategory | String | 옵션 소분류 | O |
| productOptionPrice | Integer | 옵션 가격 | O |


###### Example

```bash
curl -v -X POST "http://localhost:4000/mypage/product/add/1" \
 -h "Authorization=Bearer XXXX" \
 -d "storeNumber = 1" \
 -d "productName = 초코케이크" \
 -d "productIntroduce = 달달한 수제 케이크." \
 -d "productPrice = 40000" \
 -d "productToday = false" \
 -d "productTag = 레터링" \ 
 -d "productImageUrl : ["초코1.jpg", "초코2.jpg"]" \
 -d "themas = "["#축하", "#무난"]" \
 -d "options: [
      {
        "productOptionName": "크기",
        "optionDetails": [
          {
            "productCategory": "1호",
            "productOptionPrice": 13000
          },
          {
            "productCategory": "2호",
            "productOptionPrice": 24000
          }
        ]
      },
      {
        "productOptionName": "맛",
        "optionDetails": [
          {
            "productCategory": "크림치즈",
            "productOptionPrice": 4000
          },
          {
            "productCategory": "기본",
            "productOptionPrice": 0
          }
        ]
      }
    ]"
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

#### - 상품 수정 페이지
  
##### 설명

상품 관리 페이지에서 상품을 클릭하여 상품을 수정하는 페이지입니다. 클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 상품번호를 포함하고 상품 이름, 상품 소개, 가격, 당일 케이크 여부, 상품옵션 리스트, 상품 테마 리스트, 상품태그명, 상품사진을 입력하여 요청할 수 있습니다. 상품 수정이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 상품일 경우 존재하지 않는 상품에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **PATCH**  
- end point : **/update/{productNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| storeNumber | Integer | 가게 번호 | O |
| productName | String | 상품 이름 | O |
| productIntroduce | String | 상품 소개 | O |
| productPrice | Integer | 가격 | O |
| productToday | Boolean | 당일 케이크 여부 | O |
| productTag | String | 상품 태그 | O |
| productImages | String[] | 상품사진 | O |
| options | Option[] | 상품옵션 리스트 | O |
| themes | String[] | 상품 테마 리스트 | O |

**Option**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productOptionName | String | 옵션 이름 | O |
| optionDetails | OptionDetail[] | 옵션 소분류 리스트 | O |

**OptionDetail**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productCategory | String | 옵션 소분류 | O |
| productOptionPrice | Integer | 옵션 가격 | O |

###### Example

```bash
curl -v -X PATCH "http://localhost:4000/mypage/product/update/1" \
 -h "Authorization=Bearer XXXX" \
 -d "storeNumber = 1" \
 -d "productName = 초코케이크" \
 -d "productIntroduce = 달달한 수제 케이크." \
 -d "productPrice = 40000" \
 -d "productToday = false" \
 -d "productTag = 레터링" \ 
 -d "productImageUrl : ["초코1.jpg", "초코2.jpg"]" \
 -d "themas = "["#축하", "#무난", "#효도"]" \
 -d "options: [
      {
        "productOptionName": "크기",
        "optionDetails": [
          {
            "productCategory": "1호",
            "productOptionPrice": 13000
          },
          {
            "productCategory": "2호",
            "productOptionPrice": 24000
          }
        ]
      },
      {
        "productOptionName": "맛",
        "optionDetails": [
          {
            "productCategory": "크림치즈",
            "productOptionPrice": 4000
          },
          {
            "productCategory": "기본",
            "productOptionPrice": 0
          }
        ]
      }
    ]"
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

**응답 실패 (존재하지 않는 상품)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NP",
  "message": "No exist product."
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

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>주문 내역 모듈</h2>

The Memorial Day 서비스의 사장 회원님의 주문 관리와 관련된 REST API 모듈입니다.  
  
- url : /mypage/order-manage

***

#### - 주문 관리  
  
##### 설명

클라이언트는 자신의 가게에 존재하는 주문 내역을 요청하고 요청이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/{userId}**  

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
curl -v -X GET "http://localhost:4000/mypage/order-manage/qwer1234" \
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
| orderManages | OrderManage[] | 주문 내역 리스트 | O |

**OrderManage**
| name | type | description | required |
|---|:---:|:---:|:---:|
| orderCode | String | 주문번호 | O |
| orderStatus | String | 주문상태 | O |
| orderTime | String | 주문시간 | O |
| storeNumber | Integer | 가게번호 | O |
| storeName | String | 가게이름 | O |
| productName | String | 상품이름 | O |
| productContents | String | 요청사항 | O |
| pickupTime | String | 픽업시간 | O |
| totalPrice | Integer | 총 가격 | O |
| productImageUrl | String | 상품이미지 | O |
| cancelCode | String | 취소코드 | O |
| cancelReason | String | 취소사유 | O |
| options | Option[] | 선택된 옵션 리스트 | O |
| name | String | 주문자 이름 | O |
| telNumber | String | 주문자 전화번호 | O |
| photoUrl | String | 요청 이미지 | O |

**Option**
| name | type | description | required |
|---|:---:|:---:|:---:|
| optionCategoryNumber | Integer | 상품 옵션 카테고리 번호 | O |
| optionNumber | Integer | 상품 옵션 번호 | O |
| productCategory | String | 상품 옵션 카테고리 이름 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json; charset=UTF-8
{
  "code": "SU",
    "message": "Success.",
    "orderManages": [
        {
            "orderCode": "2024111226955",
            "orderStatus": "결제 대기중",
            "orderTime": "2024-11-12T17:32:21.748189",
            "storeNumber": 36,
            "storeName": "36,진짜로 바꿉니다임",
            "productName": "이미지있음",
            "productContents": "13",
            "pickupTime": "2024.11.21 12:30",
            "totalPrice": 32,
            "productImageUrl": "http://localhost:4000/file/aa5e12c4-8ccb-47d3-b62f-fc250b877c3f.png",
            "cancelCode": null,
            "cancelReason": null,
            "options": [
                {
                    "optionCategoryNumber": 22,
                    "optionNumber": null,
                    "productCategory": "1"
                },
                {
                    "optionCategoryNumber": 23,
                    "optionNumber": null,
                    "productCategory": "1"
                }
            ],
            "name": "홍길동",
            "telNumber": "01012345678",
            "photoUrl": null
        }
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

**응답 실패 (존재하지 않는 상점)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NS",
  "message": "No exist store."
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

##### 설명

사장 회원님이 주문을 승인하면 해당 주문 요청자에게 결제를 요청하는 문자 메시지 전송을 요청합니다. 요청 헤더에 Bearer 토큰을 포함하고 있으며, 문자 메시지 전송에 대한 성공을 하면 성공 응답을 받습니다. 실패에 대한 데이터베이스 에러, 네트워크 에러 응답을 받을 수 있습니다.

- method : **POST**  
- URL : **/send-pay-msg**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| telNumber | String | 주문한 고객의 전화번호 | O |
| name | String | 주문한 고객의 이름 | O |
| storeName | String | 주문한 가게 이름 | O |
| productName | String | 주문한 상품 이름 | O |
| totalPrice | Integer | 주문 총 금액 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/mypage/order-manage/send-pay-msg" \
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
Content-Type: application/json; charset=UTF-8
{
  "code": "SU",
  "message": "Success."
}
```

**응답 실패 (존재하지 않는 회원)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NU",
  "message": "No exist user."
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

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>매출 관리 모듈</h2>

The Memorial Day 서비스의 사장 회원님의 주문 관리와 관련된 REST API 모듈입니다.  
  
- url : /mypage/sales

***

#### - 매출 관리  
  
##### 설명

클라이언트는 마이페이지의 매출 관리에서 아이디를 통해 가게 번호로 주문 리스트 조회를 요청하고 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 주문이 존재하지 않는 가게일 경우 존재하지 않는 주문에 해당하는 응답을 받습니다. 인증 실패 에러, 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/{userId}**  

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
curl -v -X GET "http://localhost:4000/mypage/sales/qwer1234" \
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
  "message": "Success.",
  "fullOrders": [
    {
      "orderCode": "2024110751799",
      "orderStatus": "픽업 완료",
      "orderTime": "2024-10-27T00:00",
      "storeNumber": 36,
      "storeName": "36,가게 이름",
      "productName": "딸기 케이크",
      "productContents": "맛있게 부탁드려요",
      "pickupTime": "2024.11.07 15:00",
      "totalPrice": 16320,
      "productImageUrl": "http://localhost:4000/file/딸기케이크.png",
      "cancelCode": null,
      "cancelReason": null,
      "options": [
        {
          "optionCategoryNumber": 11,
          "optionNumber": null,
          "productCategory": "크기"
        },
        {
          "optionCategoryNumber": 12,
          "optionNumber": null,
          "productCategory": "맛"
        }
      ]
    }
  ]
}
```

**응답 실패 (주문이 존재하지 않는 가게)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NO",
  "message": "No exist order."
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