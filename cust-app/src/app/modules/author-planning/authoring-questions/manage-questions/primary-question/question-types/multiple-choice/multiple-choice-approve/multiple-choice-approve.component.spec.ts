import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceApproveComponent } from './multiple-choice-approve.component';

describe('MultipleChoiceApproveComponent', () => {
  let component: MultipleChoiceApproveComponent;
  let fixture: ComponentFixture<MultipleChoiceApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleChoiceApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
