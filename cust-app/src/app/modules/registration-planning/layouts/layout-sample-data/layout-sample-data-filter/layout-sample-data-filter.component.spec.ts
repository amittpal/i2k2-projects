import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSampleDataFilterComponent } from './layout-sample-data-filter.component';

describe('LayoutSampleDataFilterComponent', () => {
  let component: LayoutSampleDataFilterComponent;
  let fixture: ComponentFixture<LayoutSampleDataFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutSampleDataFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutSampleDataFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
