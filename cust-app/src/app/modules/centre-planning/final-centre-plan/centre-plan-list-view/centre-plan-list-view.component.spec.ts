import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrePlanListViewComponent } from './centre-plan-list-view.component';

describe('CentrePlanListViewComponent', () => {
  let component: CentrePlanListViewComponent;
  let fixture: ComponentFixture<CentrePlanListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentrePlanListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrePlanListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
