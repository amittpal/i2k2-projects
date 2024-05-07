import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionsFilterComponent } from './distributions-filter.component';

describe('DistributionsFilterComponent', () => {
  let component: DistributionsFilterComponent;
  let fixture: ComponentFixture<DistributionsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
