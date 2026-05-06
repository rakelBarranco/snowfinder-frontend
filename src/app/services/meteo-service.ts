import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Meteo} from '../interfaces/interfaz-estacion';

@Injectable({
  providedIn: 'root',
})
export class MeteoService {

  private http = inject(HttpClient);

  getMeteo(latitud: number, longitud: number): Observable<Meteo> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=temperature_2m,snow_depth,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,snowfall_sum&timezone=auto`;

    return this.http.get<any>(url).pipe(
      map(data => ({
        temperature: data.current.temperature_2m,
        snowDepth: data.current.snow_depth,
        windSpeed: data.current.wind_speed_10m,
        prevision: data.daily.time.map((fecha: string, i: number) => ({
          fecha,
          tempMax: data.daily.temperature_2m_max[i],
          tempMin: data.daily.temperature_2m_min[i],
          nieve: data.daily.snowfall_sum[i]
        }))
      }))
    );
  }
}
