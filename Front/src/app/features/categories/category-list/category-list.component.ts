import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  newCategoryName: string = '';
  error: string | null = null;
  loading = false;
  addLoading = false;
  deleteLoading: { [key: number]: boolean } = {};

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void { this.loadCategories(); }

  loadCategories(): void {
    this.error = null;
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading categories (mock).';
        this.loading = false;
        console.error(err);
      }
    });
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) return;
    this.error = null;
    this.addLoading = true;
    this.categoryService.createCategory({ name: this.newCategoryName }).subscribe({
        next: (newCategory) => {
            this.loadCategories();
            this.newCategoryName = '';
            this.addLoading = false;
        },
        error: (err) => {
            this.error = err.message || 'Error adding category (mock).';
            this.addLoading = false;
            console.error(err);
        }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category (mock)?')) {
        this.error = null;
        this.deleteLoading[id] = true;
        this.categoryService.deleteCategory(id).subscribe({
            next: () => {
               this.loadCategories();
            },
            error: (err) => {
               this.error = err.message || 'Error deleting category (mock).';
               this.deleteLoading[id] = false;
               console.error(err);
            }
        });
    }
  }
}
