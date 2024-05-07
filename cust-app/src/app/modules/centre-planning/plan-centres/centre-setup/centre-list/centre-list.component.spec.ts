import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreListComponent } from './centre-list.component';

describe('CentreListComponent', () => {
  let component: CentreListComponent;
  let fixture: ComponentFixture<CentreListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentreListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
