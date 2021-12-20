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
    @Input() public Base: any;

    public listOrderDetail: Array<any> = [];
    public listStatus: Array<any> = [];
    public isCancel = true;
    public isConfirm = true;
    public isShip = true;
    public isReceived = true;
    public isRefund = true;
    public isToolbar = true;
    public opened = false;
    public isDisabled = true;
    public Reason = new FormGroup({
        status: new FormControl(),
        note: new FormControl(''),
    })
    constructor(public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
        private notificationService: NotificationService, private message: MessageService, private formBuilder: FormBuilder, public api: ApiService) { }

    public OrderDetail: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
    public statusShipping: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);

    ngOnInit(): void {
        this.OrderDetail.isManager = true;
        this.OrderDetail.Controller = "OrderDetailManagerController";
        this.statusShipping.Controller = "BillManagerController";
        this.OrderDetail.getApi('Manager/' + this.OrderDetail.Controller + '/' + this.formGroup.value.id).subscribe((rs) => {
            this.listOrderDetail = rs;
        }, (error) => {
            if (error.status == 500) {
                let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
                window.location.href = "/login/" + id;
            } else {
                this.api.Notification.notificationError('');
            }
        })
        this.statusShipping.getApi(('Manager/' + this.statusShipping.Controller + '/shiping/' + this.formGroup.value.id)).subscribe((rs) => {
            this.listStatus = rs.data;
        }, (error) => {
            if (error.status == 500) {
                let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
                window.location.href = "/login/" + id;
            } else {
                this.api.Notification.notificationError('');
            }
        })
        this.formGroup.controls.payment.disable({ emitEvent: true });
        this.changeButton();
    }
    getDate(getDate: any) {
        let value = new Date(getDate);
        return value;
    }
    cancel(): void {
        this.Base.windowRef.close();
        this.Base.loading = true;
        this.api.getApi('Manager/BillManagerController/cancel/' + this.formGroup.value.id).subscribe((rs) => {
            if (rs.status) {
                this.message.SendDataAfterUpdate(rs.data);
                this.api.Notification.notificationExecute(rs);
                this.Base.loading = false;
            }
        }, (error) => {
            if (error.status == 500) {
                let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
                window.location.href = "/login/" + id;
            } else {
                this.api.Notification.notificationError('');
            }
            this.Base.loading = false;
        })
    }
    confirm(): void {
        this.Base.windowRef.close();
        this.Base.loading = true;
        this.api.getApi('Manager/BillManagerController/confirm/' + this.formGroup.value.id).subscribe((rs) => {
            if (rs.status) {
                this.message.SendDataAfterUpdate(rs.data);
                this.api.Notification.notificationExecute(rs);
                this.Base.loading = false;
            }
        }, (error) => {
            if (error.status == 500) {
                let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
                window.location.href = "/login/" + id;
            } else {
                this.api.Notification.notificationError('');
            }
            this.Base.loading = false;
        })
    }
    ship(): void {
        this.Base.windowRef.close();
        this.Base.loading = true;
        this.api.getApi('Manager/BillManagerController/ship/' + this.formGroup.value.id).subscribe((rs) => {
            if (rs.status) {
                this.message.SendDataAfterUpdate(rs.data);
                this.api.Notification.notificationExecute(rs);
                this.Base.loading = false;
            }
        }, (error) => {
            if (error.status == 500) {
                let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
                window.location.href = "/login/" + id;
            } else {
                this.api.Notification.notificationError('');
            }
            this.Base.loading = false;
        })
    }
    received(): void {
        this.Base.windowRef.close();
        this.Base.loading = true;
        this.api.getApi('Manager/BillManagerController/received/' + this.formGroup.value.id).subscribe((rs) => {
            if (rs.status) {
                this.message.SendDataAfterUpdate(rs.data);
                this.api.Notification.notificationExecute(rs);
                this.Base.loading = false;
            }
        }, (error) => {
            if (error.status == 500) {
                let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
                window.location.href = "/login/" + id;
            } else {
                this.api.Notification.notificationError('');
            }
            this.Base.loading = false;
        })
    }
    refund(): void {
        this.opened = true;
    }
    changeButton(): void {
        if (this.formGroup.value.status == "HUY") {
            this.isToolbar = false;
        }
        if (this.formGroup.value.status == "CHUA_XAC_NHAN") {
            this.isReceived = false;
            this.isShip = false;
            this.isRefund = false;
        }
        if (this.formGroup.value.status == "DA_XAC_NHAN_VA_DONG_GOI") {
            this.isConfirm = false;
            this.isReceived = false;
            this.isRefund = false;
        }
        if (this.formGroup.value.status == "DA_GIAO_BEN_VAN_CHUYEN") {
            this.isShip = false;
            this.isCancel = false;
            this.isConfirm = false;
            this.isRefund = true;
        }
        if (this.formGroup.value.status == "KHACH_DA_NHAN_HANG") {
            this.isReceived = false;
            this.isShip = false;
            this.isCancel = false;
            this.isConfirm = false;
        }
        if (this.formGroup.value.status == "HOAN_HANG") {
            this.isToolbar = false;
        }
    }
    close(): void{
        this.opened = false;
    }
}