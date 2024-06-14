import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CreateProfileComponent } from './pages/create-profile/create-profile.component';
import { SearchComponent } from './pages/search/search.component';
import { MapComponent } from './pages/map/map.component';
import { HandicapFormComponent } from './pages/handicap-form/handicap-form.component';
import { FooterComponent } from './footer/footer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HandicapSelectorComponent } from './pages/handicap-selector/handicap-selector.component';
import { SystemPreferencesComponent } from './system-preferences/system-preferences.component';
import { HomeComponent } from './home/home.component';
import { SearchFormComponent } from './pages/search-form/search-form.component';
import { GeolocationDialogComponent } from './pages/geolocation-dialog/geolocation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from './services/profile/profile.service';
import { GeolocationButtonComponent } from './pages/geolocation-button/geolocation-button.component';
import { ProfileSelectorComponent } from './pages/profile-selector/profile-selector.component';
import { ProfilePhotoComponent } from './pages/profile-photo/profile-photo.component';
import { ProfileSelectorDialogComponent } from './pages/profile-selector-dialog/profile-selector-dialog.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { SpeechService } from './services/speech/speech.service';

@NgModule({
  declarations: [
    AppComponent,
    CreateProfileComponent,
    SearchComponent,
    HandicapFormComponent,
    MapComponent,
    FooterComponent,
    ProfileSelectorDialogComponent,
    HandicapSelectorComponent,
    SystemPreferencesComponent,
    HomeComponent,
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
    SpeechService,
    ProfileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
