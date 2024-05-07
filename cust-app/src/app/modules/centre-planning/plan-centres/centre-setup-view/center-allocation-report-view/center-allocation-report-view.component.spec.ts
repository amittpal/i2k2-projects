import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterAllocationReportViewComponent } from './center-allocation-report-view.component';

describe('CenterAllocationReportViewComponent', () => {
  let component: CenterAllocationReportViewComponent;
  let fixture: ComponentFixture<CenterAllocationReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterAllocationReportViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterAllocationReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
