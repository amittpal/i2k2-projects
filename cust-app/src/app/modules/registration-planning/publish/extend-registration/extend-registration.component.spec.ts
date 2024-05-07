import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendRegistrationComponent } from './extend-registration.component';

describe('ExtendRegistrationComponent', () => {
  let component: ExtendRegistrationComponent;
  let fixture: ComponentFixture<ExtendRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
