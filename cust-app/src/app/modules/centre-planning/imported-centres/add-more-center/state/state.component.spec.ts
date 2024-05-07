import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMoreStateComponent } from './state.component';


describe('AddMoreStateComponent', () => {
  let component: AddMoreStateComponent;
  let fixture: ComponentFixture<AddMoreStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoreStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
