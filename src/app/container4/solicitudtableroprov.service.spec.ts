import { TestBed } from '@angular/core/testing';

import { SolicitudtableroprovService } from './solicitudtableroprov.service';

describe('SolicitudtableroprovService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SolicitudtableroprovService = TestBed.get(SolicitudtableroprovService);
    expect(service).toBeTruthy();
  });
});
