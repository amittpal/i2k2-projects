import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreEditRowdetailsComponent } from './centre-edit-rowdetails.component';

describe('CentreEditRowdetailsComponent', () => {
  let component: CentreEditRowdetailsComponent;
  let fixture: ComponentFixture<CentreEditRowdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreEditRowdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreEditRowdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
