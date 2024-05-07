import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuestionRowDetailsComponent } from './manage-question-row-details.component';

describe('ManageQuestionRowDetailsComponent', () => {
  let component: ManageQuestionRowDetailsComponent;
  let fixture: ComponentFixture<ManageQuestionRowDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageQuestionRowDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageQuestionRowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
