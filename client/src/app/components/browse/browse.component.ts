import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatInput } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { filter, map, startWith } from "rxjs/operators";
import { PRICE_PER_KM, TITLE } from "src/app/classes/constants";
import { HTTP } from "src/app/enum/http-codes";
import { OrderType } from "src/app/enum/order-type";
import { Token } from "src/app/enum/token";
import { CreditCard } from "src/app/interfaces/cc";
import { Movie } from "src/app/interfaces/movie";
import { BrowseService } from "src/app/services/browse/browse.service";
import { ConfirmationDialogService } from "src/app/services/confirmation-dialog/confirmation-dialog.service";
import { DataService } from "src/app/services/data/data.service";
import { HotkeyService } from "src/app/services/hotkeys/hotkey.service";
import { MovieDetailsComponent } from "../movie-details/movie-details.component";
import { OrderComponent } from "../order/order.component";
import { TrailerComponent } from "../trailer/trailer.component";

@Component({
    selector: "app-browse",
    templateUrl: "./browse.component.html",
    styleUrls: ["./browse.component.css"]
})
export class BrowseComponent implements OnInit, OnDestroy {

    public movies: Movie[];
    public searchedMovies: Movie[];

    public titleControl: FormControl = new FormControl();
    public categoryControl: FormControl = new FormControl();

    public filteredMovies: Observable<string[]>;
    public titles: string[];

    public title: string;
    public movie: Movie | undefined;
    private subscriptions: Subscription[] = [];
    public isLoading: boolean;
    @ViewChild(MatInput) private filter: MatInput;

    public constructor(
        protected snacks: MatSnackBar,
        protected router: Router,
        protected service: BrowseService,
        public data: DataService,
        public dialog: MatDialog,
        public shortcuts: HotkeyService,
        private confirmation: ConfirmationDialogService
    ) {
        this.isLoading = false;
    }

    public async ngOnInit(): Promise<void> {
        const result: boolean | Movie[] = await this.service.getMovies();
        if (result.valueOf() === false) {
            this.openSnack("Please Sign In First");
            this.router.navigate([""]);
        } else {
            this.data.setMovies(result as unknown as Movie[]);
            this.movies = result as unknown as Movie[];
            this.titles = this.data.getTitles();
            this.filteredMovies = this.titleControl.valueChanges
                .pipe(
                    startWith(""),
                    map((state) => state ? this._filterStates(state) : this.titles.slice())
                );
            this.searchedMovies = this.movies;
            this.subscriptions.push(this.shortcuts.addShortcut({ keys: "escape", description: "Logging out" }).subscribe((event) => {
                localStorage.setItem(Token.id, "");
                this.router.navigate([""]);
            }));
        }
        this.subscriptions.push(this.shortcuts.addShortcut({ keys: "control.f", description: "Filter movies" }).subscribe((_event) => {
            this.filter.focus();
        }));
    }

    public ngOnDestroy(): void {
        for (let i: number = this.subscriptions.length - 1; i >= 0; --i) {
            this.subscriptions[i].unsubscribe();
            this.subscriptions.pop();
        }
    }

    private _filterStates(value: string): string[] {
        const filterValue: string = value.toLowerCase();
        this.title = filterValue;

        return this.titles.filter((title) => title.toLowerCase().indexOf(filterValue) === 0);
    }

    public async onClickStream(event: MatButton): Promise<void> {
        const movie: Movie | undefined = this.findMovie(
            (event._elementRef.nativeElement as HTMLButtonElement)
                .getAttribute(TITLE) as unknown as string
        );
        if (movie !== undefined) {
            this.service.isOrdered(movie.id, "streaming").subscribe(async (res) => {
                if (res !== null && res.valueOf() !== HTTP.Error) {
                    this.playMovie(movie, (res as any).stoppedat, (res as any).idorder);
                } else {
                    this.orderMovie(movie, OrderType.Streaming);
                }
            });
        } else {
            this.openSnack("Sorry your movie couldn't be found");
        }
    }

