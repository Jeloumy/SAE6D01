import { TestBed } from '@angular/core/testing';

import { AccesLibreService } from './acces-libre.service';

describe('AccesLibreService', () => {
  let service: AccesLibreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesLibreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
