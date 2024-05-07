import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrePlanListComponent } from './centre-plan-list.component';

describe('CentrePlanListComponent', () => {
  let component: CentrePlanListComponent;
  let fixture: ComponentFixture<CentrePlanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentrePlanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrePlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
