import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCentresFilterComponent } from './map-centres-filter.component';

describe('MapCentresFilterComponent', () => {
  let component: MapCentresFilterComponent;
  let fixture: ComponentFixture<MapCentresFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCentresFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCentresFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
