import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrueFalseApproveComponent } from './true-false-approve.component';

describe('TrueFalseApproveComponent', () => {
  let component: TrueFalseApproveComponent;
  let fixture: ComponentFixture<TrueFalseApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrueFalseApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrueFalseApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
