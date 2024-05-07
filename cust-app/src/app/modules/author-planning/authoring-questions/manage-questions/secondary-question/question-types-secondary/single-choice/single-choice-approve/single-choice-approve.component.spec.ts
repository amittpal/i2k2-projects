import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoiceApproveComponent } from './single-choice-approve.component';

describe('SingleChoiceApproveComponent', () => {
  let component: SingleChoiceApproveComponent;
  let fixture: ComponentFixture<SingleChoiceApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleChoiceApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleChoiceApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
