import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMappingAddFilterComponent } from './layout-mapping-add-filter.component';

describe('LayoutMappingAddFilterComponent', () => {
  let component: LayoutMappingAddFilterComponent;
  let fixture: ComponentFixture<LayoutMappingAddFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutMappingAddFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutMappingAddFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
