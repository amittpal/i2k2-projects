import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoEditPreviewComponent } from './photo-edit-preview.component';

describe('PhotoEditPreviewComponent', () => {
  let component: PhotoEditPreviewComponent;
  let fixture: ComponentFixture<PhotoEditPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoEditPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoEditPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
