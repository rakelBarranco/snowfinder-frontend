import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.css'
})
export default class NotFoundPage {

  copos = Array.from({length: 20}, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 16 + 10}px`,
    duration: `${Math.random() * 5 + 5}s`,
    delay: `${Math.random() * 5}s`
  }));

}
