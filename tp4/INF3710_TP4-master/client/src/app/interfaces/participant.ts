import { Role } from "../enum/role";

export interface Participant {
    name        :   string  ,
    dateOfbirth :   string  ,
    nationality :   string  ,
    sex         :   string  ,
    role        :   Role    ,
    salary      :   number
}