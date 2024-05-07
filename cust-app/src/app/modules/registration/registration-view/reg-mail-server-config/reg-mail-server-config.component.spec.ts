import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegMailServerConfigComponent } from './reg-mail-server-config.component';

describe('RegMailServerConfigComponent', () => {
  let component: RegMailServerConfigComponent;
  let fixture: ComponentFixture<RegMailServerConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegMailServerConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegMailServerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
