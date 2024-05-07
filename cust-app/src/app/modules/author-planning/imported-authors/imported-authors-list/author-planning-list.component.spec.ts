import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorPlanningListComponent } from './author-planning-list.component';

describe('AuthorPlanningListComponent', () => {
  let component: AuthorPlanningListComponent;
  let fixture: ComponentFixture<AuthorPlanningListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorPlanningListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorPlanningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
