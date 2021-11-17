import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { EventManager } from "@angular/platform-browser";
import { DialogService, WindowService } from "@progress/kendo-angular-dialog";
import { NotificationService } from "@progress/kendo-angular-notification";
import { SelectEvent } from "@progress/kendo-angular-upload";
import { ApiService } from "src/app/shared/api.service";
import { MessageService } from "src/app/shared/message.service";
@Component({
    selector: "window-info",
    templateUrl: './windowQuantity.component.html',
})
export class WindowQuantityComponent implements OnInit {
    @Input() public dataSource: any;
    @Input() public formGroup !: FormGroup;
    @Input() public status: String | undefined;

    public listTypeSize: Array<any> = [];
    public listProperty: Array<any> = [];
    public listSize: Array<any> = [];
    public listSizeById: Array<any> = [];
    public listProduct: Array<any> = [];
    public defaultItem: { name: string; id: number, typesize: any } = {
        name: "Choose...",
        id: 0,
        typesize: {
            id: 0,
            name: "Choose..."
        }
    };
    public defaultItemProperty: { name: string; id: number } = {
        name: "Choose...",
        id: 0,
    }
    public defaultItemProduct: { name: string; id: number } = {
        name: "Choose...",
        id: 0,
    }

    public disabled = false;

    constructor(private api: ApiService, public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
        private notificationService: NotificationService, private message: MessageService, private formBuilder: FormBuilder) {
    }
    public Quantity: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
    public TypeSize: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
    public Size: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
    public Property: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
    public Product: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
    ngOnInit(): void {
        this.Quantity.typeData = "popup"
        this.Quantity.isManager = true;
        this.TypeSize.isManager = true;
        this.Size.isManager = true;
        this.Property.isManager = true;
        this.Product.isManager = true;
        this.Quantity.Controller = "QuantityManagerController";
        this.TypeSize.Controller = "TypeSizeManagerController";
        this.Size.Controller = "SizeManagerController";
        this.Property.Controller = "PropertyManagerController";
        this.Product.Controller = "ProductManagerController";
        this.TypeSize.Read.Execute().subscribe((rs) => {
            this.listTypeSize = rs.data;
        })
        this.Size.Read.Execute().subscribe((rs) => {
            this.listSize = rs.data;
        })
        this.Property.Read.Execute().subscribe((rs) => {
            this.listProperty = rs.data;
        })
        this.Product.Read.Execute().subscribe((rs) => {
            this.listProduct = rs.data;
        })
        if (this.status == "CREATE") {
            this.disabled = true;
            this.dataSource.size = this.defaultItem;
            this.formGroup.controls.size.setValue(this.defaultItem);
            this.formGroup.controls.property.setValue(this.defaultItemProperty);
        }else{
            this.formGroup.controls.product.setValue([this.formGroup.value.product]);
        }
    }

    selectProperty(event: any): void {

    }
    selectTypeSize(event: any): void {
        this.disabled = false;
        this.formGroup.value.size = this.defaultItem;
        this.listSize = this.listSize.filter((x) => x.typesize.id == event.id);
    }
    selectSize(event: any): void {

    }
    saveHandler(event: any): void {
        let request = {
            product: '',
            property: '',
            quantity: '',
            size: ''
        }
        request.product = this.formGroup.value.product;
        request.property = this.formGroup.value.property;
        request.quantity = this.formGroup.value.quantity;
        request.size = this.formGroup.value.size;
        this.Quantity.Update.Execute(request);
    }
}