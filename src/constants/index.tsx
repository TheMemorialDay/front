// variable: 상대 경로 상수 //
export const ROOT_PATH = '/';

export const AUTH_PATH = '/auth';

export const ST_PATH = '/stores';
export const ST_ORDER_DETAIL_PATH = '1/order';
export const ST_INFORMATION_DETAIL_PATH = '1/information';
export const ST_CONTACT_DETAIL_PATH = '1/contact';
export const ST_REVIEW_DETAIL_PATH = '1/reivew';

export const HO_PATH = '/how';

export const SU_PATH = '/support/notice';
export const SU_NOTICE_DETAIL_PATH = `${SU_PATH}/detail`;
export const SU_QA_PATH = `${SU_PATH}/qa`;

export const JO_PATH = '/join';

export const OTHERS_PATH = '*';

export const LOGIN_PATH = '/auth';
export const SIGN_UP_PATH = `${LOGIN_PATH}/sign-up`;


// variable: 절대 경로 상수 //
export const ROOT_ABSOLUTE_PATH = ROOT_PATH;

export const AUTH_ABSOLUTE_PATH = AUTH_PATH;

export const ST_ABSOLUTE_PATH = ST_PATH;
export const ST_ABSOLUTE_ORDER_DETAIL_PATH = `${ST_PATH}/${ST_ORDER_DETAIL_PATH}`;
export const ST_ABSOLUTE_INFORMATION_DETAIL_PATH = `${ST_PATH}/${ST_INFORMATION_DETAIL_PATH}`;
export const ST_ABSOLUTE_CONTACT_DETAIL_PATH = `${ST_PATH}/${ST_CONTACT_DETAIL_PATH}`;
export const ST_ABSOLUTE_REVIEW_DETAIL_PATH = `${ST_PATH}/${ST_REVIEW_DETAIL_PATH}`;

export const HO_ABSOLUTE_PATH = HO_PATH;

export const SU_ABSOLUTE_PATH = SU_PATH;
export const SU_ABSOLUTE_QA_PATH = SU_QA_PATH;

export const JO_ABSOLUTE_PATH = JO_PATH;

export const SIGN_IN_ABSOLUTE_PATH = LOGIN_PATH;
export const SIGN_UP_ABSOLUTE_PATH = SIGN_UP_PATH;

// variable: HTTP BEARER TOKEN COOKIE NAME //
export const ACCESS_TOKEN = 'accessToken';