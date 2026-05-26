import {Injectable} from '@angular/core';
import {Modal} from 'bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  open(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    Modal.getOrCreateInstance(el).show();
  }

  close(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    Modal.getInstance(el)?.hide();
  }
}
