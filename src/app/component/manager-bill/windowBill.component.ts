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

    constructor(public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
        private notificationService: NotificationService, private message: MessageService, private formBuilder: FormBuilder, private api: ApiService) { }
    
    public OrderDetail: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
    
    ngOnInit(): void {
        this.OrderDetail.isManager = true;
        this.OrderDetail.Controller = "OrderDetailManagerController";
        this.OrderDetail.getApi('Manager/' + this.OrderDetail.Controller + '/' + this.formGroup.value.id).subscribe((rs)=>{
            this.listOrderDetail = rs;
        })
        this.formGroup.controls.payment.disable({emitEvent: true});
    }

}