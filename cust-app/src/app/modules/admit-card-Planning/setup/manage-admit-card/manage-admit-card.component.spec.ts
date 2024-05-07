import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdmitCardComponent } from './manage-admit-card.component';

describe('ManageAdmitCardComponent', () => {
  let component: ManageAdmitCardComponent;
  let fixture: ComponentFixture<ManageAdmitCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdmitCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdmitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
