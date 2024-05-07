import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreListFilterComponent } from './centre-list-filter.component';

describe('CentreListFilterComponent', () => {
  let component: CentreListFilterComponent;
  let fixture: ComponentFixture<CentreListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
