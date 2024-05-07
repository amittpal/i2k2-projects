import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCentersComponent } from './total-centers.component';

describe('TotalCentersComponent', () => {
  let component: TotalCentersComponent;
  let fixture: ComponentFixture<TotalCentersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalCentersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
