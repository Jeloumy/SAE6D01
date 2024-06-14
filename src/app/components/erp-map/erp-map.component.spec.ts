import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpMapComponent } from './erp-map.component';

describe('ErpMapComponent', () => {
  let component: ErpMapComponent;
  let fixture: ComponentFixture<ErpMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErpMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErpMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
