import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdmitCardViewListRowdetailComponent } from './manage-admit-card-view-list-rowdetail.component';

describe('ManageAdmitCardViewListRowdetailComponent', () => {
  let component: ManageAdmitCardViewListRowdetailComponent;
  let fixture: ComponentFixture<ManageAdmitCardViewListRowdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdmitCardViewListRowdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdmitCardViewListRowdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
