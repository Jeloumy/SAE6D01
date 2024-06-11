import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProfileComponent } from './pages/profile/create-profile.component';
import { SearchComponent } from './pages/search/search.component';
import { HomeComponent } from './pages/home/home.component';
import { ErpDetailComponent } from './components/erp-detail/erp-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: CreateProfileComponent },
  { path: 'search', component: SearchComponent },
  { path: 'erp/:slug', component: ErpDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
