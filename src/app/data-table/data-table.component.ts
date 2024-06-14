import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { Comment } from './comment.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
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
  totalSumOfIDs = 0; // New property to hold the sum of IDs


  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getComments().subscribe((data: Comment[]) => {
      this.comments = data;
      this.totalItems = data.length;
      this.applyFilter();
      this.calculateTotalSumOfIDs(); // Calculate the sum of IDs after data is loaded

    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.applyFilter();
  }

  setItemsPerPage(value: number) {
    if (value === -1) {
      this.itemsPerPage = this.totalItems; // Set itemsPerPage to totalItems if "All" is selected
    } else {
      this.itemsPerPage = value;
    }
    this.applyFilter();
  }
  
  onItemsPerPageChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.setItemsPerPage(+value); // Convert value to number
  }
  
  

  applyFilter() {
    let filtered = this.comments;
    if (this.searchTerm) {
      filtered = filtered.filter(comment => 
        comment.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        comment.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        comment.body.toLowerCase().includes(this.searchTerm.toLowerCase()));
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
    this.calculateTotalSumOfIDs(); // Recalculate the sum of IDs after filtering

  }

  applySearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortColumn = column;
    this.applyFilter();
  }

  editComment(comment: Comment) {
    // Implement edit logic here
  }

  deleteComment(id: number) {
    this.comments = this.comments.filter(comment => comment.id !== id);
    this.applyFilter();
  }

  calculateTotalSumOfIDs() {
    this.totalSumOfIDs = this.filteredComments.reduce((sum, comment) => sum + comment.id, 0);
  }

}
