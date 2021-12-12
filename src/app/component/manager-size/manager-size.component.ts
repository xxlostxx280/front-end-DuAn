import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService, WindowService } from '@progress/kendo-angular-dialog';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { NotificationService } from '@progress/kendo-angular-notification';
import { GroupDescriptor, State, process, DataResult } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-manager-size',
  templateUrl: './manager-size.component.html',
  styleUrls: ['./manager-size.component.css']
})
export class ManagerSizeComponent implements OnInit {
  public gridData: Array<any> = [];
  public gridData_2: Array<any> = [];
  public state: State = {
    filter: undefined,
    skip: 0,
    take: 10,
    group: [{ field: "typesize.name" }],
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
    this.api.Controller = "TypeSizeManagerController";
    this.api_2.Controller = "SizeManagerController";
    this.api_2.Grid.isGrouping = true; // Xem dữ liệu có đc group ko ??
    this.Read();
    this.message.receivedDataAfterUpadte().subscribe((rs) => {
      this.Read();
    })
    this.message.receivedDataBehavior().subscribe((rs) => {
      if (JSON.stringify(this.api.Grid.newState) == JSON.stringify(rs)) {
        this.gridData = rs;
      } else {
        this.api_2.dataSource = rs;
      }
    })
  }

  Read(): void{
    this.api.Read.Execute().subscribe((res) => {
      this.gridData = res.data;
      this.api.dataSource = res.data;
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api.Notification.notificationError('');
      }
    })
    this.api_2.Read.Execute().subscribe((res) => {
      this.api_2.dataSource = res.data
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api_2.Notification.notificationError('');
      }
    })
  }

  TypeSize(id: number): any {
    return this.gridData.find(x => x.id === id);
  }
  onTypeSizeChange(event: any): void {
    this.api_2.formGroup.markAsDirty({ onlySelf: true });
    this.api_2.formGroup.value.idtypesize = event;
    this.api_2.formGroup.value.typesize = this.gridData.find((x) => x.id == event);
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
      event.sender.addRow(this.api.formGroup);
    } else {
      this.api_2.Create.Execute(null, event.sender.data.data[0].items);
      event.sender.addRow(this.api_2.formGroup);
    }
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
