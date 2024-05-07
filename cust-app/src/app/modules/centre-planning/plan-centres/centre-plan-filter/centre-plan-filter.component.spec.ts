import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrePlanFilterComponent } from './centre-plan-filter.component';

describe('CentrePlanFilterComponent', () => {
  let component: CentrePlanFilterComponent;
  let fixture: ComponentFixture<CentrePlanFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentrePlanFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrePlanFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
