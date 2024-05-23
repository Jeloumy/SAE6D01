import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateProfileComponent } from './pages/create-profile/create-profile.component';
import { SearchComponent } from './pages/search/search.component';
import { MapComponent } from './pages/map/map.component';
import { HandicapFormComponent } from './pages/handicap-form/handicap-form.component';
import { FooterComponent } from './footer/footer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProfileSelectorDialogComponent } from './pages/profile-selector-dialog/profile-selector-dialog.component';
import { HandicapSelectorComponent } from './pages/handicap-selector/handicap-selector.component';
import { SystemPreferencesComponent } from './system-preferences/system-preferences.component';
import { HomeComponent } from './home/home.component';
import { SearchFormComponent } from './pages/search-form/search-form.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
