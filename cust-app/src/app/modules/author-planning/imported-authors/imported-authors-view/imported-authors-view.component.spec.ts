import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedAuthorsViewComponent } from './imported-authors-view.component';

describe('ImportedAuthorsViewComponent', () => {
  let component: ImportedAuthorsViewComponent;
  let fixture: ComponentFixture<ImportedAuthorsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportedAuthorsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedAuthorsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
