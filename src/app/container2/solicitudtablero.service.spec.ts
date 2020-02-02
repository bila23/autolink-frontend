import { TestBed } from '@angular/core/testing';

import { SolicitudtableroService } from './solicitudtablero.service';

describe('SolicitudtableroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SolicitudtableroService = TestBed.get(SolicitudtableroService);
    expect(service).toBeTruthy();
  });
});
