import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCentresDetailsComponent } from './map-centres-details.component';

describe('MapCentresDetailsComponent', () => {
  let component: MapCentresDetailsComponent;
  let fixture: ComponentFixture<MapCentresDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCentresDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCentresDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
