export interface Estacion {
  id: number;
  nombre: string;
  pais: string;
  latitud: number;
  longitud: number;
  kmPistas: number;
  descripcion: string;
  altitud: number;
  imagenes: { id: number; url: string }[];
}

export interface Meteo {
  temperature: number;
  snowDepth: number;
  windSpeed: number;
  prevision: {
    fecha: string;
    tempMax: number;
    tempMin: number;
    nieve: number;
  }[];
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
  estacion: { id: number; nombre: string };
}
