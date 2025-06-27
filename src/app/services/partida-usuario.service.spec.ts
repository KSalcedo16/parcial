import { TestBed } from '@angular/core/testing';

import { PartidaUsuarioService } from './partida-usuario.service';

describe('PartidaUsuarioService', () => {
  let service: PartidaUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartidaUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
