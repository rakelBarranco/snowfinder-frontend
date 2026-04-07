export interface Estacion {
  id: number;
  nombre: string;
  pais: string;
  latitud: number;
  longitud: number;
  kmPistas: number;
  descripcion: string;
  altitud: number;
}

export interface Meteo {
  temperature: number;
  snowDepth: number;
  windSpeed: number;
}

export interface FavoritoResponse {
  mensaje: string;
}

export interface Opinion {
  id: number;
  puntuacion: number;
  comentario: string;
  fecha: string;
  usuario: { nombre: string };
}
