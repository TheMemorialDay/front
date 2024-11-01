import ResponseDto from "../response.dto";

export default interface GetStoreNumber extends ResponseDto{
    storeNumber: string | number;
}