import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {

  constructor(private profileService: ProfileService, private router: Router) {}

  canActivate(): boolean {
    const currentProfile = this.profileService.getCurrentProfile();
    if (!currentProfile) {
      this.router.navigate(['/create-profile']); // Redirige vers la page de création de profil
      return false;
    }
    return true;
  }
}
