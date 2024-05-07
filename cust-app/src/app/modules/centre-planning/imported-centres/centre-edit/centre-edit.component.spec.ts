import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreEditComponent } from './centre-edit.component';

describe('CentreEditComponent', () => {
  let component: CentreEditComponent;
  let fixture: ComponentFixture<CentreEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
