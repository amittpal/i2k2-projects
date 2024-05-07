import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrueFalseManageComponent } from './true-false-manage.component';

describe('TrueFalseManageComponent', () => {
  let component: TrueFalseManageComponent;
  let fixture: ComponentFixture<TrueFalseManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrueFalseManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrueFalseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
