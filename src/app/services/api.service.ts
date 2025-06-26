// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  ApiJuego, 
  ApiPartida, 
  ApiUsuario, 
  ApiPartidaUsuario, 
  ApiResponse,
  ApiErrorResponse 
} from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'https://apigame.gonzaloandreslucio.com/api';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // === JUEGOS ===
  getJuegos(): Observable<ApiJuego[]> {
    return this.http.get<ApiResponse<ApiJuego[]>>(`${this.baseUrl}/juegos`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getJuego(id: number): Observable<ApiJuego> {
    return this.http.get<ApiResponse<ApiJuego>>(`${this.baseUrl}/juegos/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createJuego(juego: Omit<ApiJuego, 'id' | 'created_at' | 'updated_at'>): Observable<ApiJuego> {
    return this.http.post<ApiResponse<ApiJuego>>(`${this.baseUrl}/juegos`, juego, this.httpOptions)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateJuego(id: number, juego: Partial<ApiJuego>): Observable<ApiJuego> {
    return this.http.put<ApiResponse<ApiJuego>>(`${this.baseUrl}/juegos/${id}`, juego, this.httpOptions)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteJuego(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/juegos/${id}`)
      .pipe(
        map(response => response.success),
        catchError(this.handleError)
      );
  }

  // === USUARIOS ===
  getUsuarios(): Observable<ApiUsuario[]> {
    return this.http.get<ApiResponse<ApiUsuario[]>>(`${this.baseUrl}/usuarios`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getUsuario(id: number): Observable<ApiUsuario> {
    return this.http.get<ApiResponse<ApiUsuario>>(`${this.baseUrl}/usuarios/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createUsuario(usuario: Omit<ApiUsuario, 'id' | 'created_at' | 'updated_at'>): Observable<ApiUsuario> {
    return this.http.post<ApiResponse<ApiUsuario>>(`${this.baseUrl}/usuarios`, usuario, this.httpOptions)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updateUsuario(id: number, usuario: Partial<ApiUsuario>): Observable<ApiUsuario> {
    return this.http.put<ApiResponse<ApiUsuario>>(`${this.baseUrl}/usuarios/${id}`, usuario, this.httpOptions)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deleteUsuario(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/usuarios/${id}`)
      .pipe(
        map(response => response.success),
        catchError(this.handleError)
      );
  }

  // === PARTIDAS ===
  getPartidas(): Observable<ApiPartida[]> {
    return this.http.get<ApiResponse<ApiPartida[]>>(`${this.baseUrl}/partidas`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getPartida(id: number): Observable<ApiPartida> {
    return this.http.get<ApiResponse<ApiPartida>>(`${this.baseUrl}/partidas/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createPartida(partida: Omit<ApiPartida, 'id' | 'created_at' | 'updated_at'>): Observable<ApiPartida> {
    return this.http.post<ApiResponse<ApiPartida>>(`${this.baseUrl}/partidas`, partida, this.httpOptions)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updatePartida(id: number, partida: Partial<ApiPartida>): Observable<ApiPartida> {
    return this.http.put<ApiResponse<ApiPartida>>(`${this.baseUrl}/partidas/${id}`, partida, this.httpOptions)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deletePartida(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/partidas/${id}`)
      .pipe(
        map(response => response.success),
        catchError(this.handleError)
      );
  }

  // === PARTIDA-USUARIO ===
  getPartidaUsuarios(): Observable<ApiPartidaUsuario[]> {
    return this.http.get<ApiResponse<ApiPartidaUsuario[]>>(`${this.baseUrl}/partida-usuarios`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  getPartidaUsuario(id: number): Observable<ApiPartidaUsuario> {
    return this.http.get<ApiResponse<ApiPartidaUsuario>>(`${this.baseUrl}/partida-usuarios/${id}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  createPartidaUsuario(partidaUsuario: Omit<ApiPartidaUsuario, 'id' | 'created_at' | 'updated_at'>): Observable<ApiPartidaUsuario> {
    return this.http.post<ApiResponse<ApiPartidaUsuario>>(`${this.baseUrl}/partida-usuarios`, partidaUsuario, this.httpOptions)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  updatePartidaUsuario(id: number, partidaUsuario: Partial<ApiPartidaUsuario>): Observable<ApiPartidaUsuario> {
    return this.http.put<ApiResponse<ApiPartidaUsuario>>(`${this.baseUrl}/partida-usuarios/${id}`, partidaUsuario, this.httpOptions)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  deletePartidaUsuario(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/partida-usuarios/${id}`)
      .pipe(
        map(response => response.success),
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la API:', error);
    
    let errorMessage = 'Ocurrió un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}