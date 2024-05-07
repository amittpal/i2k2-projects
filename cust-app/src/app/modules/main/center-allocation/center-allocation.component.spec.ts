import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterAllocationComponent } from './center-allocation.component';

describe('CenterAllocationComponent', () => {
  let component: CenterAllocationComponent;
  let fixture: ComponentFixture<CenterAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
