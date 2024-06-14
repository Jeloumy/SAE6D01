import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProfileComponent } from '../app/pages/create-profile/create-profile.component';
import { SearchComponent } from './pages/search/search.component';
import { ProfileGuard } from './guards/auth/profile.guard';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';

const routes: Routes = [
  { path: 'create-profile', component: CreateProfileComponent },
  { path: '', component: SearchComponent, canActivate: [ProfileGuard] },
  { path: 'edit-profile/:id', component: EditProfileComponent, canActivate: [ProfileGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