    public async onClickBuy(event: MatButton): Promise<void> {
        const movie: Movie | undefined = this.findMovie(
            (event._elementRef.nativeElement as HTMLButtonElement)
                .getAttribute(TITLE) as unknown as string
        );
        if (movie !== undefined) {
            this.service.isOrdered(movie.id, "dvd").subscribe((res) => {
                if (res !== null && res.valueOf() !== HTTP.Error) {
                    this.confirmation.confirm("You already ordered this movie as DVD", `Are you sure you want to order it again?`)
                        .then((confirmation) => {
                            if (confirmation) {
                                this.orderMovie(movie, OrderType.DVD);
                            }
                        });
                } else {
                    this.orderMovie(movie, OrderType.DVD);
                }
            });
        } else {
            this.openSnack("Sorry your movie couldn't be found");
        }
    }

    private orderMovie(movie: Movie, type: OrderType): void {
        this.service.creditCards().subscribe(async (res) => {
            if (res !== null) {
                this.isLoading = true;
                const distance = await this.service.getDistance();
                this.isLoading = false;
                if (distance.rows[0].elements[0].status !== "OK") {
                    this.openSnack("Couldn't find route to your location sorry.");
                } else {
                    const result: string = distance.rows[0].elements[0].distance.text;
                    const shipping: number = parseFloat(result.substr(0, result.indexOf(" "))) * PRICE_PER_KM;
                    const reference = this.openOrderDialog(movie.title, res, type ? movie.streamingFee : movie.dvdPrice, type ? 0 : shipping);
                    reference.afterClosed().pipe(
                        filter((stopTime) => stopTime)
                    ).subscribe((stopTime) => {
                        if (stopTime.buy) {
                            if (type === OrderType.Streaming) {
                                this.service.orderMovieStreaming({
                                    movieID: movie.id,
                                    dateOfOrder: new Date()
                                });
                            } else {
                                this.service.orderMovieDVD(movie.id, new Date(), shipping);
                            }
                        }
                    });
                }
            }
        });
    }

    private openOrderDialog(title: string, ccs: CreditCard[], price: number, shipping: number = 0): MatDialogRef<OrderComponent> {
        return this.dialog.open(OrderComponent, {
            data: {
                title: title,
                cc: ccs,
                price: price,
                shipping: shipping
            }
        });
    }

    private playMovie(movie: Movie, currentTime: number, idorder: number): void {
        const reference: MatDialogRef<TrailerComponent> = this.dialog.open(TrailerComponent, {
            data: {
                title: movie.title,
                id: movie.url.slice(0, movie.url.indexOf("?")),
                start: currentTime
            },
            width: "100%",
            height: "800px"
        });
        reference.afterClosed().pipe(
            filter((stopTime) => stopTime)
        ).subscribe((stopTime) => {
            const newURL: string = `${movie.url.slice(0, movie.url.indexOf("=") + 1)}${stopTime}`;
            this.service.changeCurrentTime(idorder, stopTime);
            for (const element of this.movies) {
                if (movie.title === element.title) {
                    element.url = newURL;
                }
            }
        });
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

    private findMovie(name: string): Movie | undefined {
        for (const element of this.movies) {
            if (element.title === name) {
                return element;
            }
        }

        return undefined;
    }

    private filteTitles(element: string): boolean {
        return element.toLowerCase().startsWith(this.title);
    }

    public searchMovie(): void {
        if (!this.titleControl.value || this.titleControl.value.length === 0) {
            this.searchedMovies = this.movies;
            this.titleControl.setValue("");
            this.title = "";

            return;
        }
        const searchTitles: string[] = this.titles.filter((element) => this.filteTitles(element));
        this.searchedMovies = new Array();
        for (const title of searchTitles) {
            this.searchedMovies.push(this.movies.find((movie) => movie.title === title) as Movie);
        }
    }

    public displayInfos(movie: Movie): void {
        this.dialog.open(MovieDetailsComponent, {
            data: movie,
            width: "50%",
            height: "800px",
            autoFocus: false
        });
    }
}
