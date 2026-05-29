import {Component, inject} from '@angular/core';
import {NotificationService} from '../../services/notification-service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [AsyncPipe],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent {
  notificationService = inject(NotificationService);
}
