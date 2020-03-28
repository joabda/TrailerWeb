import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/classes/constants';
import { Token } from 'src/app/enum/token';
import { Movie } from 'src/app/interfaces/movie';

@Injectable({
    providedIn: "root"
})
export class BrowseService {

    public constructor(
        private http: HttpClient) { }

    public async getMovies(): Promise<Movie[] | boolean> {
        return (
            this.http.get<Movie[]>(`${API_URL}movies`,
                { headers: new HttpHeaders().set("Authorization", localStorage.getItem(Token.id) as unknown as string) })
                .toPromise()
                .catch(() => false)
        );
    }
}
