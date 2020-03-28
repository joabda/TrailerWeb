import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { ALL_CATEGORIES } from "src/app/classes/constants";
import { Category } from "src/app/enum/category";
import { Movie } from "src/app/interfaces/movie";
import { DataService } from "src/app/services/data/data.service";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.css"]
})
export class SearchComponent {

    public filteredMovies: Observable<string[]>;
    public titles: string[];
    public categories: Category[];

    titleControl = new FormControl();
    categoryControl = new FormControl();

    public title: string;
    public movie: Movie | undefined;
    public movies: Movie[];
    public movieFound: boolean;

    public constructor(public dataService: DataService,
                       public snacks: MatSnackBar,
                       /*private searcheService: SearchService*/) {
        this.movieFound = false;
        this.movies = dataService.getMovies();
        this.titles = dataService.getTitles();
        this.categories = ALL_CATEGORIES;
        this.filteredMovies = this.titleControl.valueChanges
            .pipe(
                startWith(""),
                map((state) => state ? this._filterStates(state) : this.titles.slice())
            );
    }

    private _filterStates(value: string): string[] {
        const filterValue = value.toLowerCase();
        this.title = filterValue;

        return this.titles.filter((title) => title.toLowerCase().indexOf(filterValue) === 0);
    }

    public getMovie(): void {
        this.movie = this.movies.find((movie) => movie.title = this.title);
        this.movieFound = this.movie ? true : false;
        if (!this.movieFound) {
            this.snacks.open(
                "No movie found.",
                "",
                {
                  duration: 3000,
                }
            );
        }
    }
}
