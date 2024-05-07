import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishRegistrationComponent } from './publish-registration.component';

describe('PublishRegistrationComponent', () => {
  let component: PublishRegistrationComponent;
  let fixture: ComponentFixture<PublishRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
