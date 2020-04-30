import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Token } from "src/app/enum/token";
import { SignInService } from "src/app/services/sign-in/sign-in.service";

@Component({
    selector: "app-sign-in",
    templateUrl: "./sign-in.component.html",
    styleUrls: ["./sign-in.component.css"]
})
export class SignInComponent {

    public username: string;
    public password: string;
    public admin: boolean;

    public constructor(
        private router: Router,
        private service: SignInService,
        private snacks: MatSnackBar,
    ) {
        localStorage.setItem(Token.id, "");
        this.username = "";
        this.password = "";
        this.admin = false;
    }

    public async onSubmit(): Promise<void> {
        if (this.admin) {
            await this.service.loginAdmin({ username: this.username, password: this.password });
        } else {
            await this.service.login({ username: this.username, password: this.password });
        }
        if (localStorage.getItem(Token.id) !== "") {
            if (this.admin) {
                this.router.navigate(["manage"]);
            } else {
                this.router.navigate(["browse"]);
            }
        } else {
            this.snacks.open(
                "Wrong username or password.",
                "",
                {
                    duration: 3000,
                    verticalPosition: "top"
                }
            );
        }
    }

    // public creatAndPopulateDB(): void { // Observable<any> {
    //     this.service.createAndPopulateDB().subscribe((res: any) => {
    //         console.log(res);
    //     });
    // }
}
