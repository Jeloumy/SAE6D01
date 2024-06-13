import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProfileComponent } from '../app/pages/create-profile/create-profile.component';
import { SearchComponent } from './pages/search/search.component';
import { HomeComponent } from './home/home.component';
import { ProfileGuard } from './guards/auth/profile.guard'; // Importez votre guard

const routes: Routes = [
  { path: 'profile', component: CreateProfileComponent },
  { path: '', component: SearchComponent, canActivate: [ProfileGuard] },
  // autres routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
