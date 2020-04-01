import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BrowseComponent } from './components/browse/browse.component';
import { SearchComponent } from './components/search/search.component';
import { ManageComponent } from './components/manage/manage.component';

const routes: Routes = [
    { path: 'browse', component: BrowseComponent    },
    { path: 'manage', component: ManageComponent    },
    { path: 'search', component: SearchComponent    }, 
    { path: '*'     , component: HomeComponent      }, // Home Page
    { path: '**'    , component: HomeComponent      }, // Home Page
];

export const appRoutingModule = RouterModule.forRoot(routes);