import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchApproveComponent } from './match-approve.component';

describe('MatchApproveComponent', () => {
  let component: MatchApproveComponent;
  let fixture: ComponentFixture<MatchApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
