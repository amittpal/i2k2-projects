import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCentresComponent } from './map-centres.component';

describe('MapCentresComponent', () => {
  let component: MapCentresComponent;
  let fixture: ComponentFixture<MapCentresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCentresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCentresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
