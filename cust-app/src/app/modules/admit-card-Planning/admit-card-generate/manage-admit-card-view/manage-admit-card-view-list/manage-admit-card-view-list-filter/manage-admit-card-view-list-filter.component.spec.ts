import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdmitCardViewListFilterComponent } from './manage-admit-card-view-list-filter.component';

describe('ManageAdmitCardViewListFilterComponent', () => {
  let component: ManageAdmitCardViewListFilterComponent;
  let fixture: ComponentFixture<ManageAdmitCardViewListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdmitCardViewListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdmitCardViewListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
