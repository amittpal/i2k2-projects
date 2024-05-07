import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSampleDataComponent } from './layout-sample-data.component';

describe('LayoutSampleDataComponent', () => {
  let component: LayoutSampleDataComponent;
  let fixture: ComponentFixture<LayoutSampleDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutSampleDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutSampleDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
