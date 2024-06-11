import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HandicapSelectorComponent } from './handicap-selector.component';

describe('HandicapSelectorComponent', () => {
  let component: HandicapSelectorComponent;
  let fixture: ComponentFixture<HandicapSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HandicapSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandicapSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
