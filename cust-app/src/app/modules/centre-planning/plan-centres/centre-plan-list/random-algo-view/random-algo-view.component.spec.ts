import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomAlgoViewComponent } from './random-algo-view.component';

describe('RandomAlgoViewComponent', () => {
  let component: RandomAlgoViewComponent;
  let fixture: ComponentFixture<RandomAlgoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomAlgoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomAlgoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
