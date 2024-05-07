import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMappingListFilterComponent } from './layout-mapping-list-filter.component';

describe('LayoutMappingListFilterComponent', () => {
  let component: LayoutMappingListFilterComponent;
  let fixture: ComponentFixture<LayoutMappingListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutMappingListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutMappingListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
