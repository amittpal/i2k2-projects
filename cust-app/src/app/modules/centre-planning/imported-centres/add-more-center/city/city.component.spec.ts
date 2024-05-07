import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreCityComponent } from './city.component';

describe('AddMoreCityComponent', () => {
  let component: AddMoreCityComponent;
  let fixture: ComponentFixture<AddMoreCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoreCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
