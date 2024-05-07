import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutMappingViewComponent } from './layout-mapping-view.component';

describe('LayoutMappingViewComponent', () => {
  let component: LayoutMappingViewComponent;
  let fixture: ComponentFixture<LayoutMappingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutMappingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutMappingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
