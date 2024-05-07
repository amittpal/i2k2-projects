import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreListEditComponent } from './centre-list-edit.component';

describe('CentreListEditComponent', () => {
  let component: CentreListEditComponent;
  let fixture: ComponentFixture<CentreListEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreListEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreListEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
