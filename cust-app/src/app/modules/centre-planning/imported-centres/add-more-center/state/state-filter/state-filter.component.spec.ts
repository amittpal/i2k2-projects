import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMoreStateFilterComponent } from './state-filter.component';


describe('AddMoreStateFilterComponent', () => {
  let component: AddMoreStateFilterComponent;
  let fixture: ComponentFixture<AddMoreStateFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoreStateFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreStateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
