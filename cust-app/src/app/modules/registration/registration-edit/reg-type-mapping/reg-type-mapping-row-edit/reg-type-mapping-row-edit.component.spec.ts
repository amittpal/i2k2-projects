import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegTypeMappingRowEditComponent } from './reg-type-mapping-row-edit.component';

describe('RegTypeMappingRowEditComponent', () => {
  let component: RegTypeMappingRowEditComponent;
  let fixture: ComponentFixture<RegTypeMappingRowEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegTypeMappingRowEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegTypeMappingRowEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
