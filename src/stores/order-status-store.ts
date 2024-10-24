import { create } from 'zustand';

// 주문 상태와 주문 진행 상황에 대한 타입 정의
type OrderMessage = 'readyAccept' | 'readyPay' | 'finishedPay' | 'finishedReview' | 'finishedOrder' | 'cancelOrder' | 'rejectOrder' | 'rejectOrderReason';
type OrderStatus = '승인 대기중' | '결제 대기중' | '결제 완료' | '리뷰 쓰기' | '완료' | '주문 취소' | '주문 거부' | '픽업 완료' | '리뷰작성 완료';

// Zustand 저장소 인터페이스 정의
interface OrderStore {
  orderMessage: OrderMessage;                // 현재 주문 상태
  orderStatus: OrderStatus;              // 현재 주문 진행 상황
  setOrderMessage: (state: OrderMessage) => void;   // 주문 상태 업데이트 함수
  setOrderStatus: (status: OrderStatus) => void; // 주문 진행 상황 업데이트 함수
}

// Zustand 저장소 생성
const useOrderStore = create<OrderStore>(set => ({
  orderMessage: 'readyAccept',           // 초기 주문 상태
  orderStatus: '승인 대기중',           // 초기 주문 진행 상황
  // 주문 상태를 업데이트하는 함수
  setOrderMessage: (state: OrderMessage) => set(() => ({ orderMessage: state })),
  // 주문 진행 상황을 업데이트하는 함수
  setOrderStatus: (status: OrderStatus) => set(() => ({ orderStatus: status })),
}));

export default useOrderStore;
