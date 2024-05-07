import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedCentresViewDetailsComponent } from './imported-centres-view-details.component';

describe('ImportedCentresViewDetailsComponent', () => {
  let component: ImportedCentresViewDetailsComponent;
  let fixture: ComponentFixture<ImportedCentresViewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportedCentresViewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedCentresViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
