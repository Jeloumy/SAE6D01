import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProfileComponent } from '../app/pages/create-profile/create-profile.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  { path: 'create-profile', component: CreateProfileComponent },
  { path: 'search', component: SearchComponent },
  // autres routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
