import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartidaUsuario } from '../models/partida-usuario';

@Injectable({
  providedIn: 'root'
})
export class PartidaUsuarioService {
  private apiUrl = 'https://apigame.gonzaloandreslucio.com/api/aciertos';

  constructor(private http: HttpClient) {}

  registrarAciertos(data: {
    partida_id: number;
    user_id: number;
    aciertos: number;
    tiempo: number;
  }) {
    return this.http.post(this.apiUrl, data);
  }
  obtenerAciertos() {
  return this.http.get<any[]>('https://apigame.gonzaloandreslucio.com/api/aciertos');
}

  obtenerEstadisticas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/aciertos`);
  }
}
