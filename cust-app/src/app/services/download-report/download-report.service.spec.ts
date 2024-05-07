import { TestBed } from '@angular/core/testing';

import { DownloadReportService } from './download-report.service';

describe('DownloadReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadReportService = TestBed.get(DownloadReportService);
    expect(service).toBeTruthy();
  });
});
