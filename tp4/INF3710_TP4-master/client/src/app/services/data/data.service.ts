import { Injectable } from '@angular/core';
import { Movie } from 'src/app/interfaces/movie';

@Injectable()
export class DataService {

    private movies: Movie[];

    constructor() { }

    setMovies(movies: Movie[]): void {
        this.movies = movies;
    }

    getTitles(): string[] {
        const titles: string[] = [];
        this.movies.forEach((movie) => titles.push(movie.title));

        return titles;
    }
}
