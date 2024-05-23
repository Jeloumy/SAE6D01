import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { VoiceControlComponent } from './voice-control/voice-control.component';

@NgModule({
  declarations: [
    AppComponent,
    VoiceControlComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
