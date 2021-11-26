import { Component, ElementRef, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStateChangeEvent, EditService, GridDataResult } from '@progress/kendo-angular-grid';
import { GroupDescriptor, State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';
import { WindowProductComponent } from './windowProduct.component';

@Component({
  selector: 'app-manager-product',
  templateUrl: './manager-product.component.html',
  styleUrls: ['./manager-product.component.css']
})
export class ManagerProductComponent implements OnInit {
  public view!: Observable<GridDataResult>;
  public hiddenColumns: string[] = [];
  public gridData: Array<any> = [];
  public method: any;
  public loading = false;
  public state: State = {
    filter: undefined,
    skip: 0,
    take: 5,
    group: [{field: "categorydetail.category.name"}, { field: "categorydetail.name" },],
    sort: [],
  };
  constructor(private api: ApiService, private message: MessageService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.api.isManager = true;
    this.api.Controller = "ProductManagerController";
    this.api.OpenWindow.Width = 1200;
    this.api.typeData = "popup";
    this.loading = this.api.loading
    this.api.Read.Execute().subscribe((rs) => {
      this.api.dataSource = rs.data;
      this.gridData = rs.data;
      this.loading = this.api.loading
    })
    this.message.receivedDataAfterUpadte().subscribe((res) => {
      if (res.status) {
        this.gridData = this.api.dataSource;
      }
    })
  }
  
  isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  Category(id: number): any {
    return this.gridData.find(x => x.id === id);
  }
  addHanler(event: any) {
    this.api.Create.Execute(WindowProductComponent, this.gridData[0]);
  }
  editHandler(event: any) {
    this.api.Edit.Execute(WindowProductComponent, event);
  }
  removeHandler(event: any) {

  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
  }
}
