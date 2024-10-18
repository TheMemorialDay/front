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

클라이언트는 사업자 등록번호, 사업자 등록증 파일을 입력하여 요청하고 사업자 인증에 성공할 시 권한이 일반에서 사장으로 변경됩니다. 네트워크 에러, 서버 에러, 인증 에러, 데이티베이스 에러가 발생할 수 있습니다.   

- method : **POST**  
- URL : **/stores/join**  

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

###### Example

```bash
curl -v -X POST "http://localhost:4000/stroes/join" \
 -h "Authorization=Bearer XXXX" \
 -d "businessNumber=5646531351" \
 -d "businessUrl=http://localhost:4000/file/bebd4a76-5278-4fe6-b140-4f87ed5e3151.jpg" 

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

클라이언트는 가게명, 가게 연락처, 가게 주소, 간단한 가게 소개, 상세 가게 소개, 태그 최대 5개, 문의하기, 픽업 가능 일시를  입력하여 요청하고 가게 동록이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 
데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **POST**  
- URL : **/mypage/storeInfo/{userId}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| storeName | String | 가게명 | O |
| storeTel | String | 가게 연락처 | O |
| storeAddress | String | 가게 주소 | O |
| storeUrl | String | 가게 이미지 URL | O |
| storeIntegerroduce | String | 간단한 가게 소개 | O |
| storeParticular | String | 상세소개글 | O |
| storeContact | String | 문의하기 | O |
| storeParticular | String | 상세소개글 | O |
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

```bash
curl -v -X POST "http://localhost:4000/mypage/storeInfo/qwer1234" \
 -h "Authorization=Bearer XXXX" \
 -d "storeName=가게명임의값" \
 -d "storeTel=010-1234-5678" \
 -d "storeNddress=서울특별시 임의주소" \
 -d "storeUrl=http://localhost:4000/file/store_image.jpg" \
 -d "storeIntegerroduce=간단한 가게 소개임의값" \
 -d "storeParticular=상세소개글임의값" \
 -d "storeContact=문의하기임의값" \
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
| storeName | String | 가게명 | O |
| storeRating | Float | 가게 별점 | O |
| reviewCount | Integer | 리뷰 개수 | O |
| likeCount | Integer | 찜 개수 | O |
| storeAddress | String | 가게 주소 | O |
| storeAddress | String | 가게 주소 | O |
| storeUrl | String | 가게 이미지 URL | O |
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
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
  "stores":  [
    {
      "storeName": "가게명임의값",
      "storeAddress": "금정구 부곡동",
      "storeRating": 4.5,
      "reviewCount": 127,
      "likeCount": 14,
      "storeUrl": "http://localhost:4000/file/store_image.jpg"
    }
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

#### - 가게 상세 조회 -  주문하기  
  
##### 설명

클라이언트는 가게 상세 조회를 요청하고 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/stores/{storesNumber}/order**  

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
| storeName | String | 가게명 | O |
| storeRating | Float | 가게 별점 | O |
| storeAddress | String | 가게 주소 | O |
| storeIntroduce | String | 가게 소개  | O |
| storeUrl | String | 가게 이미지 URL | O |
| productName | String | 상품 이름 | O |
| productTag | String | 태그 내용 | O |
| productPrice | int | 상품 가격 | O |
| productOptionUrl | String | 상품 이미지 URL | X |
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
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success."
  "stores":  [
    {
      "productName": "가게명임의값",
      "storeRating": 4.5,
      "storeAddress": "금정구 동부곡로 9번길 53 1층",
      "sundayOpen": 11,
      "sundayLast": 20,
      "mondayOpen": 11,
      "mondayLast": 20,
      "tuesdayOpen": 11,
      "tuesdayLast": 20,
      "wednesdayOpen": 11,
      "wednesdayLast": 20,
      "thursdayOpen": 11,
      "thursdayLast": 20,
      "fridayOpen": 11,
      "fridayLast": 20,
      "saturdayOpen": 11,
      "saturdayLast": 20,
      "storeIntroduce": "생화 케이크 제작 전문점입니다.",
      "storeUrl": "http://localhost:4000/file/store_image.jpg"
    }
  ]
  "products":  [
    {
      "productName": "케이크1",
      "productTag": "귀여움",
      "productPrice": 35000,
      "productOptionUrl": "http://localhost:4000/file/store_image.jpg"
    }
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

#### - 가게 수정  
  
##### 설명

클라이언트는 가게명, 가게 연락처, 가게 주소, 간단한 가게 소개, 상세 가게 소개, 태그 최대 5개, 문의하기, 픽업 가능 일시를 입력하여 요청하고 가게 수정이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 
데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **PATCH**  
- URL : **/mypage/storeInfo/{userId}/update**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| storeName | String | 가게명 | O |
| storeTel | String | 가게 연락처 | O |
| storeAddress | String | 가게 주소 | O |
| storeUrl | String | 가게 이미지 URL | O |
| storeIntegerroduce | String | 간단한 가게 소개 | O |
| storeParticular | String | 상세소개글 | O |
| storeContact | String | 문의하기 | O |
| storeParticular | String | 상세소개글 | O |
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

```bash
curl -v -X PATCH "http://localhost:4000/mypage/storeInfo/qwer1234/update" \
 -h "Authorization=Bearer XXXX" \
 -d "storeName=가게명임의값" \
 -d "storeTel=010-1234-5678" \
 -d "storeNddress=금정구 부곡동" \
 -d "storeUrl=http://localhost:4000/file/store_image.jpg" \
 -d "storeIntegerroduce=간단한 가게 소개임의값" \
 -d "storeParticular=상세소개글임의값" \
 -d "storeContact=문의하기임의값" \
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

#### - 가게 상세 조회 - 매장정보(카카오 지도)  
  
##### 설명

클라이언트는 매장정보 버튼을 선택하면, 해당 가게의 상세 소개글과 카카오 지도 조회를 요청합니다. 이 동작이 성공적으로 이루어지면 성공에 대한 응답을 받습니다.

- method : **GET**  
- URL : **/stores/{storesNumber}/particular**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증 방식, REST API 키로 인증 요청 | O |
| storeNddress | 가게 주소 | O |


###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|


###### Example

```bash
curl -v -X GET "http://localhost:4000/stroes/join" \
 -h "Authorization=KakaoAK ${REST_API_KEY} " \
 -date-urlencode "query = 부산광역시 동부곡로9번길 53 1층"
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
  "documents": [
    {
      "address": [
        "address_name": "부산 금정구 부곡동 293-25",
        "b_code": "2641010900",
        "h_code": "2641058000",
        "main_address_no": "293",
        "mountain_yn": "N",
        "region_1depth_name": "부산",
        "region_2depth_name": "금정구",
        "region_3depth_h_name": "부곡2동",
        "region_3depth_name": "부곡동",
        "sub_address_no": "25",
        "x": "129.093139757379",
        "y": "35.2280956925742"
      ],
      "address_name": "부산 금정구 동부곡로9번길 53",
      "address_type": "ROAD_ADDR",
      "road_address": [
        "address_name": "부산 금정구 동부곡로9번길 53",
        "building_name": "",
        "main_building_no": "53",
        "region_1depth_name": "부산",
        "region_2depth_name": "금정구",
        "region_3depth_name": "부곡동",
        "road_name": "동부곡로9번길",
        "sub_building_no": "",
        "underground_yn": "N",
        "x": "129.093139757379",
        "y": "35.2280956925742",
        "zone_no": "46271"
      ],
      "x": "129.093139757379",
      "y": "35.2280956925742"
    }
  ],
  "meta": [
    "is_end": true,
    "pageable_count": 1,
    "total_count": 1
  ]
}
```

***

#### - 가게 상세 조회 - 매장정보(상세 소개글)  
  
##### 설명

클라이언트는 매장정보 버튼을 선택하면, 해당 가게의 상세 소개글 조회를 요청합니다. 이 동작이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/stores/{storesNumber}/particular**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|


###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|


###### Example

```bash
curl -v -X GET "http://localhost:4000/stores/{storesNumber}/particular" \
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
| storeParticular | String | 상세 소개글 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success.",
  "storeParticular": "저희 가게에 방문해주셔서 감사합니다! OO케이크는 칠순 케이크, 부모님 은퇴 케이크 등을 주로 판매하고 있습니다! 지도의 주소를 참고하시고, 많은 주문 부탁드립니다!"
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

#### - 가게 상세 조회 - 문의하기  
  
##### 설명

클라이언트는 문의하기 버튼을 선택하면, 해당 가게의 문의하기 값 조회를 요청합니다. 이 동작이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/stores/{storesNumber}/contact**  

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
| storeContact | String | 문의하기 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success.",
  "storeContact": "인스타그램: @abc_cake"
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

#### - 가게 상세 조회 - 리뷰  
  
##### 설명

클라이언트는 리뷰 버튼을 선택하면, 해당 가게의 리뷰 값 조회를 요청합니다. 이 동작이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/stores/{storesNumber}/reivew**  

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
  "review":  [
    {
      "reviewRating": s4.5,
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
