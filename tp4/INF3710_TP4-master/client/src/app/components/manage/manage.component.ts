import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Movie } from 'src/app/interfaces/movie';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/services/manage/manage.service';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';
import { HTTP } from 'src/app/enum/http-codes';
import { MatPaginator } from '@angular/material/paginator';
import { HotkeyService } from 'src/app/services/hotkeys/hotkey.service';
import { Subscription } from 'rxjs';
import { Token } from 'src/app/enum/token';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

  addingUser: boolean;
  addingMovie: boolean;
  movies: Movie[];
  displayedColumns: string[] = ['title', 'genre', 'production date', 'duration', 'dvd price', 'streaming fee', 'delete'];
  dataSource: MatTableDataSource<Movie>;
  loading: boolean;
  private subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;
  @ViewChild(MatTable) private table: MatTable<any>;
  @ViewChild(MatInput) private filter: MatInput;

  constructor(
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

  ngOnInit(): void {
    this.service.getMovies().then(res => {
      if (res === HTTP.Unauthorized) {
        this.openSnack('Please Sign In First');
        this.router.navigate(['']);
      } else {
        this.movies = res as unknown as Movie[];
      }
      this.dataSource = new MatTableDataSource(this.movies);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'control.m', description: 'Add a movie' }).subscribe((event) => {
        this.addingMovie = true;
        this.addingUser = false;
      }));
      this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'control.u', description: 'Add a user' }).subscribe((event) => {
        this.addingMovie = false;
        this.addingUser = true;
      }));
      this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'control.h', description: 'Going Home' }).subscribe((event) => {
        this.addingMovie = false;
        this.addingUser = false;
      }));
      this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'escape', description: 'Logging out' }).subscribe((event) => {
        localStorage.setItem(Token.id, '');
        this.router.navigate(['']);
      }));
      this.subscriptions.push(this.shortcuts.addShortcut({ keys: '+', description: 'Show more movies' }).subscribe((event) => {
        this.paginator._changePageSize(this.paginator.pageSize < 15 ? this.paginator.pageSize + 5 : this.paginator.pageSize);
      }));
      this.subscriptions.push(this.shortcuts.addShortcut({ keys: '-', description: 'Show less movies' }).subscribe((event) => {
        this.paginator._changePageSize(this.paginator.pageSize > 5 ? this.paginator.pageSize - 5 : this.paginator.pageSize);
      }));
      this.subscriptions.push(this.shortcuts.addShortcut({ keys: 'control.f', description: 'Filter movies' }).subscribe((event) => {
        this.filter.focus();
      }));
    });
  }

  ngOnDestroy(): void {
    for (let i: number = this.subscriptions.length - 1; i >= 0; --i) {
      this.subscriptions[i].unsubscribe();
      this.subscriptions.pop();
    }
  }

  deleteMovie(id: number, title: string): void {
    this.confirmationDialogService.confirm('Please confirm!', `Do you really want to delete ${title} ?`)
      .then(confirmation => {
        if (confirmation) {
          this.loading = true;
          this.service.deleteMovie(id)
            .toPromise()
            .then(res => {
              if (res === HTTP.Accepted) {
                this.openSnack('Movie has been deleted');
                for (let i: number = 0; i < this.movies.length; ++i) {
                  if (this.movies[i].id === id) {
                    this.movies.splice(i, 1);
                    this.table.renderRows();
                    this.loading = false;
                    break;
                  }
                }
              } else {
                this.openSnack('Couldn\'t delete movie from Database, please try again later.');
                this.loading = false;
              }
            });
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
}
