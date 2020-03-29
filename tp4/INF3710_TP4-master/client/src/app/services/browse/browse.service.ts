import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Movie } from 'src/app/interfaces/movie';
import { API_URL } from 'src/app/classes/constants';
import { Token } from 'src/app/enum/token';
import { Observable } from 'rxjs';
import { CreditCard } from 'src/app/interfaces/cc';
import { OrderStreaming } from 'src/app/interfaces/order-streaming';

@Injectable({
  providedIn: 'root'
})
export class BrowseService {

  constructor(
    private http: HttpClient) { }

  async getMovies(): Promise<Movie[] | boolean> {
    return (
      this.http.get<Movie[]>(`${API_URL}movies`, {headers: new HttpHeaders().set('Authorization', localStorage.getItem(Token.id) as unknown as string)})
      .toPromise()
      .catch( () => false)
    );
  }

  isOrdered(id: number): Observable<number> {
    return (
      this.http.post<number>(`${API_URL}order/validation`, 
        {id: id},
        {
          headers: new HttpHeaders().set('Authorization', 
          localStorage.getItem(Token.id) as unknown as string)
        }
      )
    );
  }

  creditCards(): Observable<CreditCard[]> {
    return (
      this.http.get<CreditCard[]>(`${API_URL}creditcards`,
        {
          headers: new HttpHeaders().set('Authorization', 
          localStorage.getItem(Token.id) as unknown as string)
        }
      )
    );
  }

  changeCurrentTime(id: number, stoppedAt: number): void {
    this.http.put<Movie[]>(
      `${API_URL}movies/update`, 
      {
        id          : id,
        stoppedAt   : stoppedAt,
      },
      {
        headers: new HttpHeaders().set('Authorization', 
        localStorage.getItem(Token.id) as unknown as string)
      }
    )
    .toPromise()
    .catch( () => false)
  }

  orderMovieStreaming(order: OrderStreaming): void {
    this.http.post<OrderStreaming>(
      `${API_URL}order/insert`, 
      {
        movieID     : order.movieID,
        dateOfOrder : `
          ${order.dateOfOrder.getUTCFullYear()}-${(order.dateOfOrder.getUTCMonth() + 1) }-${String(order.dateOfOrder.getDate()).padStart(2, '0')}
        `
      },
      {
        headers: new HttpHeaders().set('Authorization', 
        localStorage.getItem(Token.id) as unknown as string)
      }
    )
    .toPromise()
    .catch( () => false )
  }
}
