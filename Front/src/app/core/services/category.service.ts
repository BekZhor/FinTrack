import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private mockCategories: Category[] = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Transport' },
    { id: 3, name: 'Entertainment' },
    { id: 4, name: 'Communal' }
  ];
  private nextId = 5;

  getCategories(): Observable<Category[]> {
    console.log('Mock Get Categories');
    return of([...this.mockCategories]).pipe(delay(200));
  }

  createCategory(categoryData: { name: string }): Observable<Category> {
    console.log('Mock Create Category:', categoryData);
    const nameExists = this.mockCategories.some(cat => cat.name.toLowerCase() === categoryData.name.toLowerCase());
    if (nameExists) { return throwError(() => new Error('Mock: Category name should not be repeated')).pipe(delay(100));}

    const newCategory: Category = { id: this.nextId++, name: categoryData.name };
    this.mockCategories.push(newCategory);
    return of({...newCategory}).pipe(delay(300));
  }

  deleteCategory(id: number): Observable<void> {
    console.log('Mock Delete Category:', id);
    const index = this.mockCategories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      this.mockCategories.splice(index, 1);
      return of(undefined).pipe(delay(400));
    } else {
      return throwError(() => new Error('Mock: Category not found')).pipe(delay(100));
    }
  }
}