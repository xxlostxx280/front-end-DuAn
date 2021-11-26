import { HttpClient } from '@angular/common/http';
import { Component, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService, WindowService } from '@progress/kendo-angular-dialog';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { NotificationService } from '@progress/kendo-angular-notification';
import { GroupDescriptor, State } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-manager-category',
  templateUrl: './manager-category.component.html',
  styleUrls: ['./manager-category.component.css'],
  providers: [ApiService]
})
export class ManagerCategoryComponent implements OnInit {
  public gridData: Array<any> = [];
  public gridData_2: Array<any> = [];
  public state: State = {
    filter: undefined,
    skip: 0,
    take: 10,
    group: [{field: "category.name"}],
    sort: [],
  };

  public changes: any = {};
  constructor(private message: MessageService, public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
    private notificationService: NotificationService, private formBuilder: FormBuilder) { }

  public api: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public api_2: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);

  ngOnInit(): void {
    this.api.isManager = true;
    this.api_2.isManager = true;
    this.api.Controller = "CategoryManagerController";
    this.api_2.Controller = "CategoryDetailManagerController";
    this.api_2.Grid.isGrouping = true;
    this.api.Read.Execute().subscribe((res) => {
      this.gridData = res.data;
    })
    this.api_2.Read.Execute().subscribe((res) => {
      this.api_2.dataSource = res.data;
    })
    this.message.receivedDataAfterUpadte().subscribe((rs) => {
      if (JSON.stringify(this.api.Grid.oldState) == JSON.stringify(this.gridData)) {
        this.gridData = rs.data;
      } else {
        this.api_2.dataSource = rs.data;
      }
    })
    this.message.receivedDataBehavior().subscribe((rs) => {
      if (JSON.stringify(this.api.Grid.oldState) == JSON.stringify(this.gridData)) {
        this.gridData = rs;
      } else {
        this.api_2.dataSource = rs.data;
      }
    })
  }

  Category(id: number): any {
    return this.gridData.find(x => x.id === id);
  }
  onCategoryChange(event: any): void{
    this.api_2.formGroup.markAsDirty({onlySelf: true});
    this.api_2.formGroup.value.category = this.gridData.find((x)=> x.id == event);
  }

  Update(grid: any): void {
    if (JSON.stringify(grid.data.data) == JSON.stringify(this.gridData)) {
      this.api.Update.Execute(grid);
    } else {
      this.api_2.Update.Execute(grid);
    }
  }

  addHandler(event: any): void {
    if (JSON.stringify(event.sender.data.data) == JSON.stringify(this.gridData)) {
      this.api.Create.Execute(null, event.sender.data.data);
    } else {
      this.api_2.Create.Execute(null, event.sender.data.data);
    }
    event.sender.addRow(this.api.formGroup);
  }
  saveHandler(event: any) {
    if (JSON.stringify(event.sender.data.data) == JSON.stringify(this.gridData)) {
      this.api.Grid.saveHandler(event);
    } else {
      this.api_2.Grid.saveHandler(event);
    }
    event.sender.closeRow(event.rowIndex);
  }

  cellClickHandler(event: any): void {
    if (JSON.stringify(event.sender.data.data) == JSON.stringify(this.gridData)) {
      this.api.Grid.cellClickHandler(event);
    } else {
      this.api_2.Grid.cellClickHandler(event);
    }
  }
  cellCloseHandler(event: any): void {
    if (JSON.stringify(event.sender.data.data) == JSON.stringify(this.gridData)) {
      this.api.Grid.cellCloseHandler(event);
    } else {
      this.api_2.Grid.cellCloseHandler(event);
    }
  }

  removeHandler(event: any): void {
    if (JSON.stringify(event.sender.data.data) == JSON.stringify(this.gridData)) {
      this.api.Grid.removeHandler(event);
    } else {
      this.api_2.Grid.removeHandler(event);
    }
    event.sender.cancelCell();
  }

  cancelChanges(grid: any): void {
    grid.cancelCell();
  }

  cancelHandler(event: any): void {
    event.sender.closeRow(event.rowIndex);
  }
  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
  }
}
