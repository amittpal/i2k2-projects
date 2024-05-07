import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreMappingViewComponent } from './centre-mapping-view.component';

describe('CentreMappingViewComponent', () => {
  let component: CentreMappingViewComponent;
  let fixture: ComponentFixture<CentreMappingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreMappingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreMappingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
