import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegTypesComponent } from './reg-types.component';

describe('RegTypesComponent', () => {
  let component: RegTypesComponent;
  let fixture: ComponentFixture<RegTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
