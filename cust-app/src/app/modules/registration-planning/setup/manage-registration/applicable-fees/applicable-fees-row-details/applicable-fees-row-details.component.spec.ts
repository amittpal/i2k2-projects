import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicableFeesRowDetailsComponent } from './applicable-fees-row-details.component';

describe('ApplicableFeesRowDetailsComponent', () => {
  let component: ApplicableFeesRowDetailsComponent;
  let fixture: ComponentFixture<ApplicableFeesRowDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicableFeesRowDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicableFeesRowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
