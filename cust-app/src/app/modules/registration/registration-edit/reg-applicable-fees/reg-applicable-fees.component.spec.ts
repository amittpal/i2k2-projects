import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegApplicableFeesComponent } from './reg-applicable-fees.component';

describe('RegApplicableFeesComponent', () => {
  let component: RegApplicableFeesComponent;
  let fixture: ComponentFixture<RegApplicableFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegApplicableFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegApplicableFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
