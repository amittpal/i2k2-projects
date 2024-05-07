import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishResponseComponent } from './publish-response.component';

describe('PublishResponseComponent', () => {
  let component: PublishResponseComponent;
  let fixture: ComponentFixture<PublishResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
