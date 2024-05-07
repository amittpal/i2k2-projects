import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomAlgoComponent } from './random-algo.component';

describe('RandomAlgoComponent', () => {
  let component: RandomAlgoComponent;
  let fixture: ComponentFixture<RandomAlgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomAlgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomAlgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
