import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpListComponent } from './erp-list.component';

describe('ErpListComponent', () => {
  let component: ErpListComponent;
  let fixture: ComponentFixture<ErpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErpListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
