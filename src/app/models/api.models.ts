// src/app/models/api.models.ts

export interface ApiJuego {
  id?: number;
  titulo: string;
  autores: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiPartida {
  id?: number;
  juego_id: number;
  usuario_id: number;
  puntuacion: number;
  estado: 'en_curso' | 'terminada' | 'pausada';
  tiempo_jugado?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiUsuario {
  id?: number;
  nombre: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiPartidaUsuario {
  id?: number;
  partida_id: number;
  usuario_id: number;
  puntuacion: number;
  posicion?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: any;
}