import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillBlankApproveComponent } from './fill-blank-approve.component';

describe('FillBlankApproveComponent', () => {
  let component: FillBlankApproveComponent;
  let fixture: ComponentFixture<FillBlankApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillBlankApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillBlankApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
