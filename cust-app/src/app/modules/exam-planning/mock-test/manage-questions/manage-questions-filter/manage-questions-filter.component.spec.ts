import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuestionsFilterComponent } from './manage-questions-filter.component';

describe('ManageQuestionsFilterComponent', () => {
  let component: ManageQuestionsFilterComponent;
  let fixture: ComponentFixture<ManageQuestionsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageQuestionsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageQuestionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
