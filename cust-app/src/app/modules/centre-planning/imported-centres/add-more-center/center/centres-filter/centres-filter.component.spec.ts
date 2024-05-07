import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreCentresFilterComponent } from './centres-filter.component';

describe('AddMoreCentresFilterComponent', () => {
  let component: AddMoreCentresFilterComponent;
  let fixture: ComponentFixture<AddMoreCentresFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoreCentresFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreCentresFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
