import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { concat, Observable } from "rxjs";
import { API_URL } from "src/app/classes/constants";
import { HTTP } from "src/app/enum/http-codes";
import { Token } from "src/app/enum/token";
import { Logins } from "src/app/interfaces/logins";

@Injectable({
    providedIn: "root"
})
export class SignInService {

    public constructor(private http: HttpClient) {
    }

    public async login(toAuthenticate: Logins): Promise<void> {
        return this.http.post<HTTP>(`${API_URL}users`, toAuthenticate)
            .toPromise()
            .then(
                (result) => {
                    if (result !== HTTP.Unauthorized) {
                        this.setSession(result);
                    }
                }
            )
            .catch((e: HttpErrorResponse) => { localStorage.setItem(Token.id, ""); });
    }

    public async loginAdmin(toAuthenticate: Logins): Promise<void> {
        return this.http.post<HTTP>(`${API_URL}admins`, toAuthenticate)
            .toPromise()
            .then(
                (result) => {
                    if (result !== HTTP.Unauthorized) {
                        this.setSession(result);
                    }
                }
            )
            .catch((e: HttpErrorResponse) => { localStorage.setItem(Token.id, ""); });
    }

    private setSession(authResult: any): void {
        const expiresAt: moment.Moment = moment().add(authResult.expiresIn, "minute");
        localStorage.setItem(Token.id, authResult.idToken);
        localStorage.setItem(Token.expiry, JSON.stringify(expiresAt.valueOf()));
        localStorage.setItem(Token.admin, authResult.admin);
    }

    public createAndPopulateDB(): Observable<HTTP> {
        return concat(this.http.post<HTTP>(`${API_URL}createSchema`, []),
                      this.http.post<HTTP>(`${API_URL}populateDb`, []));
    }
}
