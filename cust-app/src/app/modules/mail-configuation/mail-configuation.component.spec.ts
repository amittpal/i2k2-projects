import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailConfiguationComponent } from './mail-configuation.component';

describe('MailConfiguationComponent', () => {
  let component: MailConfiguationComponent;
  let fixture: ComponentFixture<MailConfiguationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailConfiguationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailConfiguationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
