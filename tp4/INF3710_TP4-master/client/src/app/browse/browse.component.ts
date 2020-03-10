import { Component } from '@angular/core';
import { Movie } from '../classes/movie';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent {

  movies: Array<Movie>;

  constructor() {
    this.movies = new Array<Movie>();
  }
  
}
