import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Movie } from 'src/app/interfaces/movie';
import { API_URL } from 'src/app/classes/constants';
import { Token } from 'src/app/enum/token';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ManageService {

  constructor(
    private http: HttpClient) { }

  async getMovies(): Promise<Movie[] | boolean> {
    return (
      this.http.get<Movie[]>(`${API_URL}movies`, { headers: new HttpHeaders().set('Authorization', localStorage.getItem(Token.id) as unknown as string) })
        .toPromise()
        .catch(() => false)
    );
  }

  deleteMovie(idMovie: number): void {
    this.http.put<any>(
      `${API_URL}movies/delete`, 
      {
        id          : idMovie,
      },
      { 
        headers: new HttpHeaders().set('Authorization', localStorage.getItem(Token.id) as unknown as string) 
      }
    );
  }

  addUser(toAdd: User): void {
    console.log('sending request');
    this.http.put<any>(
      `${API_URL}users/insert`, 
      toAdd,
      { 
        headers: new HttpHeaders().set('Authorization', localStorage.getItem(Token.id) as unknown as string) 
      }
    );
  }
}
