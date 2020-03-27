import { Category } from "../enum/category";

export interface Movie {
    id:                 number;
    title:              string;
    category:           Category;
    productionDate:     string;
    duration:           number;
    dvdPrice:           number;
    streamingFee:       number;
}
