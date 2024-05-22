import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaPremierePageComponent } from './ma-premiere-page.component';

describe('MaPremierePageComponent', () => {
  let component: MaPremierePageComponent;
  let fixture: ComponentFixture<MaPremierePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaPremierePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaPremierePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
