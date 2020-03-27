import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { appRoutingModule } from './app.routing';
import { BrowseComponent } from "./components/browse/browse.component";
import { JwtModule } from '@auth0/angular-jwt';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { SearchComponent } from './components/search/search.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from "./services/data/data.service";
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    BrowseComponent,
    ToolbarComponent,
    SearchComponent,
  ],
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatGridListModule,
    MatMenuModule,
    BrowserModule, 
    BrowserAnimationsModule, 
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    appRoutingModule,
    MatDialogModule,
    NgbModalModule,
    MatSnackBarModule,
    MatCardModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
             return     localStorage.getItem('access_token');},
        whitelistedDomains: ['localhost:3000'],                       // Public API
        blacklistedRoutes: ['http://localhost:3000/auth/login']       // SECURED ROUTES
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule { }
