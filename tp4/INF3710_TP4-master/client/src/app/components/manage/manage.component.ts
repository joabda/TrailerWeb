import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Movie } from 'src/app/interfaces/movie';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ManageService } from 'src/app/services/manage/manage.service';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog/confirmation-dialog.service';
import { HTTP } from 'src/app/enum/http-codes';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, AfterViewInit {

  addingUser: boolean;
  addingMovie: boolean;
  movies: Movie[];
  displayedColumns: string[] = ['title', 'genre', 'production date', 'duration', 'dvd price', 'streaming fee', 'delete'];
  dataSource = new MatTableDataSource();
  loading: boolean;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
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

  async ngOnInit(): Promise<void> {
    const result = await this.service.getMovies();
    if (result.valueOf() === false) {
      this.openSnack('Please Sign In First');
      this.router.navigate([""]);
    } else {
      this.movies = result as unknown as Movie[];
    }
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
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
