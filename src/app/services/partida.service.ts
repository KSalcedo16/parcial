// src/app/services/partida.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiPartida, ApiUsuario, ApiPartidaUsuario, ApiJuego } from '../models/api.models';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  private currentPartidaSubject = new BehaviorSubject<ApiPartida | null>(null);
  private juegoIdSubject = new BehaviorSubject<number | null>(null);
  private usuariosPartidaSubject = new BehaviorSubject<ApiUsuario[]>([]);
  
  currentPartida$ = this.currentPartidaSubject.asObservable();
  juegoId$ = this.juegoIdSubject.asObservable();
  usuariosPartida$ = this.usuariosPartidaSubject.asObservable();

  constructor(private apiService: ApiService) { }

  // Inicializar o obtener el juego de memoria
  async initializeJuego(): Promise<number> {
    try {
      // Buscar si ya existe el juego
      const juegos = await this.apiService.getJuegos().toPromise();
      let juegoMemoria = juegos?.find(j => j.titulo === 'Juego de memoria de pares');
      
      if (!juegoMemoria) {
        // Crear el juego si no existe
        juegoMemoria = await this.apiService.createJuego({
          titulo: 'Juego de memoria de pares',
          autores: 'Herrera y Ocoro y David'
        }).toPromise();
      }
      
      const juegoId = juegoMemoria!.id!;
      this.juegoIdSubject.next(juegoId);
      return juegoId;
    } catch (error) {
      console.error('Error inicializando juego:', error);
      throw error;
    }
  }

  // Crear o obtener usuarios
  async createOrGetUsuarios(playerNames: string[]): Promise<ApiUsuario[]> {
    try {
      const usuarios: ApiUsuario[] = [];
      
      for (const name of playerNames) {
        // Buscar si el usuario ya existe
        const existingUsuarios = await this.apiService.getUsuarios().toPromise();
        let usuario = existingUsuarios?.find(u => u.nombre === name);
        
        if (!usuario) {
          // Crear el usuario si no existe
          usuario = await this.apiService.createUsuario({
            nombre: name
          }).toPromise();
        }
        
        usuarios.push(usuario!);
      }
      
      this.usuariosPartidaSubject.next(usuarios);
      return usuarios;
    } catch (error) {
      console.error('Error creando/obteniendo usuarios:', error);
      throw error;
    }
  }

  // Iniciar una nueva partida
  async startPartida(playerNames: string[]): Promise<ApiPartida> {
    try {
      // Asegurar que el juego existe
      const juegoId = await this.initializeJuego();
      
      // Crear o obtener usuarios
      const usuarios = await this.createOrGetUsuarios(playerNames);
      
      // Crear la partida (la iniciamos con el primer usuario como referencia)
      const nuevaPartida = await this.apiService.createPartida({
        juego_id: juegoId,
        usuario_id: usuarios[0].id!,
        puntuacion: 0,
        estado: 'en_curso',
        fecha_inicio: new Date().toISOString()
      }).toPromise();
      
      // Crear relaciones partida-usuario para todos los jugadores
      const partidaUsuarios = await Promise.all(
        usuarios.map(usuario => 
          this.apiService.createPartidaUsuario({
            partida_id: nuevaPartida!.id!,
            usuario_id: usuario.id!,
            puntuacion: 0
          }).toPromise()
        )
      );
      
      this.currentPartidaSubject.next(nuevaPartida!);
      return nuevaPartida!;
    } catch (error) {
      console.error('Error iniciando partida:', error);
      throw error;
    }
  }

  // Actualizar puntuaciones de los jugadores
  async updatePlayerScores(players: Player[]): Promise<void> {
    try {
      const currentPartida = this.currentPartidaSubject.value;
      const usuarios = this.usuariosPartidaSubject.value;
      
      if (!currentPartida || usuarios.length === 0) {
        console.warn('No hay partida activa o usuarios para actualizar');
        return;
      }

      // Actualizar cada relación partida-usuario con la nueva puntuación
      const updatePromises = players.map(async (player, index) => {
        const usuario = usuarios[index];
        if (usuario) {
          // Buscar la relación partida-usuario
          const partidaUsuarios = await this.apiService.getPartidaUsuarios().toPromise();
          const partidaUsuario = partidaUsuarios?.find(pu => 
            pu.partida_id === currentPartida.id && pu.usuario_id === usuario.id
          );
          
          if (partidaUsuario) {
            return this.apiService.updatePartidaUsuario(partidaUsuario.id!, {
              puntuacion: player.score
            }).toPromise();
          }
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error actualizando puntuaciones:', error);
    }
  }

  // Finalizar partida
  async finishPartida(finalScores: Player[]): Promise<void> {
    try {
      const currentPartida = this.currentPartidaSubject.value;
      
      if (!currentPartida) {
        console.warn('No hay partida activa para finalizar');
        return;
      }

      // Actualizar puntuaciones finales
      await this.updatePlayerScores(finalScores);
      
      // Calcular puntuación total de la partida
      const puntuacionTotal = finalScores.reduce((total, player) => total + player.score, 0);
      
      // Actualizar estado de la partida
      await this.apiService.updatePartida(currentPartida.id!, {
        estado: 'terminada',
        puntuacion: puntuacionTotal,
        fecha_fin: new Date().toISOString()
      }).toPromise();
      
      console.log('Partida finalizada correctamente');
    } catch (error) {
      console.error('Error finalizando partida:', error);
    }
  }

  // Obtener estadísticas del jugador
  async getPlayerStats(playerName: string): Promise<Observable<any>> {
    return this.apiService.getUsuarios().pipe(
      map(usuarios => usuarios.find(u => u.nombre === playerName)),
      switchMap(usuario => {
        if (!usuario) return [];
        return this.apiService.getPartidaUsuarios().pipe(
          map(partidaUsuarios => 
            partidaUsuarios.filter(pu => pu.usuario_id === usuario.id)
          )
        );
      })
    );
  }

  // Limpiar partida actual
  clearCurrentPartida(): void {
    this.currentPartidaSubject.next(null);
    this.usuariosPartidaSubject.next([]);
  }

  // Obtener partida actual
  getCurrentPartida(): ApiPartida | null {
    return this.currentPartidaSubject.value;
  }

  // Obtener usuarios de la partida actual
  getCurrentUsuarios(): ApiUsuario[] {
    return this.usuariosPartidaSubject.value;
  }
}