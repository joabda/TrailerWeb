import { Component, OnInit } from '@angular/core';
import { BrowseService } from 'src/app/services/browse/browse.service';
import { Movie } from 'src/app/interfaces/movie';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TrailerComponent } from '../trailer/trailer.component';
import { TITLE } from 'src/app/classes/constants';
import { filter } from 'rxjs/operators';
import { OrderComponent } from '../order/order.component';
import { CreditCard } from 'src/app/interfaces/cc';
import { OrderType } from 'src/app/enum/order-type';

@Component({
    selector: "app-browse",
    templateUrl: "./browse.component.html",
    styleUrls: ["./browse.component.css"]
})
export class BrowseComponent implements OnInit {

    movies: Movie[];
    constructor(
        protected snacks: MatSnackBar,
        protected router: Router,
        protected service: BrowseService,
        public data: DataService,
        public dialog: MatDialog
    ) { }

    async ngOnInit() {
        const result = await this.service.getMovies();
        if (result.valueOf() === false) {
            this.openSnack('Please Sign In First');
            this.router.navigate([""]);
        } else {
            this.data.setMovies(result as unknown as Movie[]);
            this.movies = result as unknown as Movie[];
        }
    }

    async onClick(event: MatButton, type: OrderType): Promise<void> {
        const movie = this.findMovie(
            (event._elementRef.nativeElement as HTMLButtonElement)
                .getAttribute(TITLE) as unknown as string
        );
        if (movie !== undefined) {
            this.service.isOrdered(movie.id).subscribe(async res => {
                if (res !== null && res.valueOf() != -1) {
                    console.log(res);
                    console.log((res as any).stoppedat);
                    // const currentTime = await this.service.getStopTime(movie.id, );
                    this.playMovie(movie, (res as any).stoppedat, (res as any).idorder);
                } else {
                    this.orderMovie(movie, type);
                }
            });
        } else {
            this.openSnack('Sorry your movie couldn\'t be found');
        }
    }

    private orderMovie(movie: Movie, type: OrderType): void {
        this.service.creditCards().subscribe(res => {
            if (res !== null) {
                const reference = this.openOrderDialog(movie.title, res);
                reference.afterClosed().pipe(
                    filter(stopTime => stopTime)
                ).subscribe(stopTime => {
                    if (stopTime.buy) {
                        if(type === OrderType.Streaming) {
                            this.service.orderMovieStreaming({
                                movieID: movie.id,
                                dateOfOrder: new Date()
                            });
                        } else {
                            this.service.orderMovieDVD( movie.id, new Date());
                        }
                    }
                });
            }
        });
    }

    private openOrderDialog(title: string, ccs: CreditCard[]): MatDialogRef<OrderComponent> {
        return this.dialog.open(OrderComponent, {
            data: {
                title: title,
                cc: ccs
            },
            // width: '100%',
            // height: '800px'
        });
    }

    private playMovie(movie: Movie, currentTime: number, idorder: number): void {
        const reference = this.dialog.open(TrailerComponent, {
            data: {
                title: movie.title,
                id: movie.url.slice(0, movie.url.indexOf('?')),
                start: currentTime
            },
            width: '100%',
            height: '800px'
        });
        reference.afterClosed().pipe(
            filter(stopTime => stopTime)
        ).subscribe(stopTime => {
            const newURL = `${movie.url.slice(0, movie.url.indexOf('=') + 1)}${stopTime}`;
            this.service.changeCurrentTime(idorder, stopTime);
            for (let element of this.movies) {
                if (movie.title === element.title) {
                    element.url = newURL;
                }
            }
        });
    }

    private openSnack(message: string) {
        this.snacks.open(
            message,
            "",
            {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center'
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
}
