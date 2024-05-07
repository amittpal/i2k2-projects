import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutListFilterComponent } from './layout-list-filter.component';

describe('LayoutListFilterComponent', () => {
  let component: LayoutListFilterComponent;
  let fixture: ComponentFixture<LayoutListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
