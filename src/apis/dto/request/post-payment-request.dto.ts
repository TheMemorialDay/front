// interface: post payment request body dto //
export default interface PostPayMentRequestDto {
  orderCode: string;
  userId: string;
  success: boolean | undefined;
  paidAmount: number | undefined;
}