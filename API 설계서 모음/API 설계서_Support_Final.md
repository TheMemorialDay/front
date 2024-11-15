<h1 style='background-color: rgba(55, 55, 55, 0.4); text-align: center'>API 설계(명세)서_Support </h1>

해당 API 명세서는 '더 메모리얼 데이 - The Memorial Day'의 REST API를 명세하고 있습니다.  

- Domain : http://localhost:4000

***
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Support 모듈</h2>

The Memorial Day 서비스의 공지사항, Q&A와 관련된 REST API 모듈입니다.  
공지사항 리스트 조회, 공지사항 상세 조회, Q&A 리스트 조회, Q&A 작성, Q&A 상세 조회, Q&A 질문 삭제 API가 포함되어 있습니다.
Q&A 작성, Q&A 질문 삭제 외에는 인증 없이 요청할 수 있습니다.
  
- url : /support/notice

***

#### - 공지사항 리스트 조회  
  
##### 설명

클라이언트는 Notice를 클릭하여 공지사항 리스트 조회를 요청할 수 있으며, 성공 시 성공에 대한 응답을 받습니다. 데이터베이스 에러가 발생할 수 있습니다.  

- method : **GET**  
- URL : **/**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/support/notice"
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
| notices | Notice[] | 공지사항 리스트 | O |


**Notice**
| name | type | description | required |
|---|:---:|:---:|:---:|
| noticeNumber | Integer | 공지사항 번호 | O |
| noticeTitle | String | 공지사항 제목 | O |
| noticeContents | String | 공지사항 내용 | O |
| noticeDay | String | 공지사항 작성일 | O |

###### Example


**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success."
  "notices":  [
    {
      "noticeNumber": 2,
      "noticeTitle": "제 2차 정기 서버 점검이 있습니다.",
      "noticeContents": "내용입니다.",
      "noticeDay": "2024-11-08T15:00:00.000+00:00"
    },
    {
      "noticeNumber": 1,
      "noticeTitle": "제 1차 정기 서버 점검이 있습니다.",
      "noticeContents": "내용입니다.",
      "noticeDay": "2024-11-08T15:00:00.000+00:00"
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

#### - 공지사항 상세 조회  
  
##### 설명

클라이언트는 Notice의 한 공지사항을 클릭하여 공지사항의 상세 조회를 요청할 수 있으며, 성공 시 성공에 대한 응답을 받습니다. 데이터베이스 에러가 발생할 수 있습니다.  

- method : **GET**  
- URL : **/{noticeNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/support/notice/1"
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
| noticeNumber | Integer | 공지사항 번호 | O |
| noticeTitle | String | 공지사항 제목 | O |
| noticeContents | String | 공지사항 내용 | O |
| noticeDay | String | 공지사항 작성일 | O |

###### Example


**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "noticeNumber": 1,
  "noticeTitle": "제 2차 정기 서버 점검이 있습니다.",
  "noticeContents": "제 2차 정기 서버 점검이 있습니다. 유저 분들은 유의해주세요~",
  "noticeDay": "2024-10-04"
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

#### - Q&A 리스트 조회  
  
##### 설명

클라이언트는 Q&A를 클릭하여 Q&A 리스트 조회를 요청할 수 있으며, 성공 시 성공에 대한 응답을 받습니다. 데이터베이스 에러가 발생할 수 있습니다.  

- method : **GET**  
- URL : **/question**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/support/notice/question"
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
| qnas | Qna[] | 질의응답 리스트 | O |

**Qna**
| name | type | description | required |
|---|:---:|:---:|:---:|
| questionNumber | Integer | 질문 번호 | O |
| questionTitle | String | 질문 제목 | O |
| questionContents | String | 질문 내용 | O |
| questionDay | String | 질문 작성일 | O |
| userId | String | 질문 작성자 | O |
| questionStatus | String | 질문 답변 상태 | O |
| answerContents | String | 질문 답변 내용 | X |
| name | String | 작성자 이름 | X |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success."
  "qnas":  [
        {
            "questionNumber": 18,
            "questionTitle": "으아ㅏㅏㅏㅏㅏㅏㅏㅏ",
            "questionContents": "조인 왤케 할게 많아요ㅗㅇㅇㅇㅇㅇㅇㅇㅇ오오오옹ㅋ",
            "questionDay": "2024-10-28",
            "userId": "qwer1234",
            "questionStatus": "완료",
            "answerContents": "확인했습니다.",
            "name": "황영미"
        },
        {
            "questionNumber": 17,
            "questionTitle": "테스트",
            "questionContents": "로그인 유저 상태 확인하고 그에 따른 삭제 버튼이 되는지 안되는지 드디어 됐다구요~",
            "questionDay": "2024-10-27",
            "userId": "qwer1234",
            "questionStatus": "미응답",
            "answerContents": "",
            "name": "황영미"
        },
        {
            "questionNumber": 16,
            "questionTitle": "연락",
            "questionContents": "제가 이틀 전에 케이크를 예약을 했고 내일 모레 케이크 픽업인데 사장님과 연락이 안되네요...",
            "questionDay": "2024-10-27",
            "userId": "ghwjd5585",
            "questionStatus": "미응답",
            "answerContents": "",
            "name": "정호정"
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

#### - Q&A 상세 조회  
  
##### 설명

클라이언트는 Q&A의 한 질문을 클릭하여 질문의 상세 조회를 요청할 수 있으며, 성공 시 성공에 대한 응답을 받습니다. 데이터베이스 에러가 발생할 수 있습니다.  

- method : **GET**  
- URL : **/question/{questionNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|

###### Example

```bash
curl -v -X GET "http://localhost:4000/support/notice/question/18"
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
| questionTitle | String | 질문 제목 | O |
| questionContents | String | 질문 내용 | O |
| questionDay | String | 질문 작성일 | O |
| userId | String | 질문 작성자 | O |
| questionStatus | String | 질문 답변 완료 상태 | O | 
| answerContents | String | 질문 답변 내용 | X |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "questionTitle": "으아ㅏㅏㅏㅏㅏㅏㅏㅏ",
  "questionContents": "조인 왤케 할게 많아요ㅗㅇㅇㅇㅇㅇㅇㅇㅇ오오오옹ㅋ",
  "questionDay": "2024-10-27T15:00:00.000+00:00",
  "userId": "qwer1234",
  "questionStatus": "완료",
  "answerContents": "확인했습니다."
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

#### - Q&A 질문 작성  
  
##### 설명

클라이언트는 Q&A의 작성을 클릭하여 질문 제목과 내용을 입력하여 요청하고, 성공 시 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 인증 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **POST**  
- URL : **/question/write**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | Bearer 토큰 인증 헤더 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| questionTitle | String | 질문 제목 | O |
| questionContents | String | 질문 내용 | O |
| questionDay | String | 질문 작성일 | O |
| userId | String | 질문 작성자 | O |
| questionStatus | String | 질문 답변 유무 | O |
| answerContents | String | 질문 답변 내용 | X |

###### Example

```bash
curl -v -X POST "http://localhost:4000/support/notice/question/write" \
 -h "Authorization=Bearer XXXX" \
 -d "questionTitle=질문1" \
 -d "questionContents=내용1" \
 -d "questionDay=2024-11-13" \
 -d "userId=qwer1234" \
 -d "questionStatus=미응답" \
 -d "answerContetns=null"

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

#### - Q&A 질문 삭제  
  
##### 설명

클라이언트는 Q&A의 질문 삭제를 요청하고, 성공 시 성공에 대한 응답을 받습니다. 네트워크 에러, 서버 에러, 인증 에러, 데이터베이스 에러가 발생할 수 있습니다.  

- method : **DELETE**  
- URL : **/question/{questionNumber}**  

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
curl -v -X DELETE "http://localhost:4000/support/notice/question/1" \
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

**응답 실패 (존재하지 않는 QnA)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NQ",
  "message": "No Exist Question."
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