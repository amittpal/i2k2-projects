import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedCentresListComponent } from './imported-centres-list.component';

describe('ImportedCentresListComponent', () => {
  let component: ImportedCentresListComponent;
  let fixture: ComponentFixture<ImportedCentresListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportedCentresListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedCentresListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
