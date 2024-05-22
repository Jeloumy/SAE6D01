import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSelectorDialogComponent } from './profile-selector-dialog.component';

describe('ProfileSelectorDialogComponent', () => {
  let component: ProfileSelectorDialogComponent;
  let fixture: ComponentFixture<ProfileSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileSelectorDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
