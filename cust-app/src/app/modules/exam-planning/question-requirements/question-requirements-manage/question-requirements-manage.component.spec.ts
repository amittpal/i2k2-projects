import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionRequirementsManageComponent } from './question-requirements-manage.component';

describe('QuestionRequirementsManageComponent', () => {
  let component: QuestionRequirementsManageComponent;
  let fixture: ComponentFixture<QuestionRequirementsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionRequirementsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionRequirementsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
