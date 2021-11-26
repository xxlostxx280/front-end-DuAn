import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService, WindowService } from '@progress/kendo-angular-dialog';
import { DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { GroupDescriptor, process, DataResult, State } from '@progress/kendo-data-query';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';
import { WindowProductComponent } from '../manager-product/windowProduct.component';
import { WindowQuantityComponent } from './windowQuantity.component';

@Component({
  selector: 'app-manager-quantity',
  templateUrl: './manager-quantity.component.html',
  styleUrls: ['./manager-quantity.component.css']
})
export class ManagerQuantityComponent implements OnInit {
  public hiddenColumns: string[] = [];
  public gridData: Array<any> = [];
  public listQuantity: Array<any> = [];
  public listTypeSize: Array<any> = [];
  public listSize: Array<any> = [];
  public listProperty: Array<any> = [];
  
  public state: State = {
    filter: undefined,
    skip: 0,
    take: 5,
    group: [{field: "idProduct"}],
    sort: [],
  };
  
  constructor(private api: ApiService, public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
    private notificationService: NotificationService, private message: MessageService, private formBuilder: FormBuilder) {
  }
  public Quantity: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);

  ngOnInit(): void {
    this.Quantity.isManager = true;
    this.Quantity.typeData = "popup";
    this.Quantity.OpenWindow.Width = 650;
    this.Quantity.OpenWindow.left = 120;
    this.Quantity.Controller = "QuantityManagerController";
    this.Quantity.Read.Execute().subscribe((rs) => {
      this.gridData = rs.data;
    })
    this.message.receivedDataAfterUpadte().subscribe((rs) => {
      if (rs.status) {
        this.gridData = rs.data;
      }
    });
  }

  isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  //////////Tô màu Row///////////
  rowCallback = (context: RowClassArgs) => {
    switch (context.dataItem.code) {
      case "C1":
        return { gold: true };
      case "C2":
        return { green: true };
      default:
        return {};
    }
  };

  ///////////////////Các chức năng /////////////////
  addHanler(event: any) {
    this.Quantity.Create.Execute(WindowQuantityComponent, this.gridData[0]);
  }
  editHandler(event: any) {
    this.Quantity.Edit.Execute(WindowQuantityComponent, event);
  }
  removeHandler(event: any) {

  }
  
  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
  }
}
