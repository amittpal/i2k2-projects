import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoiceManageComponent } from './single-choice-manage.component';

describe('SingleChoiceManageComponent', () => {
  let component: SingleChoiceManageComponent;
  let fixture: ComponentFixture<SingleChoiceManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleChoiceManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleChoiceManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
