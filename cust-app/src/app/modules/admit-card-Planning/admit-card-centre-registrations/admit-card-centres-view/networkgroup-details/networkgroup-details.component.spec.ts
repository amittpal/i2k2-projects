import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkgroupDetailsComponent } from './networkgroup-details.component';

describe('NetworkgroupDetailsComponent', () => {
  let component: NetworkgroupDetailsComponent;
  let fixture: ComponentFixture<NetworkgroupDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkgroupDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkgroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
