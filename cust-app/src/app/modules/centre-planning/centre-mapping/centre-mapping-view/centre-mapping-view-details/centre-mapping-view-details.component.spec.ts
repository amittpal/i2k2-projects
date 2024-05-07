import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreMappingViewDetailsComponent } from './centre-mapping-view-details.component';

describe('CentreMappingViewDetailsComponent', () => {
  let component: CentreMappingViewDetailsComponent;
  let fixture: ComponentFixture<CentreMappingViewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreMappingViewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreMappingViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
