// interface: patch order status reqeust dto ///
export default interface PatchOrderStatusReqeustDto {
  orderCode: string;
  orderStatus: string;
  cancelCode?: string;
  cancelReason?: string;
}