import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTypesViewComponent } from './job-types-view.component';

describe('JobTypesViewComponent', () => {
  let component: JobTypesViewComponent;
  let fixture: ComponentFixture<JobTypesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTypesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTypesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
