import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { EventManager } from "@angular/platform-browser";
import { DialogService, WindowService } from "@progress/kendo-angular-dialog";
import { NotificationService } from "@progress/kendo-angular-notification";
import { SelectEvent } from "@progress/kendo-angular-upload";
import { ApiService } from "src/app/shared/api.service";
import { MessageService } from "src/app/shared/message.service";
@Component({
    selector: "window-info",
    templateUrl: './windowBill.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class WindowBillComponent implements OnInit {
    @Input() public dataSource: any;
    @Input() public formGroup !: FormGroup;
    @Input() public status: String | undefined;

    public listOrderDetail: Array<any> = [];
    public listStatus: Array<any> = [];
    public isCancel = true;
    public isConfirm = true;
    public isShip = true;
    public isReceived = true;
    public isRefund = true;
    public isToolbar = true;

    constructor(public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
        private notificationService: NotificationService, private message: MessageService, private formBuilder: FormBuilder, private api: ApiService) { }
    
    public OrderDetail: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
    public statusShipping: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
    ngOnInit(): void {
        this.OrderDetail.isManager = true;
        this.OrderDetail.Controller = "OrderDetailManagerController";
        this.statusShipping.Controller = "BillManagerController";
        this.OrderDetail.getApi('Manager/' + this.OrderDetail.Controller + '/' + this.formGroup.value.id).subscribe((rs)=>{
            this.listOrderDetail = rs;
        })
        this.statusShipping.getApi(('Manager/' + this.statusShipping.Controller + '/shiping/' + this.formGroup.value.id))
        .subscribe((rs)=>{
            this.listStatus = rs.data;
        })
        this.formGroup.controls.payment.disable({emitEvent: true});
        this.changeButton();
    }
    getDate(getDate: any){
        let value = new Date(getDate);
        return value;
    }
    cancel(): void{
        this.api.getApi('Manager/BillManagerController/cancel/' + this.formGroup.value.id).subscribe((rs)=>{
            if(rs.status){
                this.message.SendDataAfterUpdate(rs.data);
                this.api.Notification.notificationExecute(rs);
            }
        })
    }
    confirm(): void{
        this.api.getApi('Manager/BillManagerController/confirm/' + this.formGroup.value.id).subscribe((rs)=>{
            if(rs.status){
                this.message.SendDataAfterUpdate(rs.data);
                this.api.Notification.notificationExecute(rs);
            }
        })
    }
    ship(): void{
        this.api.getApi('Manager/BillManagerController/ship/' + this.formGroup.value.id).subscribe((rs)=>{
            if(rs.status){
                this.message.SendDataAfterUpdate(rs.data);
                this.api.Notification.notificationExecute(rs);
            }
        })
    }
    received(): void{
        this.api.getApi('Manager/BillManagerController/received/' + this.formGroup.value.id).subscribe((rs)=>{
            if(rs.status){
                this.message.SendDataAfterUpdate(rs.data);
                this.api.Notification.notificationExecute(rs);
            }
        })
    }
    refund(): void{
        this.api.getApi('Manager/BillManagerController/refund/' + this.formGroup.value.id).subscribe((rs)=>{
            if(rs.status){
                this.message.SendDataAfterUpdate(rs.data);
                this.api.Notification.notificationExecute(rs);
            }
        })
    }
    changeButton(): void{
        if(this.formGroup.value.status == "HUY"){
            this.isToolbar = false;
        }
        if(this.formGroup.value.status == "CHUA_XAC_NHAN"){
            this.isReceived = false;
            this.isShip = false;
            this.isRefund = false;
        }
        if(this.formGroup.value.status == "DA_XAC_NHAN_VA_DONG_GOI"){
            this.isConfirm = false;
            this.isReceived = false;
            this.isRefund = false;
        }
        if(this.formGroup.value.status == "DA_GIAO_BEN_VAN_CHUYEN"){
            this.isShip = false;
            this.isCancel = false;
            this.isConfirm = false;
            this.isRefund = false;
        }
        if(this.formGroup.value.status == "KHACH_DA_NHAN_HANG"){
            this.isReceived = false;
            this.isShip = false;
            this.isCancel = false;
            this.isConfirm = false;
        }
    }
}