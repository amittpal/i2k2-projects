import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishExamListFilterComponent } from './publish-exam-list-filter.component';

describe('PublishExamListFilterComponent', () => {
  let component: PublishExamListFilterComponent;
  let fixture: ComponentFixture<PublishExamListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishExamListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishExamListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
