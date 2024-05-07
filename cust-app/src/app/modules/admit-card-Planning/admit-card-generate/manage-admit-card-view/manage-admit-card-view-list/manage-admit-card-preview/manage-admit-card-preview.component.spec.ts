import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdmitCardPreviewComponent } from './manage-admit-card-preview.component';

describe('ManageAdmitCardPreviewComponent', () => {
  let component: ManageAdmitCardPreviewComponent;
  let fixture: ComponentFixture<ManageAdmitCardPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdmitCardPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdmitCardPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
