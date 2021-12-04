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

  public listCustomer: Array<any> = [];
  public listBillBought: Array<any> = [];
  public listBillBuying: Array<any> = [];
  public myWallet: any;
  public isWallet = false;
  public getCustomer: any;
  public tabStrip_1 = true;

  constructor(private message: MessageService, public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
    private notificationService: NotificationService, private formBuilder: FormBuilder) { }

  public Customer: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public Bill: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public MamiPay: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public History: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);

  ngOnInit(): void {
    if (sessionStorage.getItem('TOKEN') == null || sessionStorage.getItem('TOKEN') == undefined) {
      window.location.href = "";
    } else {
      if(sessionStorage.getItem("isRecharge") == "true"){
        this.MamiPay.Notification.notificationSuccess('Nạp tiền thành công');
        sessionStorage.setItem("isRecharge","false")
      }

      this.Customer.isManager = true;
      this.Customer.Controller = "CustomersManagerController";
      this.Bill.Controller = "BillController";
      this.MamiPay.Controller = "MamiPayController";
      this.History.Controller = "HistoryManagerController"

      this.Customer.Read.Execute().subscribe((rs) => {
        this.listCustomer = rs.data;
        this.getCustomer = this.listCustomer.find((x) => x.idaccount == sessionStorage.getItem('USER_ID'));
        this.Bill.getApi('api/bill/' + this.getCustomer.id).subscribe((rs) => {
          this.listBillBought = rs.data.filter((x: any) => x.status == "KHACH_DA_NHAN_HANG" || x.status == "HUY");
          this.listBillBuying = rs.data.filter((x: any) => x.status != "KHACH_DA_NHAN_HANG" && x.status != "HUY");
        })
      })
      this.MamiPay.getApi('Customer/' + this.MamiPay.Controller + '/mamipay').subscribe((rs)=>{
        if(rs.data != null){
          this.isWallet = true;
          this.myWallet = rs.data;
        }
      })
      this.History.getApi('Customer/HistoryManagerController').subscribe((rs)=>{
        this.History.dataSource = rs.data;
      })

      this.message.receivedDataAfterUpadte().subscribe((rs)=>{
        this.listBillBuying.map((x,idx)=>{
          if(x.id == rs.id){
            this.listBillBuying.splice(idx,1);
            this.listBillBought.push(rs);
          }
        })   
      })
    }
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
  createWallet(): void{
    this.MamiPay.postApi('Customer/' + this.MamiPay.Controller + '/create','').subscribe((rs)=>{
      this.myWallet = rs.data;
      this.MamiPay.Notification.notificationExecute(rs.message);
    })
  }
  recharge(): void{
    this.MamiPay.OpenWindow.Width = 500;
    this.MamiPay.OpenWindow.top = 50;
    this.MamiPay.OpenWindow.left = 500;
    this.MamiPay.formGroup = this.formBuilder.group({
      amount: new FormControl(0),
      description: new FormControl(''),
      bankcode: new FormControl({id: '',name: ''}),
      language: new FormControl('vn'),
    })
    sessionStorage.setItem('isRecharge',"true");
    this.MamiPay.OpenWindow.Execute(WindowRechargeComponent,'','');
  }
}
