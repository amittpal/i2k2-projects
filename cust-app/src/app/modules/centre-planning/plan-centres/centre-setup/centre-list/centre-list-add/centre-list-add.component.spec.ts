import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreListAddComponent } from './centre-list-add.component';

describe('CentreListAddComponent', () => {
  let component: CentreListAddComponent;
  let fixture: ComponentFixture<CentreListAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreListAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreListAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
