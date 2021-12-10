import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService, WindowService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';
import { FormatSettings } from "@progress/kendo-angular-dateinputs";

@Component({
  selector: 'app-manager-event',
  templateUrl: './manager-event.component.html',
  styleUrls: ['./manager-event.component.css']
})
export class ManagerEventComponent implements OnInit {
  public format: FormatSettings = {
    displayFormat: "dd/MM/yyyy",
    inputFormat: "dd/MM/yyyy",
  };
  public gridData: Array<any> = [];
  public date: Date = new Date();

  public changes: any = {};
  constructor(private message: MessageService, public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
    private notificationService: NotificationService, private formBuilder: FormBuilder) { }

  public api: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);

  ngOnInit(): void {
    this.api.isManager = true;
    this.api.Controller = "EventManagerController";
    this.api.Read.Execute().subscribe((res) => {
      this.gridData = res.data;
      this.api.dataSource = res.data;
    })
    this.message.receivedDataAfterUpadte().subscribe((rs) => {
      this.gridData = rs.data;
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api.Notification.notificationError('');
      }
    })
    this.message.receivedDataBehavior().subscribe((rs) => {
      this.gridData = rs;
    })
  }

  Update(grid: any): void {
    this.api.Update.Execute(grid);
  }

  addHandler(event: any): void {
    this.api.Create.Execute(null, event.sender.data.data);
    this.api.formGroup.controls.startday.setValue(new Date());
    this.api.formGroup.controls.endday.setValue(new Date());
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

  onChangeDate(value: Date) {
    // Update the JSON birthDate string date

  }

  getDate(getDate: any) {
    this.api.formGroup.markAsDirty({ onlySelf: true });
    let value = new Date(getDate);
    return value;
  }

}
