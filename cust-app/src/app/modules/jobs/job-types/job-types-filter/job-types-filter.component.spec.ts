import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTypesFilterComponent } from './job-types-filter.component';

describe('JobTypesFilterComponent', () => {
  let component: JobTypesFilterComponent;
  let fixture: ComponentFixture<JobTypesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTypesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTypesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
