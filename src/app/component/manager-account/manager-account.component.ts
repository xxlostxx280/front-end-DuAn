import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-manager-account',
  templateUrl: './manager-account.component.html',
  styleUrls: ['./manager-account.component.css']
})
export class ManagerAccountComponent implements OnInit {
  public gridData: Array<any> = [];
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.Controller = "AccountManagerController";
    this.api.isManager = true;
    this.api.Read.Execute().subscribe((rs) => {
      this.gridData = rs.data;
    })
  }
  
  Update(grid: any): void {
    this.api.Update.Execute(grid);
  }

  addHandler(event: any): void {
    this.api.Create.Execute(null, event.sender.data.data);
    event.sender.addRow(this.api.formGroup);
  }
  saveHandler(event: any) {
    this.api.Grid.saveHandler(event);
    event.sender.closeRow(event.rowIndex);
  }

  cellClickHandler(event: any): void {
    this.api.Grid.cellClickHandler(event);
  }
  cellCloseHandler(event: any): void {
    this.api.Grid.cellCloseHandler(event);
  }

  removeHandler(event: any): void {
    this.api.Grid.removeHandler(event);
    event.sender.cancelCell();
  }

  cancelChanges(grid: any): void {
    grid.cancelCell();
  }

  cancelHandler(event: any): void {
    event.sender.closeRow(event.rowIndex);
  }
}
