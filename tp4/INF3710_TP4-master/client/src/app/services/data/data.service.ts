import { Injectable } from "@angular/core";
import { Movie } from "src/app/interfaces/movie";

@Injectable()
export class DataService {

    private movies: Movie[];

    public constructor() { }

    public setMovies(movies: Movie[]): void {
        this.movies = movies;
    }

    public getTitles(): string[] {
        const titles: string[] = [];
        this.movies.forEach((movie) => titles.push(movie.title));

        return titles;
    }
}
