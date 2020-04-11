import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL, MAPS_API_KEY, POLYTECHNIQUE_POSTAL_CODE, PROXY } from "src/app/classes/constants";
import { Token } from "src/app/enum/token";
import { CreditCard } from "src/app/interfaces/cc";
import { Movie } from "src/app/interfaces/movie";
import { Nomination } from "src/app/interfaces/nomination";
import { OrderStreaming } from "src/app/interfaces/order-streaming";
import { Participant } from "src/app/interfaces/participant";
import { Participation } from "src/app/interfaces/participation";

@Injectable({
    providedIn: "root"
})
export class BrowseService {

    public constructor(
        private http: HttpClient) { }

    public async getMovies(): Promise<Movie[] | boolean> {
        return (
            this.http.get<Movie[]>(`${API_URL}movies`, { headers: new HttpHeaders().set("Authorization", localStorage.getItem(Token.id) as unknown as string) })
                .toPromise()
                .catch(() => false)
        );
    }

    public async getParticipants(): Promise<Participant[] | boolean> {
        return (
            this.http.get<Participant[]>(`${API_URL}participants`, { headers: new HttpHeaders().set("Authorization", localStorage.getItem(Token.id) as unknown as string) })
                .toPromise()
                .catch(() => false)
        );
    }

    public async getParticipations(): Promise<Participation[] | boolean> {
        return (
            this.http.get<Participation[]>(`${API_URL}participation`, { headers: new HttpHeaders().set("Authorization", localStorage.getItem(Token.id) as unknown as string) })
                .toPromise()
                .catch(() => false)
        );
    }

    public async getNominations(): Promise<Nomination[] | boolean> {
        return (
            this.http.get<Nomination[]>(`${API_URL}nominations`, { headers: new HttpHeaders().set("Authorization", localStorage.getItem(Token.id) as unknown as string) })
                .toPromise()
                .catch(() => false)
        );
    }

    public isOrdered(id: number, type: string): Observable<number> {
        return (
            this.http.post<any>(`${API_URL}order/${type}/validation`,
                                { id: id },
                                {
                    headers: new HttpHeaders().set("Authorization",
                                                   localStorage.getItem(Token.id) as unknown as string)
                }
            )
        );
    }

    public creditCards(): Observable<CreditCard[]> {
        return (
            this.http.get<CreditCard[]>(`${API_URL}creditcards`,
                                        {
                    headers: new HttpHeaders().set("Authorization",
                                                   localStorage.getItem(Token.id) as unknown as string)
                }
            )
        );
    }

    public changeCurrentTime(id: number, stoppedAt: number): void {
        this.http.put<Movie[]>(
            `${API_URL}order/update`,
            {
                id: id,
                stoppedAt: stoppedAt,
            },
            {
                headers: new HttpHeaders().set("Authorization",
                                               localStorage.getItem(Token.id) as unknown as string)
            }
        )
            .toPromise()
            .catch(() => false);
    }

    public async getDistance(): Promise<any> {
        const res = await this.getProstalCode();
        const postalCode = this.formatPostalCode(res.postalcode);

        return this.http.get<any>(`${PROXY}https://maps.googleapis.com/maps/api/distancematrix/json?key=${MAPS_API_KEY}&units=metric&origins=${POLYTECHNIQUE_POSTAL_CODE}&destinations=${postalCode}`
        )
            .toPromise();
    }

    private getProstalCode(): Promise<any> {
        return this.http.get<{ postalcode: string }>(`${API_URL}users/postalCode`,
                                                     {
                headers: new HttpHeaders().set("Authorization",
                                               localStorage.getItem(Token.id) as unknown as string)
            }
        )
            .toPromise();
    }

    public orderMovieStreaming(order: OrderStreaming): void {
        this.http.post<OrderStreaming>(
            `${API_URL}order/insert`,
            {
                movieID: order.movieID,
                dateOfOrder: `
          ${order.dateOfOrder.getUTCFullYear()}-${(order.dateOfOrder.getUTCMonth() + 1)}-${String(order.dateOfOrder.getDate()).padStart(2, "0")}
        `
            },
            {
                headers: new HttpHeaders().set("Authorization",
                                               localStorage.getItem(Token.id) as unknown as string)
            }
        )
            .toPromise()
            .catch(() => false);
    }

    public orderMovieDVD(movieID: number, dateOfOrder: Date): void {

    }

    private formatPostalCode(old: string): string {
        const space = old.indexOf(" ");
        let newString = old;
        if (space !== -1) {
            newString = old.slice(0, space) + old.slice(space + 1);
        }
        const dash = old.indexOf("-");
        if (dash !== -1) {
            newString = old.slice(0, dash) + old.slice(dash + 1);
        }
        const seperator = old.indexOf("/");
        if (dash !== -1) {
            newString = old.slice(0, seperator) + old.slice(seperator + 1);
        }

        return newString;
    }
}
