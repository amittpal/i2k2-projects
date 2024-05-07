import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentresFilterComponent } from './centres-filter.component';

describe('CentresFilterComponent', () => {
  let component: CentresFilterComponent;
  let fixture: ComponentFixture<CentresFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentresFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentresFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
