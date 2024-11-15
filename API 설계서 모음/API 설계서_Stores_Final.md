<h1 style='background-color: rgba(55, 55, 55, 0.4); text-align: center'>API 설계(명세)서_Stores</h1>

해당 API 명세서는 '더 메모리얼 데이 - The Memorial Day'의 REST API를 명세하고 있습니다.  

- Domain : http://localhost:4000   

***
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Stores 모듈</h2>

The Memorial Day 서비스의 가게와 관련된 REST API 모듈입니다.  
가게 정보 조회, 상품 정보 조회 등의 API가 포함되어 있습니다.
가게 정보 조회는 인증 없이 요청할 수 있습니다.
  
- url : /stores

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

```bash
curl -v -X GET "http://localhost:4000/stores"
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
        },
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
          "likeList": [],
          "productToday": [],
          "productTag": [],
          "themes": []
        }
  ]
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

#### - 검색에 맞는 가게 리스트 불러오기  
  
##### 설명

클라이언트는 스토어화면에서 상품이름이나 가게명을 검색하여 성공하면 검색에 맞는 가게 리스트를 받아온다. 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이티베이스 에러가 발생할 수 있습니다.   

- method : **GET**  
- URL : **/search-main?searchKeyword={searchKeyword}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/stores/search-main?searchKeyword=쿠키"
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

#### - 가게 상세 조회 - 상단의 가게 영업 정보
  
##### 설명

클라이언트는 가게 상세 조회를 요청하고 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/{storesNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/stores/1"
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

#### 가게 상품 불러오기
  
##### 설명

클라이언트는 가게 내의 상품 리스트를 요청할 수 있다. Bearer 토큰을 포함하지 않는다. 

- method : **GET**  
- URL : **/{storesNumber}/order/list**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/stores/1/order/list"
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
| previewProduct | PreviewProduct[] | 상품 간단 정보 | O |

**PreviewProduct**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productNumber | Integer | 상품 번호 | O |
| productName | String | 상품 이름 | O |
| productPrice | Integer | 상품 가격 | O |
| productToday | Boolean | 상품 당일 픽업 가능 유무 | O |
| themes | String[] | 상품 테마 리스트 | X |
| productImage | String | 상품 대표 이미지 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json; charset=UTF-8
{
    "code": "SU",
    "message": "Success.",
    "previewProducts": [
        {
            "productNumber": 7,
            "productName": "망고케이크",
            "productPrice": 200,
            "productToday": false,
            "themes": [
                "#연인",
                "#화려함",
                "#효도"
            ],
            "productImage": "http://localhost:4000/file/a2974ffd-9f69-42e2-85cf-08b8a70ec8cb.jpg"
        },
        {
            "productNumber": 6,
            "productName": "망고케이크",
            "productPrice": 200,
            "productToday": false,
            "themes": [
                "#연인",
                "#화려함",
                "#효도"
            ],
            "productImage": "http://localhost:4000/file/a2974ffd-9f69-42e2-85cf-08b8a70ec8cb.jpg"
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

**응답 실패 (존재하지 않는 상품)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NP",
  "message": "No exist product."
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

##### 설명

클라이언트는 상품 사진을 타고 들어와 상품 상세정보를 보는 페이지입니다. URL에 상품번호를 포함하여 요청하고 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 상품일 경우 존재하지 않는 상품에 해당하는 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **GET**  
- end point : **/{storeNumber}/order/{productNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/stores/1/order/1"
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
| orderProductDetail | OrderProductDetail | 상품 상세 정보 | O |

**OrderProductDetail**
| name | type | description | required |
|---|:---:|:---:|:---:|
| productNumber | Integer | 상품 번호 | O |
| productName | String | 상품 이름 | O |
| productIntroduce | String | 상품 소개 | O |
| productPrice | Integer | 상품 최소 가격 | O |
| productTag | String | 상품 태그 | O |
| productToday | Boolean | 당일 케이크 여부 | O |
| productImages | String[] | 상품 이미지 리스트 | O |
| themes | String[] | 상품 테마 리스트 | X |
| options | Option[] | 상품 옵션 리스트 | O |
| storeCaution | String | 가게 유의 사항 | O |
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
  "orderProductDetails": {
    "productNumber": 2,
    "productName": "블루베리 케이크",
    "productIntroduce": "눈에 좋은 블루베리가 가득",
    "productPrice": 32000,
    "productTag": "레터링",
    "productToday": true,
    "productImages": [
      "http://localhost:4000/file/6bb6068f-303d-4077-abe1-6241414843f4.jpg"
    ],
    "themes": [
      "#귀여움",
      "#심플",
      "#어린이"
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
    "sundayLast": "휴무일",
    "storeCaution": "유의 부탁 드립니다~"
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

**응답 실패 (존재하지 않는 용품)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NP",
  "message": "No exist product."
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

#### - 주문하기  
  
##### 설명

클라이언트는 픽업 시간, 제품 수량, 요청 사항, 옵션과 각 옵션 별 선택 사항, 총 가격을  입력하여 요청하고 주문하기가 성공적으로 이루어지면 성공에 대한 응답을 받습니다.
데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **POST**  
- URL : **/{storeNumber}/order/{productNumber}/{userId}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| pickupTime | String | 픽업 시간 | O |
| productCount | Integer | 제품 수량 | O |
| productContents | String | 요청 사항 | X |
| totalPrice | Integer | 총 가격 | O |
| photoUrl | String | 포토케이크 요청 사진 | X |
| options | Option[] | 상품옵션 리스트 | O |

### Option
| name             | type           | description      | required |
|---|:---:|:---:|:---:|
| productOptionName| String         | 옵션 이름       | O        |
| optionDetails    | OptionDetail[] | 옵션 세부 사항  | O        |

### OptionDetail
| name               | type     | description     | required |
|---|:---:|:---:|:---:|
| productCategory    | String   | 옵션 소분류      | O        |
| productOptionPrice | Integer  | 옵션 가격       | O        |

###### Example

```bash
curl -v -X POST "http://localhost:4000/stores/13/order/96/qwer1234" \
 -h "Authorization=Bearer XXXX" \
 -d "pickupTime=202411300900" \
 -d "productCount=1" \
 -d "productContents=예쁘게 부탁드려용" \
 -d "totalPrice=48000" \
 -d "photoUrl=요청 사진.jpg" \
 -d "options=[
       {
         "productOptionName": "크기",
         "optionDetails": [
            {
             "productCategory": "2호",
             "productOptionPrice": 10000
            }
        ],
       {
         "productOptionName": "맛",
         "optionDetails": [
           {
             "productCategory": "초코",
             "productOptionPrice": 3000
           }
         ]
       },
       {
         "productOptionName": "색상",
         "optionDetails": [
           {
             "productCategory": "빨강",
             "productOptionPrice": 0
           }
         ]
       },
       {
         "productOptionName": "초",
         "optionDetails": [
           {
             "productCategory": "곰돌이초",
             "productOptionPrice": 2000
           }
         ]
       },
       {
         "productOptionName": "크림",
         "optionDetails": [
           {
             "productCategory": "식물성",
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

#### - 리뷰 리스트 불러오기
  
##### 설명

요청 헤더에 Bearer 인증 토큰을 포함하고 해당 가게의 리뷰 리스트 조회를 요청합니다. 이 동작이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 리뷰일 경우 존재하지 않는 리뷰에 대한 응답을 받습니다. 네트워크 에러, 데이터베이스 에러가 발생할 수 있습니다.

- method : **GET**  
- URL : **/{storeNumber}/review/list** 

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -X GET "http://localhost:4000/stores/1/review/list"
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
| name | type | description | required |
|---|:---:|:---:|:---:|
| reviewRating | Double | 리뷰 별점 | O |
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
  "reviews": [
        {
            "reviewRating": 5,
            "reviewDay": "2024-11-07T15:00:00.000+00:00",
            "reviewContents": "으아아ㅏㅏㅏㅏ",
            "productName": "체리케이크",
            "imageUrls": [
                "http://localhost:4000/file/4a4b0408-dd2c-4b63-a70c-bbe6fb7f6b5a.jpg"
            ]
        },
        {
            "reviewRating": 5,
            "reviewDay": "2024-11-07T15:00:00.000+00:00",
            "reviewContents": "딸기가 너무 달고 맛있었어요 다음에 또 주문할게영",
            "productName": "딸기",
            "imageUrls": [
                "http://localhost:4000/file/5af5fa45-85df-4cec-93d6-814d76404e9f.jpg"
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
  "message": "No existed store."
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
  "message": "DataBase error."
}
```