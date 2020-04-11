import { Role } from "../enum/role";

export interface Participation {
    movieId: number;
    participantId: number;
    role: Role;
    salary: number;
}
