import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CreateProfileComponent } from './pages/create-profile/create-profile.component';
import { SearchComponent } from './pages/search/search.component';
import { MapComponent } from './components/map/map.component';
import { HandicapFormComponent } from './components/handicap-form/handicap-form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HandicapSelectorComponent } from './components/handicap-selector/handicap-selector.component';
import { SystemPreferencesComponent } from './components/system-preferences/system-preferences.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { GeolocationDialogComponent } from './components/geolocation-dialog/geolocation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from './services/profile/profile.service';
import { GeolocationButtonComponent } from './components/geolocation-button/geolocation-button.component';
import { ProfileSelectorComponent } from './components/profile-selector/profile-selector.component';
import { ProfilePhotoComponent } from './components/profile-photo/profile-photo.component';
import { ProfileSelectorDialogComponent } from './components/profile-selector-dialog/profile-selector-dialog.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateProfileComponent,
    SearchComponent,
    HandicapFormComponent,
    MapComponent,
    ProfileSelectorDialogComponent,
    HandicapSelectorComponent,
    SystemPreferencesComponent,
    SearchFormComponent,
    GeolocationDialogComponent,
    GeolocationButtonComponent,
    ProfileSelectorComponent,
    ProfilePhotoComponent,
    EditProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [
    provideAnimationsAsync(),
    ProfileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
