import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerStatusCheckComponent } from './server-status-check.component';

describe('ServerStatusCheckComponent', () => {
  let component: ServerStatusCheckComponent;
  let fixture: ComponentFixture<ServerStatusCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerStatusCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerStatusCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
