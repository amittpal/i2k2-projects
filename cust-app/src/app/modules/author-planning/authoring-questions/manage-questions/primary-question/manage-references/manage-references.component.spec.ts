import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReferencesComponent } from './manage-references.component';

describe('ManageReferencesComponent', () => {
  let component: ManageReferencesComponent;
  let fixture: ComponentFixture<ManageReferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageReferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
