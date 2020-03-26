import { Component } from '@angular/core';
import { SignInService } from 'src/app/services/sign-in/sign-in.service';
import { Router } from '@angular/router';
import { Token } from 'src/app/enum/token';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  username: string;
  password: string;

  constructor(
    private router: Router,
    private service: SignInService,
    private snacks: MatSnackBar,
    ) {
  }

  async onSubmit(): Promise<void> {
    await this.service.login({username: this.username, password: this.password});
    if(localStorage.getItem(Token.id) !== '') {
      this.router.navigate(['browse']);
    } else {
      this.snacks.open(
        'Wrong username or password.', 
        '', 
        {
          duration: 3000,
          verticalPosition: 'top'
        }
      );
    }
  }

}
