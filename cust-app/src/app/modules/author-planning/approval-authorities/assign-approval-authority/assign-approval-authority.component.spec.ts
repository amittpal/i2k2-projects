import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignApprovalAuthorityComponent } from './assign-approval-authority.component';

describe('AssignApprovalAuthorityComponent', () => {
  let component: AssignApprovalAuthorityComponent;
  let fixture: ComponentFixture<AssignApprovalAuthorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignApprovalAuthorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignApprovalAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
