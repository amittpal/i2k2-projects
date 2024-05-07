import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostExamComponent } from './post-exam.component';

describe('PostExamComponent', () => {
  let component: PostExamComponent;
  let fixture: ComponentFixture<PostExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
