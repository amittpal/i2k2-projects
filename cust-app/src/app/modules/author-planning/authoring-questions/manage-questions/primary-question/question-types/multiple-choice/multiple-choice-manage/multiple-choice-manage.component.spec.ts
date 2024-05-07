import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceManageComponent } from './multiple-choice-manage.component';

describe('MultipleChoiceManageComponent', () => {
  let component: MultipleChoiceManageComponent;
  let fixture: ComponentFixture<MultipleChoiceManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleChoiceManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
