import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatInput } from "@angular/material/input";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { HTTP } from "src/app/enum/http-codes";
import { Token } from "src/app/enum/token";
import { Movie } from "src/app/interfaces/movie";
import { ConfirmationDialogService } from "src/app/services/confirmation-dialog/confirmation-dialog.service";
import { HotkeyService } from "src/app/services/hotkeys/hotkey.service";
import { ManageService } from "src/app/services/manage/manage.service";

@Component({
    selector: "app-manage",
    templateUrl: "./manage.component.html",
    styleUrls: ["./manage.component.scss"]
})
export class ManageComponent implements OnInit, OnDestroy {

    public addingUser: boolean;
    public addingMovie: boolean;
    public movies: Movie[];
    public displayedColumns: string[] = ["title", "genre", "production date", "duration", "dvd price", "streaming fee", "delete"];
    public dataSource: MatTableDataSource<Movie>;
    public loading: boolean;
    private subscriptions: Subscription[] = [];
    @ViewChild(MatPaginator) private paginator: MatPaginator;
    @ViewChild(MatSort) private sort: MatSort;
    @ViewChild(MatTable) private table: MatTable<any>;
    @ViewChild(MatInput) private filter: MatInput;

    public constructor(
        protected snacks: MatSnackBar,
        protected router: Router,
        private service: ManageService,
        private confirmationDialogService: ConfirmationDialogService,
        private shortcuts: HotkeyService
    ) {
        this.addingUser = false;
        this.addingMovie = false;
        this.loading = false;
    }

    public ngOnInit(): void {
        this.service.getMovies().then((res) => {
            if (res === HTTP.Unauthorized) {
                this.openSnack("Please Sign In First");
                this.router.navigate([""]);
            } else {
                this.movies = res as unknown as Movie[];
            }
            this.dataSource = new MatTableDataSource(this.movies);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.addMovieShortcut();
            this.addUserShortcut();
            this.goHomeShortcut();
            this.logoutShortcut();
            this.showMoreMoviesShortcut();
            this.showLessMoviesShortcut();
            this.filterMoviesShortcut();
        });
    }

    public ngOnDestroy(): void {
        for (let i: number = this.subscriptions.length - 1; i >= 0; --i) {
          this.subscriptions[i].unsubscribe();
          this.subscriptions.pop();
        }
    }

    private addMovieShortcut(): void {
        this.subscriptions.push(this.shortcuts.addShortcut({ keys: "control.m", description: "Add a movie" }).subscribe((_event) => {
            this.addingMovie = true;
            this.addingUser = false;
        }));
    }

    private addUserShortcut(): void {
        this.subscriptions.push(this.shortcuts.addShortcut({ keys: "control.u", description: "Add a user" }).subscribe((_event) => {
            this.addingMovie = false;
            this.addingUser = true;
        }));
    }

    private goHomeShortcut(): void {
        this.subscriptions.push(this.shortcuts.addShortcut({ keys: "control.h", description: "Going Home" }).subscribe((_event) => {
            this.addingMovie = false;
            this.addingUser = false;
        }));
    }

    private logoutShortcut(): void {
        this.subscriptions.push(this.shortcuts.addShortcut({ keys: "escape", description: "Logging out" }).subscribe((_event) => {
            localStorage.setItem(Token.id, "");
            this.router.navigate([""]);
        }));
    }

    private showMoreMoviesShortcut(): void {
        this.subscriptions.push(this.shortcuts.addShortcut({ keys: "+", description: "Show more movies" }).subscribe((_event) => {
            this.paginator._changePageSize(this.paginator.pageSize < 15 ? this.paginator.pageSize + 5 : this.paginator.pageSize);
        }));
    }

    private showLessMoviesShortcut(): void {
        this.subscriptions.push(this.shortcuts.addShortcut({ keys: "-", description: "Show less movies" }).subscribe((_event) => {
            this.paginator._changePageSize(this.paginator.pageSize > 5 ? this.paginator.pageSize - 5 : this.paginator.pageSize);
        }));
    }

    private filterMoviesShortcut(): void {
        this.subscriptions.push(this.shortcuts.addShortcut({ keys: "control.s", description: "Filter movies" }).subscribe((_event) => {
            this.filter.focus();
        }));
    }

    public deleteMovie(id: number, title: string): void {
        this.confirmationDialogService.confirm("Please confirm!", `Do you really want to delete ${title} ?`)
            .then((confirmation) => {
                if (confirmation) {
                    this.loading = true;
                    this.service.deleteMovie(id)
                        .toPromise()
                        .then((res) => {
                            if (res === HTTP.Accepted) {
                                this.openSnack("Movie has been deleted");
                                for (let i: number = 0; i < this.movies.length; ++i) {
                                    if (this.movies[i].id === id) {
                                        this.movies.splice(i, 1);
                                        this.table.renderRows();
                                        this.loading = false;
                                        break;
                                    }
                                }
                            } else {
                                this.openSnack("Couldn't delete movie from Database, please try again later.");
                                this.loading = false;
                            }
                        });
                }
            });
    }

    public applyFilter(event: Event): void {
        const filterValue: string = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    private openSnack(message: string): void {
        this.snacks.open(
            message,
            "",
            {
                duration: 3000,
                verticalPosition: "top",
                horizontalPosition: "center"
            }
        );
    }
}
