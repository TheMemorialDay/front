<h1 style='background-color: rgba(55, 55, 55, 0.4); text-align: center'>API 설계(명세)서_Stores </h1>

해당 API 명세서는 '더 메모리얼 데이 - The Memorial Day'의 REST API를 명세하고 있습니다.  

- Domain : http://localhost:4000   

***
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Stores 모듈</h2>

The Memorial Day 서비스의 가게 관리와 관련된 REST API 모듈입니다.  
가게 등록, 가게 정보 수정, 가게 정보 조회 등의 API가 포함되어 있습니다.
가게 정보 조회는 인증 없이 요청할 수 있습니다.
  
- url : X  

***

#### - 사업자 등록  
  
##### 설명

클라이언트는 사업자 등록번호, 사업자 등록증 파일을 입력하여 요청하고 사업자 인증에 성공할 시 권한이 일반에서 사장으로 변경됩니다. 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이티베이스 에러가 발생할 수 있습니다.   

- method : **PATCH**  
- URL : **/join/{userId}**  

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

#### - 가게 등록  
  
##### 설명

클라이언트는 가게명, 가게 연락처, 가게 주소, 간단한 가게 소개, 상세 가게 소개, 태그 최대 5개, 문의하기, 픽업 가능 일시를 입력하여 요청하고 가게 동록이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 
데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **POST**  
- URL : **/mypage/store/**  

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

#### - 가게 리스트 불러오기  
  
##### 설명

클라이언트는 가게 리스트 조회를 요청하고 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/stores**  

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
| storeDetails | StoreDetail[] | 가게 리스트 | O |

**StoreDetail**
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
| likeLists | Likelist[] | 찜한 사람 리스트 | O |
| productTodays | ProductToday[] | 당일 케이크 리스트 | O |
| productTags | ProductTag[] | 상품 태그 리스트 | O |
| themes | Theme[] | 상품 테마 리스트 | O |

**LikeList**
| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 유저아이디 | O |

**ProductToday**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productToday | Boolean | 당일 케이크 가능 여부 | O |

**ProductTag**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productTag | String | 상품 태그 | O |

**Theme**
| name | type | description | required |
|---|:---:|:---:|:---:|
| thema | String | 상품 테마 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
  "storeDetails": [
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
          "likeList": [],
          "productToday": [],
          "productTag": [],
          "themes": []
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

#### - 가게 상세 조회 - 상단의 가게 영업 정보
  
##### 설명

클라이언트는 가게 상세 조회를 요청하고 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/stores/{storesNumber}**  

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
Content-Type: application/json; charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
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
  "storeTel": "051-123-4567",
  "storeLatitude": "35.1424046336996",
  "storeLongtitude": "129.051536452902",
  "storeRating": 0,
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
  "sundayLast": "휴무일"
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

#### - 가게 상세 조회 - 가게 상품 불러오기
  
##### 설명

클라이언트는 가게 내의 상품 

- method : **GET**  
- URL : **/stores/{storesNumber}**  

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
| storeNumber | Integer | 가게 번호 | O |
| userId | string | 가게 주인 | O |
| storeName | String | 가게명 | O |
| storeIntroduce | String | 가게 소개  | O |
| storePaticular | String | 가게 상세 소개 | O |
| storeContact | String | 가게 연락 수단 | O |
| storeCaution | String | 가게 유의 사항 | O |
| storeAddress | String | 가게 주소 | O |
| storeDetailAddress | String | 가게 상세 주소 | O |
| storeGugun | String | 가게 주소 구/군 | O |
| storeDong | String | 가게 주소 동/읍/면 / O |
| storeTel | String | 가게 전화번호 | O |
| storeLatitude | String | 가게 위도 | O |
| storeLongtitude | String | 가게 경도 | O | 
| storeRating | Double | 가게 별점 | O |
| reviewCount | Integer | 가게 리뷰 개수 | O |
| likeCount | Integer | 가게 찜하기 개수 | O |
| storeImageUrl | String | 가게 대표 이미지 url | O |
| sundayOpen          | Integer    | 일요일 오픈시간   | O |
| sundayLast          | Integer    | 일요일 마감시간   | O |
| mondayOpen          | Integer    | 월요일 오픈시간   | O |
| mondayLast          | Integer    | 월요일 마감시간   | O |
| tuesdayOpen         | Integer    | 화요일 오픈시간   | O |
| tuesdayLast         | Integer    | 화요일 마감시간   | O |
| wednesdayOpen       | Integer    | 수요일 오픈시간   | O |
| wednesdayLast       | Integer    | 수요일 마감시간   | O |
| thursdayOpen        | Integer    | 목요일 오픈시간   | O |
| thursdayLast        | Integer    | 목요일 마감시간   | O |
| fridayOpen          | Integer    | 금요일 오픈시간   | O |
| fridayLast          | Integer    | 금요일 마감시간   | O |
| saturdayOpen        | Integer    | 토요일 오픈시간   | O |
| saturdayLast        | Integer    | 토요일 마감시간   | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json; charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "storeNumber": 1,
  "userId": "qwer1234",
  "storeName": "Cafe Delight",
  "storeIntroduce": "A cozy cafe with delightful drinks",
  "storeParticular": "Perfect for casual meetings or solo work",
  "storeContact": "01087654321",
  "storeCaution": "유의 부탁 드립니다~",
  "storeAddress": "서울 강남구 테헤란로 203",
  "storeDetailAddress": "test address",
  "storeGugun": "강남구",
  "storeDong": "삼성동",
  "storeTel": "0212345678",
  "storeLatitude": "37.500621",
  "storeLongtitude": "127.036431",
  "storeRating": 4.75,
  "reviewCount": 0,
  "likeCount": null,
  "storeImageUrl": "http://localhost:4000/file/7c9a7393-bab1-4319-8967-f9bd24cc4306.png",
  "mondayOpen": "09:00",
  "mondayLast": "18:00",
  "tuesdayOpen": "09:00",
  "tuesdayLast": "18:00",
  "wednesdayOpen": "09:00",
  "wednesdayLast": "18:00",
  "thursdayOpen": "09:00",
  "thursdayLast": "18:00",
  "fridayOpen": "09:00",
  "fridayLast": "18:00",
  "saturdayOpen": "휴무일",
  "saturdayLast": "휴무일",
  "sundayOpen": "휴무일",
  "sundayLast": "휴무일"
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

#### - 가게 수정  
  
##### 설명

클라이언트는 가게명, 가게 연락처, 가게 주소, 간단한 가게 소개, 상세 가게 소개, 태그 최대 5개, 문의하기, 픽업 가능 일시를 입력하여 요청하고 가게 수정이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 
데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **PATCH**  
- URL : **/mypage/store/{storeNumber}**  

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

**응답 : 실패 (존재하지 않는 상점)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NS",
  "message": "No exist store."
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

#### - 주문 내역
  
##### 설명

클라이언트는 자신의 주문 내역을 요청하고 요청이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/mypage/order-detail/{userId}**  

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

**응답 : 실패 (존재하지 않는 상점)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NU",
  "message": "No exist user id."
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

#### - 주문 관리  
  
##### 설명

클라이언트는 자신의 가게에 존재하는 주문 내역을 요청하고 요청이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/mypage/order-manage/{userId}**  

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

**응답 : 실패 (존재하지 않는 상점)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8

{
  "code": "NS",
  "message": "No exist store."
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