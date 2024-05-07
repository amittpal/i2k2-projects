import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSampleDataViewComponent } from './layout-sample-data-view.component';

describe('LayoutSampleDataViewComponent', () => {
  let component: LayoutSampleDataViewComponent;
  let fixture: ComponentFixture<LayoutSampleDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutSampleDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutSampleDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
