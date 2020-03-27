import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data/data.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  filteredMovies: Observable<string[]>;
  titleControl = new FormControl();
  titles: string[];

  constructor(public data: DataService) { 
    this.titles = data.getTitles();
    this.filteredMovies = this.titleControl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.titles.slice())
      );
  }
  private _filterStates(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.titles.filter(title => title.toLowerCase().indexOf(filterValue) === 0);
  }
}
