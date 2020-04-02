import { Injectable } from '@angular/core';
import { Movie } from 'src/app/interfaces/movie';
import { API_URL } from 'src/app/classes/constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Token } from 'src/app/enum/token';

@Injectable()
export class DataService {

    private movies: Movie[];

    constructor(
        private http: HttpClient
    ) {
    }

    async getMovies(): Promise<Movie[] | boolean> {
        return (
          this.http.get<Movie[]>(`${API_URL}movies`, { headers: new HttpHeaders().set('Authorization', localStorage.getItem(Token.id) as unknown as string) })
            .toPromise()
            .catch(() => false)
        );
      }

    setMovies(movies: Movie[]): void {
        this.movies = movies;
    }

    getTitles(): string[] {
        const titles: string[] = [];
        this.movies.forEach((movie) => titles.push(movie.title));

        return titles;
    }
}
