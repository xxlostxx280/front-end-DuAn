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
    templateUrl: './windowRecharge.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class WindowRechargeComponent implements OnInit {
    @Input() public dataSource: any;
    @Input() public formGroup !: FormGroup;
    @Input() public status: String | undefined;

    public Dm_Bank: Array<any> = [
        {
            id: 'VNPAYQR',
            name: 'VNPAYQR',
        },
        {
            id: 'MBAPP',
            name: 'MBAPP',
        },
        {
            id: 'INTCARD',
            name: 'INTCARD',
        },
        {
            id: 'VNBANK',
            name: 'VNBANK',
        },
        {
            id: 'VNPAYEWALLET',
            name: 'VNPAYEWALLET',
        },
        {
            id: 'NCB',
            name: 'Ngan hang NCB',
        },
        {
            id: 'SACOMBANK',
            name: 'Ngan hang SacomBank',
        },
        {
            id: 'EXIMBANK',
            name: 'Ngan hang EximBank',
        },
        {
            id: 'MSBANK',
            name: 'Ngan hang MSBANK',
        },
        {
            id: 'NAMABANK',
            name: 'Ngan hang NamABank',
        },
        {
            id: 'VNMART',
            name: 'Thanh toan qua VISA/MASTER',
        },
        {
            id: 'VIETINBANK',
            name: 'Ngan hang Vietinbank',
        },
        {
            id: 'VIETCOMBANK',
            name: 'Ngan hang VCB',
        },
        {
            id: 'HDBank',
            name: 'Ngan hang HDBank',
        },
        {
            id: 'DONGABANK',
            name: 'Ngan hang Dong A',
        },
        {
            id: 'TPBank',
            name: ' Ngân hàng TPBank',
        },
        {
            id: 'BIDV',
            name: ' Ngân hàng BIDV',
        },
        {
            id: 'Techcombank',
            name: 'Ngân hàng Techcombank',
        },
        {
            id: 'VPBANK',
            name: 'Ngân hàng VPBANK',
        },
        {
            id: 'AGRIBANK',
            name: 'Ngân hàng AGRIBANK',
        },
        {
            id: 'MBBANK',
            name: 'Ngân hàng MBBANK',
        },
        {
            id: 'ACB',
            name: 'Ngân hàng ACB',
        },
        {
            id: 'OCB',
            name: 'Ngân hàng OCB',
        },
    ]
    public defaultItem: { id: string; name: string } = {
        id: '',
        name: 'Choose...',
    };
    public listCustomer: Array<any> = [];
    public getCustomer: any;
    constructor(public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
        private notificationService: NotificationService, private message: MessageService, private formBuilder: FormBuilder, private api: ApiService) { }

    public Customer: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
    public VnPay: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);

    ngOnInit(): void {
        this.VnPay.Controller = "VnpayController";
        this.Customer.isManager = true;
        this.Customer.Controller = "CustomersManagerController";
        this.Customer.Read.Execute().subscribe((rs) => {
            this.listCustomer = rs.data;
            this.getCustomer = this.listCustomer.find((x) => x.idaccount == sessionStorage.getItem('USER_ID'));
        })
    }

    recharge(): void {
        let data = {
            amount : this.formGroup.value.amount,
            description: this.formGroup.value.description,
            bankcode: this.formGroup.value.bankcode.id,
            language:  this.formGroup.value.language,
        }
        this.VnPay.postApi('Customer/' + this.VnPay.Controller + '/vnpay', data).subscribe((rs) => {
            window.location.href = rs.data;
        })
    }
}