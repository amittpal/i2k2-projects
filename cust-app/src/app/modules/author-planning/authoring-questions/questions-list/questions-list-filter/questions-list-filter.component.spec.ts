import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsListFilterComponent } from './questions-list-filter.component';

describe('QuestionsListFilterComponent', () => {
  let component: QuestionsListFilterComponent;
  let fixture: ComponentFixture<QuestionsListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
