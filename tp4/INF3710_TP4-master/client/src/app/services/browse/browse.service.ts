import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "src/app/classes/constants";
import { Token } from "src/app/enum/token";
import { CreditCard } from "src/app/interfaces/cc";
import { Movie } from "src/app/interfaces/movie";
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
            this.http.get<Participant[]>(`${API_URL}participant`, { headers: new HttpHeaders().set("Authorization", localStorage.getItem(Token.id) as unknown as string) })
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

    public isOrdered(id: number): Observable<number> {
        return (
            this.http.post<any>(`${API_URL}order/validation`,
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
        console.log(id);
        console.log(stoppedAt);
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
}
