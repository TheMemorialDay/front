// variable: 상대 경로 상수 //
export const ROOT_PATH = '/';

export const ST_PATH = '/stores';
export const ST_NUMBER_PATH = (storeNumber: number | string) => `${storeNumber}`;
export const ST_PRODUCT_ORDER_PATH = '1';
export const ST_ORDER_DONE_PATH = 'done';

export const ST_ORDER_DETAIL_PATH = `order`;
export const ST_INFORMATION_DETAIL_PATH = `information`;
export const ST_CONTACT_DETAIL_PATH = `contact`;
export const ST_REVIEW_DETAIL_PATH = `review`;

export const HO_PATH = '/how';

export const SU_PATH = '/support/notice';
export const SU_NOTICE_DETAIL_PATH = (noticeNumber: number | string) => `${SU_PATH}/${noticeNumber}`; // detail
export const SU_QA_PATH = `${SU_PATH}/question`;
export const SU_QA_WRITE_PATH = `${SU_QA_PATH}/write`;
export const SU_QA_DETAIL_PATH = (questionNumber: string | number) => `${SU_QA_PATH}/${questionNumber}`; // detail

export const SHOPPING_CART_PATH = '/shopping-cart';

export const JO_PATH = '/join';
export const JOIN_OKAY_PATH = 'okay';

export const OTHERS_PATH = '*';

export const LOGIN_PATH = '/auth';
export const SIGN_UP_PATH = `sign-up`;

export const MY_PATH = '/mypage';
export const MY_INFO_PATH = `user-info`;
export const MY_PASSWORD_CHECK_PATH = `password-check`;
export const MY_ORDER_DETAIL_PATH = `order-detail`;
export const MY_REVIEW_PATH = `review`;
export const MY_LIKE_PATH = `like`;
export const MY_STORE_PATH = `store`;
export const MY_STORE_DETAIL_PATH = (storeNumber: string | number) => `${storeNumber}`;

export const MY_PRODUCT_PATH = `product`;
export const MY_PRODUCT_ADD_PATH = `1`;
export const MY_PRODUCT_UPDATE_PATH = `1/1`;

export const MY_ORDER_MANAGE_PATH = `order-manage`;
export const MY_SALES_PATH = `sales`;



// variable: 절대 경로 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;

export const ST_ABSOLUTE_PATH = ST_PATH;
export const ST_ABSOLUTE_ORDER_DETAIL_PATH = (storeNumber: string | number) => `${ST_PATH}/${ST_NUMBER_PATH(storeNumber)}/${ST_ORDER_DETAIL_PATH}`;
export const ST_PRODUCT_ORDER_ABSOLUTE_PATH = `${ST_ABSOLUTE_ORDER_DETAIL_PATH}/${ST_PRODUCT_ORDER_PATH}`;
export const ST_ORDER_DONE_ABSOLUTE_PATH = `${ST_ABSOLUTE_ORDER_DETAIL_PATH}/${ST_ORDER_DONE_PATH}`;

export const ST_ABSOLUTE_INFORMATION_DETAIL_PATH = (storeNumber: string | number) => `${ST_PATH}/${ST_NUMBER_PATH(storeNumber)}/${ST_INFORMATION_DETAIL_PATH}`;
export const ST_ABSOLUTE_CONTACT_DETAIL_PATH = (storeNumber: string | number) => `${ST_PATH}/${ST_NUMBER_PATH(storeNumber)}/${ST_CONTACT_DETAIL_PATH}`;
export const ST_ABSOLUTE_REVIEW_DETAIL_PATH = (storeNumber: string | number) => `${ST_PATH}/${ST_NUMBER_PATH(storeNumber)}/${ST_REVIEW_DETAIL_PATH}`;

export const HO_ABSOLUTE_PATH = HO_PATH;

export const SU_ABSOLUTE_PATH = SU_PATH;
export const SU_ABSOLUTE_NOTICE_DETAIL_PATH = SU_NOTICE_DETAIL_PATH;
export const SU_ABSOLUTE_QA_PATH = SU_QA_PATH;
export const SU_ABSOLUTE_QA_WRITE_PATH = SU_QA_WRITE_PATH;
export const SU_ABSOLUTE_QA_DETAIL_PATH = SU_QA_DETAIL_PATH;

export const SHOPPING_CART_ABSOLUTE_PATH = SHOPPING_CART_PATH;

export const JO_ABSOLUTE_PATH = JO_PATH;
export const JO_OKAY_ABSOLUTE_PATH = `${JO_PATH}/${JOIN_OKAY_PATH}`;

export const SIGN_IN_ABSOLUTE_PATH = LOGIN_PATH;
export const SIGN_UP_ABSOLUTE_PATH = `${LOGIN_PATH}/${SIGN_UP_PATH}`;

export const MY_ABSOLUTE_PATH = MY_PATH;
export const MY_INFO_ABSOLUTE_PATH = `${MY_PATH}/${MY_INFO_PATH}`;
export const MY_PASSWORD_CHECK_ABSOLUTE_PATH = `${MY_INFO_ABSOLUTE_PATH}/${MY_PASSWORD_CHECK_PATH}`;
export const MY_ORDER_DETAIL_ABSOLUTE_PATH = `${MY_PATH}/${MY_ORDER_DETAIL_PATH}`;
export const MY_REVIEW_ABSOLUTE_PATH = `${MY_PATH}/${MY_REVIEW_PATH}`;
export const MY_LIKE_ABSOLUTE_PATH = `${MY_PATH}/${MY_LIKE_PATH}`;
export const MY_STORE_ABSOLUTE_PATH = `${MY_PATH}/${MY_STORE_PATH}`;
export const MY_STORE_DETAIL_ABSOLUTE_PATH = (storeNumber: string | number) => `${MY_PATH}/${MY_STORE_PATH}/${MY_STORE_DETAIL_PATH(storeNumber)}`;

export const MY_PRODUCT_ABSOLUTE_PATH = `${MY_PATH}/${MY_PRODUCT_PATH}`;
export const MY_PRODUCT_ADD_ABSOLUTE_PATH = `${MY_PRODUCT_ABSOLUTE_PATH}/${MY_PRODUCT_ADD_PATH}`;
export const MY_PRODUCT_UPDATE_ABSOLUTE_PATH = `${MY_PRODUCT_ABSOLUTE_PATH}/${MY_PRODUCT_UPDATE_PATH}`;

export const MY_ORDER_MANAGE_ABSOLUTE_PATH = `${MY_PATH}/${MY_ORDER_MANAGE_PATH}`;
export const MY_SALES_ABSOLUTE_PATH = `${MY_PATH}/${MY_SALES_PATH}`;

// variable: HTTP BEARER TOKEN COOKIE NAME //
export const ACCESS_TOKEN = 'accessToken';