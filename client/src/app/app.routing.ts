import { RouterModule, Routes } from "@angular/router";
import { BrowseComponent } from "./components/browse/browse.component";
import { HomeComponent } from "./components/home/home.component";
import { ManageComponent } from "./components/manage/manage.component";

const routes: Routes = [
    { path: "browse", component: BrowseComponent    },
    { path: "manage", component: ManageComponent    },
    { path: "*"     , component: HomeComponent      }, // Home Page
    { path: "**"    , component: HomeComponent      }, // Home Page
];

export const appRoutingModule = RouterModule.forRoot(routes);
