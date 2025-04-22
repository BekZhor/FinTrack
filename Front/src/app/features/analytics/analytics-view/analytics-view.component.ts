import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../core/models/transaction.model';
import { Subscription, catchError, map, of, tap } from 'rxjs';

interface ChartData { name: string; value: number; }

@Component({
  selector: 'app-analytics-view',
  standalone: true,
  imports: [ CommonModule, NgxChartsModule ],
  templateUrl: './analytics-view.component.html',
  styleUrls: ['./analytics-view.component.css']
})
export class AnalyticsViewComponent implements OnInit, OnDestroy {

  expenseByCategoryData: ChartData[] = [];
  loading = true;
  error: string | null = null;

  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';

  private dataSubscription: Subscription | null = null;

  constructor(
    private transactionService: TransactionService,
    private cdRef: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this.loadExpenseSummary();
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  loadExpenseSummary(): void {
    this.loading = true; 
    this.error = null;
    this.dataSubscription?.unsubscribe();
    console.log("Analytics: Loading expense summary...");

    this.dataSubscription = this.transactionService.getTransactions().pipe(
      map(transactions => {
        console.log('Analytics: Received transactions:', transactions);
        const expenseSummary: { [key: string]: number } = {};
        transactions
          .filter(tx => tx.type === 'expense' && tx.category)
          .forEach(tx => {
            const categoryName = tx.category!.name;
            expenseSummary[categoryName] = (expenseSummary[categoryName] || 0) + Number(tx.amount);
          });
        console.log('Analytics: Calculated expense summary:', expenseSummary);
        const chartData: ChartData[] = Object.keys(expenseSummary).map(categoryName => ({
          name: categoryName,
          value: expenseSummary[categoryName]
        }));
        console.log('Analytics: Formatted chart data:', chartData);
        return chartData;
      }),
      catchError(err => {
        console.error("Error processing transactions for analytics:", err);
        this.error = "Error processing analytics data.";
        this.loading = false; 
        this.cdRef.detectChanges(); 
        return of([]);
      })
    ).subscribe({
        next: (data) => {
            this.expenseByCategoryData = data;
            this.loading = false;
            console.log('Analytics: expenseByCategoryData assigned:', this.expenseByCategoryData);
            console.log('Analytics: Loading finished successfully.');
            this.cdRef.detectChanges(); 
        },
        error: () => {
             this.loading = false;
             this.cdRef.detectChanges(); 
             console.log('Analytics: Loading finished with error (in subscribe error block).');
        }
    });
  }

  onSelect(event: any): void {
    console.log('Chart item selected:', event);
  }
}