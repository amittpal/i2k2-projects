import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCentreComponent } from './import-centre.component';

describe('ImportCentreComponent', () => {
  let component: ImportCentreComponent;
  let fixture: ComponentFixture<ImportCentreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportCentreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
