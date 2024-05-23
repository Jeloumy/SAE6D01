import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceControlComponent } from './voice-control.component';

describe('VoiceControlComponent', () => {
  let component: VoiceControlComponent;
  let fixture: ComponentFixture<VoiceControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoiceControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoiceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
