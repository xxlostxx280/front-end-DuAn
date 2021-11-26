import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogService, WindowService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-manager-voucher',
  templateUrl: './manager-voucher.component.html',
  styleUrls: ['./manager-voucher.component.css']
})
export class ManagerVoucherComponent implements OnInit {

  public listVoucher: Array<any> = [];

  constructor(private message: MessageService, public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
    private notificationService: NotificationService, private formBuilder: FormBuilder) { }

  public Voucher: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);

  ngOnInit(): void {
    this.Voucher.isManager = true;
    this.Voucher.Controller = "VoucherManagerController";
    this.Voucher.Read.Execute().subscribe((res) => {
      this.listVoucher = res.data;
    })
    this.message.receivedDataAfterUpadte().subscribe((rs) => {
      this.listVoucher = rs.data;
    })
    this.message.receivedDataBehavior().subscribe((rs) => {
      this.listVoucher = rs;
    })
  }

  Update(grid: any): void {
    this.Voucher.Update.Execute(grid);
  }

  addHandler(event: any): void {
    this.Voucher.Create.Execute(null, event.sender.data.data);
    event.sender.addRow(this.Voucher.formGroup);
  }
  saveHandler(event: any) {
    this.Voucher.Grid.saveHandler(event);
    event.sender.closeRow(event.rowIndex);
  }

  cellClickHandler(event: any): void {
    this.Voucher.Grid.cellClickHandler(event);
  }
  cellCloseHandler(event: any): void {
    this.Voucher.Grid.cellCloseHandler(event);
  }

  removeHandler(event: any): void {
    this.Voucher.Grid.removeHandler(event);
    event.sender.cancelCell();
  }

  cancelChanges(grid: any): void {
    grid.cancelCell();
  }

  cancelHandler(event: any): void {
    event.sender.closeRow(event.rowIndex);
  }

}
