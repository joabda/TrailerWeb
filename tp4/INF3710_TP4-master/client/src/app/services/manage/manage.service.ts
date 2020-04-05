import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from 'src/app/classes/constants';
import { Token } from 'src/app/enum/token';
import { User } from 'src/app/interfaces/user';
import { Movie } from 'src/app/interfaces/movie';
import { Observable } from 'rxjs';
import { Participant } from 'src/app/interfaces/participant';
import { Oscar } from 'src/app/interfaces/oscar';
import { Actor } from 'src/app/interfaces/actor';

@Injectable({
  providedIn: 'root'
})
export class ManageService {

  constructor(
    private http: HttpClient) { }

  async getMovies(): Promise<Movie[] | number> {
    return (
      this.http.get<Movie[]>(`${API_URL}movies`, { headers: new HttpHeaders().set('Authorization', localStorage.getItem(Token.id) as unknown as string) })
        .toPromise()
        .catch(res => res)
    );
  }

  async getActors(): Promise<Actor[] | boolean> {
    return (
      this.http.get<Actor[]>(`${API_URL}actors`, { headers: new HttpHeaders().set('Authorization', localStorage.getItem(Token.id) as unknown as string) })
        .toPromise()
    );
  }

  deleteMovie(idMovie: number): Observable<any> {
    return this.http.put<any>(
      `${API_URL}movies/delete`,
      {
        id: idMovie,
      },
      {
        headers: new HttpHeaders().set('Authorization', localStorage.getItem(Token.id) as unknown as string)
      }
    );
  }

  addMovie(
    title: string,
    category: string,
    productionDate: string,
    duration: number,
    dvdPrice: number,
    streamingFee: number,
    movieURL: string,
    imageURL: string,
  ): Observable<any> {
    return (
      this.http.post<any>(`${API_URL}movies/insert`,
        {
          title: title,
          category: category,
          productionDate: productionDate,
          duration: duration,
          dvdPrice: dvdPrice,
          streamingFee: streamingFee,
          movieURL: movieURL,
          imageURL: imageURL
        },
        {
          headers: new HttpHeaders().set('Authorization',
            localStorage.getItem(Token.id) as unknown as string)
        }
      )
    );
  }

  addParticipant(toAdd: Participant, movieID: number): Observable<any> {
    return (
      this.http.post<any>(`${API_URL}participants/insert`,
        {
          name: toAdd.name,
          dateOfbirth: toAdd.dateOfbirth,
          nationality: toAdd.nationality,
          sex: toAdd.sex,
          role: toAdd.role,
          salary: toAdd.salary,
          movieID: movieID
        },
        {
          headers: new HttpHeaders().set('Authorization',
            localStorage.getItem(Token.id) as unknown as string)
        }
      )
    );
  }

  addParticipation(participantID: number, role: string, salary: number, movieID: number): Observable<any> {
    return (
      this.http.post<any>(`${API_URL}participation/insert`,
        {
          participantID: participantID,
          role: role,
          salary: salary,
          movieID: movieID
        },
        {
          headers: new HttpHeaders().set('Authorization',
            localStorage.getItem(Token.id) as unknown as string)
        }
      )
    );
  }

  addCeremony(toAdd: Oscar, movieID: number): Observable<any> {
    return (
      this.http.post<any>(`${API_URL}ceremony/insert`,
        {
          date: toAdd.date,
          location: toAdd.location,
          host: toAdd.host,
          winner: toAdd.winner,
          category: toAdd.category,
          movieID: movieID
        },
        {
          headers: new HttpHeaders().set('Authorization',
            localStorage.getItem(Token.id) as unknown as string)
        }
      )
    );
  }

  addUser(toAdd: User): Observable<any> {
    return (
      this.http.post<any>(`${API_URL}users/insert`,
        toAdd,
        {
          headers: new HttpHeaders().set('Authorization',
            localStorage.getItem(Token.id) as unknown as string)
        }
      )
    );
  }
}
