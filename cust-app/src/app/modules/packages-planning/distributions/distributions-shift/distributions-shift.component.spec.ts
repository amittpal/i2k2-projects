import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionsShiftComponent } from './distributions-shift.component';

describe('DistributionsShiftComponent', () => {
  let component: DistributionsShiftComponent;
  let fixture: ComponentFixture<DistributionsShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionsShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionsShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
