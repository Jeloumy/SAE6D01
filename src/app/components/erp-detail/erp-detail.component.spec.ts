import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpDetailComponent } from './erp-detail.component';

describe('ErpDetailComponent', () => {
  let component: ErpDetailComponent;
  let fixture: ComponentFixture<ErpDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErpDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErpDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
