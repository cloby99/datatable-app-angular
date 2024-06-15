import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { Comment } from './comment.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  comments: Comment[] = [];
  filteredComments: Comment[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm = '';
  sortColumn = '';
  sortDirection = 'asc';
  totalItems = 0;
  totalSumOfIDs = 0;
  editedComment: Comment | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getComments().subscribe((data: Comment[]) => {
      this.comments = data;
      this.totalItems = data.length;
      this.applyFilter();
      this.calculateTotalSumOfIDs();
    });
  }

  // Handling Pagination

  changePage(page: number) {
    this.currentPage = page;
    this.applyFilter();
  }

  setItemsPerPage(value: number) {
    if (value === -1) {
      this.itemsPerPage = this.totalItems;
    } else {
      this.itemsPerPage = value;
    }
    this.applyFilter();
  }

  onItemsPerPageChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.setItemsPerPage(+value);
  }

  calculateTotalSumOfIDs() {
    this.totalSumOfIDs = this.filteredComments.reduce(
      (sum, comment) => sum + comment.id,
      0
    );
  }

  // Filters for Search and Sort Table Data

  applyFilter() {
    let filtered = this.comments;
    if (this.searchTerm) {
      filtered = filtered.filter(
        (comment) =>
          comment.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          comment.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          comment.body.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    if (this.sortColumn) {
      filtered = filtered.sort((a, b) => {
        let aValue = (a as any)[this.sortColumn];
        let bValue = (b as any)[this.sortColumn];
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.totalItems = filtered.length;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredComments = filtered.slice(start, end);
    this.calculateTotalSumOfIDs();
  }

  // Search Function

  applySearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  // Sort Function

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortColumn = column;
    this.applyFilter();
  }

  // Function for Edit Table Data

  editComment(comment: Comment) {
    this.editedComment = { ...comment };
  }

  saveComment() {
    if (this.editedComment) {
      const index = this.comments.findIndex(
        (comment) => comment.id === this.editedComment!.id
      );
      if (index !== -1) {
        this.comments[index] = this.editedComment!;
        this.applyFilter();
        this.editedComment = null;
      }
    }
  }

  cancelEdit() {
    this.editedComment = null;
  }

  // Function for Delete Table Data

  deleteComment(id: number) {
    this.comments = this.comments.filter((comment) => comment.id !== id);
    this.applyFilter();
  }
}
