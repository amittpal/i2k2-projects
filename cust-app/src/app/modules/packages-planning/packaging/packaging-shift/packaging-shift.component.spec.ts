import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingShiftComponent } from './packaging-shift.component';

describe('PackagingShiftComponent', () => {
  let component: PackagingShiftComponent;
  let fixture: ComponentFixture<PackagingShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagingShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
