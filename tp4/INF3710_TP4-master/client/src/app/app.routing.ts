import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BrowseComponent } from './components/browse/browse.component';

const routes: Routes = [
    { path: 'browse', component: BrowseComponent },
    { path: '*', component: HomeComponent }, // Home Page
    { path: '**', component: HomeComponent }, // Home Page
];

export const appRoutingModule = RouterModule.forRoot(routes);