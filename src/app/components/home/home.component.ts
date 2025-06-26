// src/app/components/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameBoardComponent } from '../game-board/game-board.component';
import { GameService } from '../../services/game.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, GameBoardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  playerMode: 'single' | 'multi' = 'single';
  player1Name: string = '';
  player2Name: string = '';
  gameStarted: boolean = false;
  player1Email: string = '';
  player1Password: string = '';
  player2Email: string = '';
  player2Password: string = '';
  mostrarListaUsuarios: boolean = false; // RESUELTO: Manteniendo tu versión local aquí.
  usarRegistrados: boolean = false;
jugadorRegistrado1: string = '';
jugadorRegistrado2: string = '';


  
constructor(
  private gameService: GameService,
  private usuarioService: UsuarioService
) {
  this.gameService.gameStarted$.subscribe(started => {
    this.gameStarted = started;
  });
}

startGame(): void {
  if (this.playerMode === 'single') {
    if (this.usarRegistrados) {
      // ✅ JUGAR CON USUARIO YA REGISTRADO (MODO UN JUGADOR)
      if (!this.jugadorRegistrado1) {
        alert('Selecciona un jugador registrado');
        return;
      }

      this.gameService.startGame([this.jugadorRegistrado1]);

    } else {
      // ✅ REGISTRAR NUEVO JUGADOR
      if (!this.player1Name.trim() || !this.player1Email.trim() || !this.player1Password.trim()) {
        alert('Completa todos los campos para el Jugador 1');
        return;
      }

      this.usuarioService.registrarUsuario(this.player1Name, this.player1Email, this.player1Password)
        .subscribe({
          next: () => {
            this.gameService.startGame([this.player1Name]);
            this.actualizarListaUsuarios(); // Actualiza lista después de registrar
          },
          error: () => {
            alert('Hubo un problema al registrar el jugador. Intenta nuevamente.');
          }
        });
    }

  } else {
    // MODO DOS JUGADORES
    if (this.usarRegistrados) {
      // ✅ JUGAR CON DOS USUARIOS YA REGISTRADOS
      if (!this.jugadorRegistrado1 || !this.jugadorRegistrado2) {
        alert('Selecciona ambos jugadores registrados');
        return;
      }

      if (this.jugadorRegistrado1 === this.jugadorRegistrado2) {
        alert('Selecciona dos jugadores diferentes');
        return;
      }

      this.gameService.startGame([this.jugadorRegistrado1, this.jugadorRegistrado2]);

    } else {
      // ✅ REGISTRAR DOS JUGADORES NUEVOS
      if (
        !this.player1Name.trim() || !this.player1Email.trim() || !this.player1Password.trim() ||
        !this.player2Name.trim() || !this.player2Email.trim() || !this.player2Password.trim()
      ) {
        alert('Completa todos los campos para ambos jugadores');
        return;
      }

      this.usuarioService.registrarUsuario(this.player1Name, this.player1Email, this.player1Password).subscribe({
        next: () => {
          this.usuarioService.registrarUsuario(this.player2Name, this.player2Email, this.player2Password).subscribe({
            next: () => {
              this.gameService.startGame([this.player1Name, this.player2Name]);
              this.actualizarListaUsuarios();
            },
            error: () => alert('Error al registrar Jugador 2')
          });
        },
        error: () => alert('Error al registrar Jugador 1')
      });
    }
  }
}

usuariosRegistrados: any[] = [];
mostrarUsuarios: boolean = false; // Esta variable parece duplicar mostrarListaUsuarios, puedes consolidarlas si lo deseas.

cargarUsuarios(): void {
  this.mostrarListaUsuarios = !this.mostrarListaUsuarios; // RESUELTO: Manteniendo tu versión local aquí.

  if (this.mostrarListaUsuarios && this.usuariosRegistrados.length === 0) {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuariosRegistrados = usuarios;
      },
      error: () => {
        alert('Error al cargar los usuarios');
      }
    });
  }
}

  eliminarUsuario(id: string): void { 
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.usuariosRegistrados = this.usuariosRegistrados.filter(user => user.id !== id);
      },
      error: () => {
        alert('Error al eliminar el usuario');
      }
    });
  }


filtro: string = '';

get usuariosRegistradosFiltrados(): any[] {
  return this.usuariosRegistrados.filter(usuario =>
    usuario.name.toLowerCase().includes(this.filtro.toLowerCase()) ||
    usuario.email.toLowerCase().includes(this.filtro.toLowerCase())
  );
}


actualizarListaUsuarios(): void {
  this.usuarioService.obtenerUsuarios().subscribe({
    next: (usuarios) => this.usuariosRegistrados = usuarios
  });
}
ngOnInit(): void {
  this.actualizarListaUsuarios();
}

}