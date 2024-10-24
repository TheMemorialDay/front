import { create } from "zustand";
import { OrderRejectReason } from "../types/orderreject.interface";

interface OrderReject {
  orderReject: OrderRejectReason | string;
  cancelReason: string;
  setOrderRejectStatus: (status: Partial<OrderReject>) => void; // 수정: Partial 사용
  setCancelReason: (status: string) => void;
}

const useOrderReject = create<OrderReject>(set => ({
  orderReject: '재료가 소진되었습니다.',
  cancelReason: '',
  setOrderRejectStatus: (state: Partial<OrderReject>) => set(() => state),
  setCancelReason: (reason: string) => set(() => ({ cancelReason: reason }))
}));

export default useOrderReject;
