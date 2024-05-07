import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreCityFilterComponent } from './city-filter.component';

describe('AddMoreCityFilterComponent', () => {
  let component: AddMoreCityFilterComponent;
  let fixture: ComponentFixture<AddMoreCityFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoreCityFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreCityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
