// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // RouterOutlet-ті импорттау МАҢЫЗДЫ
import { HeaderComponent } from './core/header/header.component'; // HeaderComponent-ті импорттау МАҢЫЗДЫ

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
      RouterOutlet,      // Осы жерге RouterOutlet қосу керек
      HeaderComponent    // Осы жерге HeaderComponent қосу керек
      // CommonModule қажет болуы мүмкін, егер *ngIf/*ngFor қолдансаңыз (біздің жағдайда қазір қажет емес)
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'financial-tracker-front'; // Енді қажет емес
}