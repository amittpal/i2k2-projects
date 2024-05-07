import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoringStatusComponent } from './authoring-status.component';

describe('AuthoringStatusComponent', () => {
  let component: AuthoringStatusComponent;
  let fixture: ComponentFixture<AuthoringStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthoringStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthoringStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
