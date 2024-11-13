***
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>상점-상품페이지</h2>

The Memoridal Day의 상품관리와 관련된 REST API 모듈입니다.  
상품 상세페이지, 상품 등록, 상품 삭제, 상품 수정 등의 API가 포함되어 있습니다.  
  
- url : /{storeNumber}/order

***

#### - 상품 상세페이지
  
##### 설명

클라이언트는 상품 사진을 타고 들어와 상품 상세정보를 보는 페이지입니다. URL에 상품번호를 포함하여 요청하고 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 상품일 경우 존재하지 않는 상품에 해당하는 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **GET**  
- end point : **/{productNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/stores/1/order/1" \
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
| orderProductDetails | orderProductDetails | 상품 상세 정보 | O |

**orderProductDetails**
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
| storeCaution | String | 가게 유의 사항 | O |

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
}
```

**응답 : 실패 (존재하지 않는 용품)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NP",
  "message": "No exist product."
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

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>상품관리</h2>

The Memoridal Day의 상품관리와 관련된 REST API 모듈입니다.  
상품 상세페이지, 상품 등록, 상품 삭제, 상품 수정 등의 API가 포함되어 있습니다.  
  
- url : /mypage/product/

***

#### - 상품 등록 페이지
  
##### 설명

상품 관리 페이지에서 상품 추가 버튼을 클릭하여 상품을 신규로 추가하며 설정하는 페이지이다. 클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 상품번호를 포함하고 상품 이름, 상품 소개, 가격, 당일 케이크 여부, 상품옵션 리스트, 상품 테마 리스트, 상품태그명, 상품사진을 입력하여 요청하고 상품 등록이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **POST**  
- end point : **/add**  

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
curl -v -X POST "http://localhost:4000/mypage/product/add" \
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

#### - 상품 수정 페이지
  
##### 설명

상품 관리 페이지에서 상품을 클릭하여 상품을 수정하는 페이지이다. 클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 상품번호를 포함하고 상품 이름, 상품 소개, 가격, 당일 케이크 여부, 상품옵션 리스트, 상품 테마 리스트, 상품태그명, 상품사진을 입력하여 요청하고 상품 수정이 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 상품일 경우 존재하지 않는 상품에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

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

**응답 : 실패 (존재하지 않는 상품)**
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

#### - 상품 삭제
  
##### 설명

클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 상품번호를 포함하여 요처하고 상품 삭제가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 상품일 경우 존재하지 않는 상품에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

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

**응답 : 실패 (존재하지 않는 상품)**
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