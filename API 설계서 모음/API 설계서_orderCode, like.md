***

#### - 검색에 맞는 가게 리스트 불러오기  
  
##### 설명

클라이언트는 스토어화면에서 상품이름이나 가게명을 검색하여 성공하면 검색에 맞는 가게 리스트를 받아온다. 데이터 유효성 검사 실패 에러, 인증 실패 에러, 데이티베이스 에러가 발생할 수 있습니다.   

- method : **GET**  
- URL : **/stores/search-main?searchKeyword={searchKeyword}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/stores/search-main?searchKeyword=쿠키" \
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