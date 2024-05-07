import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishExamListComponent } from './publish-exam-list.component';

describe('PublishExamListComponent', () => {
  let component: PublishExamListComponent;
  let fixture: ComponentFixture<PublishExamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishExamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
