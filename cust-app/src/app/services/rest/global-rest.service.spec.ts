import { TestBed } from '@angular/core/testing';

import { GlobalRestService } from './global-rest.service';

describe('GlobalRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalRestService = TestBed.get(GlobalRestService);
    expect(service).toBeTruthy();
  });
});
