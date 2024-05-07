import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdmitCardViewComponent } from './manage-admit-card-view.component';

describe('ManageAdmitCardComponent', () => {
  let component: ManageAdmitCardViewComponent;
  let fixture: ComponentFixture<ManageAdmitCardViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdmitCardViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdmitCardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
