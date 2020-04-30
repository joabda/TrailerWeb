import { NominationCategory } from "../enum/nomination-category";

export interface Oscar {
    date:   string;
    location:   string;
    host:   string;
    winner:   boolean;
    category:   NominationCategory;
}
