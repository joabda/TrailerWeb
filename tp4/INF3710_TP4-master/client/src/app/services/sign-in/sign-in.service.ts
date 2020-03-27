import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_URL } from 'src/app/classes/constants';
import { Logins } from 'src/app/interfaces/logins';
import * as moment from "moment";
import { Token } from 'src/app/enum/token';

@Injectable({
  providedIn: 'root'
})
export class SignInService{

  constructor(private http: HttpClient) { 
  }

  async login(toAuthenticate: Logins): Promise<any> {
    return this.http.post<any>(`${API_URL}users`, toAuthenticate)
      .toPromise()
      .then(
        result => this.setSession(result)
      )
      .catch((e: HttpErrorResponse) => {localStorage.setItem(Token.id, '')});
  }

  private setSession(authResult: any): void{
    const expiresAt = moment().add(authResult.expiresIn, 'minute');
    localStorage.setItem(Token.id, authResult.idToken);
    localStorage.setItem(Token.expiry, JSON.stringify(expiresAt.valueOf()) );
    localStorage.setItem(Token.admin, authResult.admin)
  }
}
