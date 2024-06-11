import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { SearchComponent } from './pages/search/search.component';
import { MapComponent } from './components/map/map.component';
import { HandicapFormComponent } from './components/handicap-form/handicap-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProfileSelectorDialogComponent } from './components/profile-selector-dialog/profile-selector-dialog.component';
import { HandicapSelectorComponent } from './components/handicap-selector/handicap-selector.component';
import { SystemPreferencesComponent } from './components/system-preferences/system-preferences.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { GeolocationDialogComponent } from './components/geolocation-dialog/geolocation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from './services/profile/profile.service';
import { ListComponent } from './pages/list/list.component';

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
    ListComponent,
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
