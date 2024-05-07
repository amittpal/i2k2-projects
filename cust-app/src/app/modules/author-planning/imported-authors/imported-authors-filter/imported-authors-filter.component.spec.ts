import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedAuthorsFilterComponent } from './imported-authors-filter.component';

describe('ImportedAuthorsFilterComponent', () => {
  let component: ImportedAuthorsFilterComponent;
  let fixture: ComponentFixture<ImportedAuthorsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportedAuthorsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedAuthorsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
