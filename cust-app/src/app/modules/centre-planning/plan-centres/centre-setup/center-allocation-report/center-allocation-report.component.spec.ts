import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterAllocationReportComponent } from './center-allocation-report.component';

describe('CenterAllocationReportComponent', () => {
  let component: CenterAllocationReportComponent;
  let fixture: ComponentFixture<CenterAllocationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterAllocationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterAllocationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
