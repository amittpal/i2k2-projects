import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedCentresFilterComponent } from './imported-centres-filter.component';

describe('ImportedCentresFilterComponent', () => {
  let component: ImportedCentresFilterComponent;
  let fixture: ComponentFixture<ImportedCentresFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportedCentresFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedCentresFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
