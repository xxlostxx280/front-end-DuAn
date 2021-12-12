import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { DialogService, WindowService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';
import { WindowHistoryComponent } from './windowHistory.component';
import { WindowRechargeComponent } from './windowRecharge.component';

@Component({
  selector: 'app-history-and-wallet',
  templateUrl: './history-and-wallet.component.html',
  styleUrls: ['./history-and-wallet.component.css']
})
export class HistoryAndWalletComponent implements OnInit {

  public listBillBought: Array<any> = [];
  public listBillBuying: Array<any> = [];
  public myWallet: any;
  public isWallet = false;
  public getCustomer: any;
  public tabStrip_1 = true;

  constructor(public api: ApiService, private message: MessageService, public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
    private notificationService: NotificationService, private formBuilder: FormBuilder) { }

  public Customer: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public Bill: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public MamiPay: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public History: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);

  ngOnInit(): void {
    if (sessionStorage.getItem('TOKEN') == null || sessionStorage.getItem('TOKEN') == undefined) {
      alert("Chức năng này bắt buộc đăng nhập để được sử dụng")
      window.location.href = "/login";
    } else {
      if (sessionStorage.getItem("isRecharge") == "true") {
        this.MamiPay.Notification.notificationSuccess('Nạp tiền thành công');
        sessionStorage.setItem("isRecharge", "false")
      }
      this.Customer.Controller = "CustomerController";
      this.Bill.Controller = "BillController";
      this.MamiPay.Controller = "MamiPayController";
      this.History.Controller = "HistoryManagerController"
      this.Read();
      this.message.receivedDataAfterUpadte().subscribe((rs) => {
        this.Bill.windowRef.close();
        this.Read();
      })
    }
  }

  Read(): void {
    this.Customer.getApi('Customer/' + this.Customer.Controller + '/' + sessionStorage.getItem('Account')).subscribe((rs) => {
      this.getCustomer = rs.data;
      this.Bill.getApi('api/bill/' + this.getCustomer.id).subscribe((rs) => {
        this.listBillBought = rs.data.filter((x: any) => x.status == "KHACH_DA_NHAN_HANG" || x.status == "HUY" || x.status == "DA_XAC_NHAN_VA_DONG_GOI");
        this.listBillBuying = rs.data.filter((x: any) => x.status != "KHACH_DA_NHAN_HANG" && x.status != "HUY" && x.status != "DA_XAC_NHAN_VA_DONG_GOI");
      })
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api.Notification.notificationError('');
      }
    })
    this.MamiPay.getApi('Customer/' + this.MamiPay.Controller + '/mamipay').subscribe((rs) => {
      if (rs.data != null) {
        this.isWallet = true;
        this.myWallet = rs.data;
      }
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api.Notification.notificationError('');
      }
    })
    this.History.getApi('Customer/HistoryManagerController').subscribe((rs) => {
      this.History.dataSource = rs.data;
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api.Notification.notificationError('');
      }
    })
  }

  getDate(getDate: any) {
    let value = new Date(getDate);
    return value;
  }

  editHandler(event: any) {
    this.Bill.OpenWindow.top = 150;
    this.Bill.OpenWindow.left = 200;
    this.Bill.Edit.Execute(WindowHistoryComponent, event);
  }

  /////Phần ví điện tử/////////////
  createWallet(): void {
    this.MamiPay.postApi('Customer/' + this.MamiPay.Controller + '/create', '').subscribe((rs) => {
      this.myWallet = rs.data;
      this.MamiPay.Notification.notificationExecute(rs.message);
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api.Notification.notificationError('');
      }
    })
  }
  recharge(): void {
    this.MamiPay.OpenWindow.Width = 500;
    this.MamiPay.OpenWindow.Height = 425;
    this.MamiPay.OpenWindow.top = 50;
    this.MamiPay.OpenWindow.left = 500;
    this.MamiPay.formGroup = this.formBuilder.group({
      amount: new FormControl(0),
      description: new FormControl(''),
      bankcode: new FormControl({ id: '', name: '' }),
      language: new FormControl('vn'),
    })
    this.MamiPay.OpenWindow.Execute(WindowRechargeComponent, '', '');
  }
}
