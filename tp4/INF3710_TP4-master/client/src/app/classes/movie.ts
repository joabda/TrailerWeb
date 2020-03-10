import { Category } from "./category";

export interface Movie {
    title: string;
    category: Category;
    productionDate: Date;
    watched?: number;
}