import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPreviewFilterComponent } from './layout-preview-filter.component';

describe('LayoutPreviewFilterComponent', () => {
  let component: LayoutPreviewFilterComponent;
  let fixture: ComponentFixture<LayoutPreviewFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutPreviewFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutPreviewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
