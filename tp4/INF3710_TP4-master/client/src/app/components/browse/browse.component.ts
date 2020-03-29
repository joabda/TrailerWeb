import { Component, OnInit } from '@angular/core';
import { BrowseService } from 'src/app/services/browse/browse.service';
import { Movie } from 'src/app/interfaces/movie';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TrailerComponent } from '../trailer/trailer.component';
import { TITLE } from 'src/app/classes/constants';
import { filter } from 'rxjs/operators';
import { StreamingpurchaseComponent } from '../streamingpurchase/streamingpurchase.component';
import { CreditCard } from 'src/app/interfaces/cc';

@Component({
    selector: "app-browse",
    templateUrl: "./browse.component.html",
    styleUrls: ["./browse.component.css"]
})
export class BrowseComponent implements OnInit {

  movies: Movie[];
  constructor(
    private snacks: MatSnackBar,
    private router: Router,
    private service: BrowseService,
    public data: DataService,
    public dialog: MatDialog
    ) { }

  async ngOnInit() {
    const result = await this.service.getMovies(); 
    if(result.valueOf() === false) {
      this.openSnack('Please Sign In First');
      this.router.navigate([""]);
    } else {
      this.data.setMovies(result as unknown as Movie[]);
      this.movies = result as unknown as Movie[];
    }
  }

  async onPlayClick(event: MatButton): Promise<void> {
    const movie = this.findMovie( 
      (event._elementRef.nativeElement as HTMLButtonElement)
        .getAttribute(TITLE) as unknown as string
    );
    if(movie !== undefined) {
      this.service.isOrdered(movie.id).subscribe( res => {
        if(res !== null && res.valueOf() === 1) {
          this.playMovie(movie);
        } else {
          this.orderMovie(movie);
        }
      })
    } else {
      this.openSnack('Sorry your movie couldn\'t be found');
    }
  }

  private orderMovie(movie: Movie): void {
    this.service.creditCards().subscribe( res => {
      if(res !== null) {
        const creditCards: CreditCard[] = res;
        const reference = this.dialog.open(StreamingpurchaseComponent, {
          data: {
            title : movie.title,
            cc    : creditCards
          },
          width: '100%',
          height: '800px'
        });
        reference.afterClosed().pipe(
          filter(stopTime => stopTime)
        ).subscribe(stopTime => {
          console.log(stopTime);
          if(stopTime.buy) {
            this.service.orderMovieStreaming({
              movieID     : movie.id,
              dateOfOrder : new Date()
            });
          }
        });
      } 
    });
  }

  private playMovie(movie: Movie): void {
    const reference = this.dialog.open(TrailerComponent, {
      data: {
        title : movie.title,
        id    : movie.url.slice(0, movie.url.indexOf('?')),
        start : Number(movie.url.slice(movie.url.indexOf('=') + 1))
      },
      width: '100%',
      height: '800px'
    });
    reference.afterClosed().pipe(
      filter(stopTime => stopTime)
    ).subscribe(stopTime => {
      const newURL = `${movie.url.slice(0, movie.url.indexOf('=') + 1)}${stopTime}`;
      this.service.changeCurrentTime(movie.id, stopTime);
      for(let element of this.movies) {
        if(movie.title === element.title) {
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
    for(const element of this.movies) {
      if(element.title === name) {
        return element
      }
    }
    return undefined;
  }
}
