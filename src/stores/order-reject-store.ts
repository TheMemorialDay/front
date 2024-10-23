import { create } from "zustand";
import { OrderRejectReason } from "../types";

interface OrderReject {
  orderReject: OrderRejectReason | string;
  otherReason: string;
  setOrderRejectStatus: (status: Partial<OrderReject>) => void; // 수정: Partial 사용
  setOtherReason: (status: string) => void;
}

const useOrderReject = create<OrderReject>(set => ({
  orderReject: '재료가 소진되었습니다.',
  otherReason: '',
  setOrderRejectStatus: (state: Partial<OrderReject>) => set(() => state),
  setOtherReason: (reason: string) => set(() => ({ otherReason: reason }))
}));

export default useOrderReject;
