import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocationDialogComponent } from './geolocation-dialog.component';

describe('GeolocationDialogComponent', () => {
  let component: GeolocationDialogComponent;
  let fixture: ComponentFixture<GeolocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeolocationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GeolocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
