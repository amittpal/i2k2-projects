import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAdmitCardViewListComponent } from './manage-admit-card-view-list.component';

describe('ManageAdmitCardViewListComponent', () => {
  let component: ManageAdmitCardViewListComponent;
  let fixture: ComponentFixture<ManageAdmitCardViewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAdmitCardViewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdmitCardViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
