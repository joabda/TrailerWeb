import { Category } from "../enum/category";
import { Participant } from "./participant";
import { Oscar } from "./oscar";

export interface FormMovie {
    title           :   string          ,
    category        :   Category        ,
    productionDate  :   string          ,
    duration        :   number          ,
    dvdPrice        :   number          ,
    streamingFee    :   number          ,
    movieURL        :   string          ,
    imageURL        :   string          ,
    participants    :   Participant[]   ,
    honors          :   Oscar[]         ,
}