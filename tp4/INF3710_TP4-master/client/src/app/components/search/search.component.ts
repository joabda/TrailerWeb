import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ALL_CATEGORIES } from 'src/app/classes/constants';
import { Category } from 'src/app/enum/category';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  filteredMovies: Observable<string[]>;
  titles: string[];
  categories: Category[];

  titleControl = new FormControl();
  categoryControl = new FormControl();


  constructor(public data: DataService) { 
    this.titles = data.getTitles();
    this.categories = ALL_CATEGORIES;
    console.log(this.categories);
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
