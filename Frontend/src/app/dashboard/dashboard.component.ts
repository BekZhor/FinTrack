import { Component,OnInit} from '@angular/core';
import { Wallet } from '../../models';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  username: string = 'Гость';

  wallets: Wallet[] = [];
  selectedWalletId: number | null = null;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    const access = localStorage.getItem('access');
    if (access) {
      const decoded = this.apiService.parseJwt(access);
      this.username = decoded?.username || 'Пользователь';
    }

    this.apiService.getWallets().subscribe(data => {
      this.wallets = data;
    });
  }

}
