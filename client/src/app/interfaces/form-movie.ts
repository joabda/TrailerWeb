import { Category } from "../enum/category";
import { Oscar } from "./oscar";
import { Participant } from "./participant";

export interface FormMovie {
    title:   string          ;
    category:   Category        ;
    productionDate:   string          ;
    duration:   number          ;
    dvdPrice:   number          ;
    streamingFee:   number          ;
    movieURL:   string          ;
    imageURL:   string          ;
    participants:   Participant[]   ;
    honors:   Oscar[]         ;
}
