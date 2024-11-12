import ResponseDto from '../response.dto';
import { SalesResponse } from './get-sales-.response.dto';

export interface SalesListResponseDto extends ResponseDto {
    orders: SalesResponse[];
}
