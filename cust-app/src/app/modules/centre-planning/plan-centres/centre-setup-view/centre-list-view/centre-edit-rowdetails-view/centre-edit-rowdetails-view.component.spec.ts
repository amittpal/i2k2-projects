import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreEditRowdetailsViewComponent } from './centre-edit-rowdetails-view.component';

describe('CentreEditRowdetailsViewComponent', () => {
  let component: CentreEditRowdetailsViewComponent;
  let fixture: ComponentFixture<CentreEditRowdetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreEditRowdetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreEditRowdetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
