***
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>상점-상품페이지</h2>

The Memoridal Day의 상품관리와 관련된 REST API 모듈입니다.  
상품 상세페이지, 상품 등록, 상품 삭제, 상품 수정 등의 API가 포함되어 있습니다.  
  
- url : /{storeNumber}/order

***

#### - 상품 상세페이지
  
##### 설명

클라이언트는 상품 사진을 타고 들어와 상품 상세정보를 보는 페이지이다. URL에 상품번호를 포함하여 요청하고 조회가 성공적으로 이루어지면 성공에 대한 응답을 받습니다. 만약 존재하지 않는 상품일 경우 존재하지 않는 상품에 해당하는 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **GET**  
- end point : **/{productNumber}**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| productNumber | Integer | 상품의 번호 | O |


###### Example

```bash
curl -v -X GET "http://localhost:4000/{storeNumber}/store_main/{productNumber}" \
 -d "storeNumber=3"
 -d "productNumber=3"
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
| productNumber | Integer | 상품 번호 | O |
| productName | String | 상품 이름 | O |
| productIntroduce | String | 상품 소개 | X |
| productPrice | Integer | 가격 | O |
| productToday | Boolean | 당일 케이크 여부 | O |
| options | Option | 상품옵션 리스트 | O |
| themas | String[] | 상품 테마 리스트 | O |
| tag | String | 상품태그명 | O |
| productImageUrl | String[] | 상품사진 | O |

**Option**
| name | type | description | required |
|---|:---:|:---:|:---:|
| optionNumber | Integer | 옵션 번호 | O |
| productOptionName | String | 옵션 이름 | O |
| optionsName | OptionName | 옵션 소분류 리스트 | O |

**OptionName**
| name | type | description | required |
|---|:---:|:---:|:---:|
| optionCategoryNumber | Integer | 옵션 카테고리 번호 | O |
| productCategory | String | 옵션 소분류 | O |
| productOptionPrice | Integer | 옵션 가격 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8

{
  "code": "SU",
  "message": "Success.",
  "productNumber" : 3,
  "productName" : "딸기케이크",
  "productIntroduce" : "정말 달콤하고 맛있어요.",
  "productPrice" : 35000,
  "productToday" : 0,
    "options" : [
      "optionNumber" : 4,
      "productOptonName" : "색상",
      "optionsName" : [
        "optionCategoryNumber" : 1,
        "productCategory" : "빨강",
        "productOptionPrice" : 5000 
      ], [
        "optionCategoryNumber" : 2,
        "productCategory" : "초록",
        "productOptionPrice" : 3000 
      ]
  ],
  "themas": "["심플", "화려함"]",
  "tag": "한입케이크",
  "productImageUrl" : [
    "케이크1.png",
    "케이크2.png"
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
  
- url : /mypage/product_mange/

***

#### - 상품 등록 페이지
  
##### 설명

상품 관리 페이지에서 상품 추가 버튼을 클릭하여 상품을 신규로 추가하며 설정하는 페이지이다. 클라이언트는 요청 헤더에 Bearer 인증 토큰을 포함하고 URL에 상품번호를 포함하고 상품 이름, 상품 소개, 가격, 당일 케이크 여부, 상품옵션 리스트, 상품 테마 리스트, 상품태그명, 상품사진을 입력하여 요청하고 상품 등록이 이루어지면 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 데이터베이스 에러가 발생할 수 있습니다. 

- method : **POST**  
- end point : **/{storeNumber}**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |
| productName | String | 상품 이름 | O |
| productIntroduce | String | 상품 소개 | X |
| productPrice | Integer | 가격 | O |
| productToday | Boolean | 당일 케이크 여부 | O |
| options | Option | 상품옵션 리스트 | O |
| themas | String[] | 상품 테마 리스트 | O |
| tag | String | 상품태그명 | O |
| productImageUrl | String[] | 상품사진 | O |

**Option**
| name | type | description | required |
|---|:---:|:---:|:---:|
| optionNumber | Integer | 옵션 번호 | O |
| productOptionName | String | 옵션 이름 | O |
| optionsName | OptionName | 옵션 소분류 리스트 | O |

**OptionName**
| name | type | description | required |
|---|:---:|:---:|:---:|
| optionCategoryNumber | Integer | 옵션 카테고리 번호 | O |
| productCategory | String | 옵션 소분류 | O |
| productOptionPrice | Integer | 옵션 가격 | O |


###### Example

```bash
curl -v -X POST "http://localhost:4000/mypage/product_manage/{storeNumber}" \
 -d "productName = '초코케이크'" \
 -d "productIntroduce : '달달한 수제 케이크.' " \
 -d "productPrice = 40000" \
 -d "productToday = 1 " \
 -d "options = [
  "optionNumber" : 1,
      "productOptonName" : "맛",
      "optionsName" : [
        "optionCategoryNumber" : 1,
        "productCategory" : "다크",
        "productOptionPrice" : 0
      ], 
      "optionsName" : [
        "optionCategoryNumber" : 2,
        "productCategory" : "민트",
        "productOptionPrice" : 1000
      ], 
      "optionsName" : [
        "optionCategoryNumber" : 3,
        "productCategory" : "딸기",
        "productOptionPrice" : 2000,
      ] 
  ] " \
  -d "themas = "[축하, 무난]" \
  -d "tag = '레터링케이크' " \ 
  -d "productImageUrl : ["초코1.jpg", "초코2.jpg"]" \
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
- end point : **/{storeNumber}/{productNumber}**  

