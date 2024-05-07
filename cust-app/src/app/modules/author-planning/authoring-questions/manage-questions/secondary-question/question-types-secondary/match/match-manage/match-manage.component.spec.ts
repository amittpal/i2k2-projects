import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchManageComponent } from './match-manage.component';

describe('MatchManageComponent', () => {
  let component: MatchManageComponent;
  let fixture: ComponentFixture<MatchManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
