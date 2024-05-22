import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProfileComponent } from '../app/pages/create-profile/create-profile.component';
import { SearchComponent } from './pages/search/search.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: CreateProfileComponent },
  { path: 'search', component: SearchComponent },
  // autres routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
