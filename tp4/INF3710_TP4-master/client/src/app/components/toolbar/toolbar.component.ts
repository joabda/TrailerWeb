import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from 'src/app/enum/token';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  constructor(
    private snacks: MatSnackBar,
    private router: Router
    ) { }

  goHome(): void {
    this.router.navigate(['browse']);
  }

  logout(): void {
    localStorage.setItem(Token.id, '');
    this.router.navigate(['']);
    this.snacks.open(
      'See you tomorrow!', 
      '', 
      {
        duration: 3000,
        verticalPosition: 'top'
      }
    );
  }
}
