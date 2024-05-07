import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedCentresViewComponent } from './imported-centres-view.component';

describe('ImportedCentresViewComponent', () => {
  let component: ImportedCentresViewComponent;
  let fixture: ComponentFixture<ImportedCentresViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportedCentresViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedCentresViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
