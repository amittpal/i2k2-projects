import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegTypesRowEditComponent } from './reg-types-row-edit.component';

describe('RegTypesRowEditComponent', () => {
  let component: RegTypesRowEditComponent;
  let fixture: ComponentFixture<RegTypesRowEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegTypesRowEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegTypesRowEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