##### Request

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 코드에 대한 설명 | O |
| productName | String | 상품 이름 | O |
| productIntroduce | String | 상품 소개 | X |
| productPrice | Integer | 가격 | O |
| productToday | Boolean | 당일 케이크 여부 | O |
| options | Option | 상품옵션 리스트 | O |
| themas | String[] | 상품 테마 리스트 | O |
| tag | String | 상품태그명 | O |
| productImageUrl | String[] | 상품사진 | O |

**Option**
| name | type | description | required |
|---|:---:|:---:|:---:|
| optionNumber | Integer | 옵션 번호 | O |
| productOptionName | String | 옵션 이름 | O |
| optionsName | OptionName | 옵션 소분류 리스트 | O |

**OptionName**
| name | type | description | required |
|---|:---:|:---:|:---:|
| optionCategoryNumber | Integer | 옵션 카테고리 번호 | O |
| productCategory | String | 옵션 소분류 | O |
| productOptionPrice | Integer | 옵션 가격 | O |



###### Example

```bash
curl -v -X PATCH "http://localhost:4000/mypage/product_manage/{store_number}/{product_number}" \
 -d "productName = '레터링케이크'" \
 -d "productIntroduce : '자유자제로 적을 수 있는 케이크.' " \
 -d "productPrice = 20000" \
 -d "productToday = 0 " \
 -d "options = [
  "optionNumber" : 1,
      "productOptonName" : "맛",
      "optionsName" : [
        "optionCategoryNumber" : 1,
        "productCategory" : "다크",
        "productOptionPrice" : 0
      ], 
      "optionsName" : [
        "optionCategoryNumber" : 4,
        "productCategory" : "치즈",
        "productOptionPrice" : 6000
      ], 
      "optionsName" : [
        "optionCategoryNumber" : 3,
        "productCategory" : "딸기",
        "productOptionPrice" : 2000,
      ] 
  ] " \
  -d "themas = "[레터링, 사진]" \
  -d "tag = '레터링케이크' " \ 
  -d "productImageUrl : ["레터링1.jpg", "레터링2.jpg"]" \
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
- end point : **/{storeNumber}/{productNumber}**  

##### Request

###### Example

```bash
curl -v -X DELETE "http://localhost:4000/mypage/product_manage/{storeNumber}/{productNumber}" \
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














