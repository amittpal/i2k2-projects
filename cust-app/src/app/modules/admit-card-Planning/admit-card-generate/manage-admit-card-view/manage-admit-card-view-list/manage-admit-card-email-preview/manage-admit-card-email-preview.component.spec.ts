import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdmitCardEmailPreviewComponent } from './manage-admit-card-email-preview.component';

describe('ManageAdmitCardEmailPreviewComponent', () => {
  let component: ManageAdmitCardEmailPreviewComponent;
  let fixture: ComponentFixture<ManageAdmitCardEmailPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdmitCardEmailPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdmitCardEmailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
