import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { ALL_CATEGORIES } from "src/app/classes/constants";
import { Category } from "src/app/enum/category";
import { Movie } from "src/app/interfaces/movie";
import { BrowseService } from "src/app/services/browse/browse.service";
import { DataService } from "src/app/services/data/data.service";
import { BrowseComponent } from "../browse/browse.component";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.css"]
})
export class SearchComponent extends BrowseComponent {

    public filteredMovies: Observable<string[]>;
    public titles: string[];
    public categories: Category[];

    titleControl = new FormControl();
    categoryControl = new FormControl();

    public title: string;
    public movie: Movie | undefined;

    public constructor(protected snacks: MatSnackBar,
                       protected router: Router,
                       protected browserService: BrowseService,
                       public dataService: DataService,
                       public dialog: MatDialog) {
        super(snacks, router, browserService, dataService, dialog);
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
        console.log(this.title);
        this.movie = this.movies.find((movie) => movie.title.toLowerCase() === this.title );
        console.log(this.movie);
        if (!this.movie) {
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
