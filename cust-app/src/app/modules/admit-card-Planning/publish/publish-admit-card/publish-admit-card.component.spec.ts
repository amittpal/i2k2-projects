import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishAdmitCardComponent } from './publish-admit-card.component';

describe('PublishAdmitCardComponent', () => {
  let component: PublishAdmitCardComponent;
  let fixture: ComponentFixture<PublishAdmitCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishAdmitCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishAdmitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
