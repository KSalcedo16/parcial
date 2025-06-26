// src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'https://apigame.gonzaloandreslucio.com/api/users';
  private juegoId = '9816bd1b-bd46-462b-a8de-dd971e37d358'; // Este es el ID del juego

  constructor(private http: HttpClient) {}

  registrarUsuario(nombre: string, email: string, password: string): Observable<any> {
    const body = {
      name: nombre,
      email: email,
      password: password,
      password_confirmation: password, // asumimos que es igual
      juego_id: this.juegoId
    };

    return this.http.post(this.apiUrl, body);
  }

  obtenerUsuarios(): Observable<any[]> {
  return this.http.get<any[]>('https://apigame.gonzaloandreslucio.com/api/users');
}

  eliminarUsuario(id: string): Observable<any> {
  const url = `https://apigame.gonzaloandreslucio.com/api/users/${id}`;
  return this.http.delete(url);
}

}
