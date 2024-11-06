import OptionDetail from "./option-detail.interface";

export default interface Option {
    productOptionName: string;
    optionDetails: OptionDetail[];
}