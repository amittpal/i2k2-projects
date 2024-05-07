import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTypesAddComponent } from './job-types-add.component';

describe('JobTypesAddComponent', () => {
  let component: JobTypesAddComponent;
  let fixture: ComponentFixture<JobTypesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTypesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTypesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
