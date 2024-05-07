import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingMailsComponent } from './outgoing-mails.component';

describe('OutgoingMailsComponent', () => {
  let component: OutgoingMailsComponent;
  let fixture: ComponentFixture<OutgoingMailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingMailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutgoingMailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
