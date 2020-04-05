import { Component, OnInit, ViewChild } from '@angular/core';
import { Movie } from 'src/app/interfaces/movie';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/services/manage/manage.service';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';
import { HTTP } from 'src/app/enum/http-codes';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  addingUser: boolean;
  addingMovie: boolean;
  movies: Movie[];
  displayedColumns: string[] = ['title', 'genre', 'production date', 'duration', 'dvd price', 'streaming fee', 'delete'];
  dataSource: MatTableDataSource<Movie>;
  loading: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    protected snacks: MatSnackBar,
    protected router: Router,
    private service: ManageService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
    this.addingUser = false;
    this.addingMovie = false;
    this.loading = false;
  }

  ngOnInit(): void {
    this.service.getMovies().then( res => {
      if (res === HTTP.Unauthorized) {
        this.openSnack('Please Sign In First');
        this.router.navigate(['']);
      } else {
        this.movies = res as unknown as Movie[];
      }
      this.dataSource = new MatTableDataSource(this.movies);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteMovie(id: number, title: string): void {
    this.confirmationDialogService.confirm('Please confirm!', `Do you really want to delete ${title} ?`)
      .then(confirmation => {
        if (confirmation) {
          this.loading = true;
          this.service.deleteMovie(id)
          .toPromise()
          .then( res => {
            if(res === HTTP.Accepted) {
              this.openSnack('Movie has been deleted');
              for(let i: number = 0; i < this.movies.length; ++i) {
                if(this.movies[i].id === id){
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
