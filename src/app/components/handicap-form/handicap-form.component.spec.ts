import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HandicapFormComponent } from './handicap-form.component';

describe('HandicapFormComponent', () => {
  let component: HandicapFormComponent;
  let fixture: ComponentFixture<HandicapFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HandicapFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandicapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
