import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreMappingListFilterComponent } from './centre-mapping-list-filter.component';

describe('CentreMappingListFilterComponent', () => {
  let component: CentreMappingListFilterComponent;
  let fixture: ComponentFixture<CentreMappingListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreMappingListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreMappingListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
