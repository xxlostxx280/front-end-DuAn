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
    templateUrl: './windowProduct.component.html',
})
export class WindowProductComponent implements OnInit {
    @Input() public dataSource: any;
    @Input() public formGroup !: FormGroup;
    @Input() public status: String | undefined;
    public category: Array<any> = [];
    public categoryDetail: Array<any> = [];
    public CategoryDetailById: any;
    public defaultItem: { name: string; id: number, category: any } = {
        name: "Choose...",
        id: 0,
        category: {
            name: "Choose...",
            id: 0,
        }
    };
    public disabled = false;
    public imagePreview: any[] = [];
    constructor(public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
        private notificationService: NotificationService, private message: MessageService, private formBuilder: FormBuilder, private api: ApiService) { }

    public Category: ApiService = new ApiService(this.http,this.windowService,this.dialogService,this.notificationService,this.message,this.formBuilder);
    public CategoryDetail: ApiService = new ApiService(this.http,this.windowService,this.dialogService,this.notificationService,this.message,this.formBuilder);

    ngOnInit(): void {
        this.Category.Controller = "CategoryManagerController";
        this.CategoryDetail.Controller = "CategoryDetailManagerController";
        this.Category.isManager = true;
        this.CategoryDetail.isManager = true;
        this.api.typeData = "popup";
        this.formGroup.addControl('category', new FormControl());
        if (this.status == "EDIT") {
            if(this.formGroup.value.description != null){
                this.formGroup.controls.description.setValue(decodeURIComponent(this.dataSource.description.replace(/\+/g, " ")));
            }else if(this.formGroup.value.descriptionDetail != null){
                this.formGroup.controls.descriptionDetail.setValue(decodeURIComponent(this.dataSource.descriptionDetail.replace(/\+/g, " ")));
            }
        } else {
            this.disabled = true;
            this.dataSource.categorydetail = this.defaultItem;
            this.formGroup.controls.categorydetail.setValue(this.defaultItem);
        }
        this.getCategory();
    }

    getCategory(): void {
        this.Category.Read.Execute().subscribe((rs) => {
            this.category = rs.data;
        })
        this.CategoryDetail.Read.Execute().subscribe((rs) => {
            this.categoryDetail = rs.data;
        })
    }

    saveHandler(event: any): void {
        event.preventDefault();
        this.formGroup.removeControl('category');
        if (this.status == "EDIT") {
            if(this.imagePreview.length > 0){
                this.addImage();
            }
            else{
                this.formGroup.value.description = encodeURIComponent(this.formGroup.value.description).replace(/'/g, "%27");
                this.formGroup.value.descriptionDetail = encodeURIComponent(this.formGroup.value.descriptionDetail).replace(/'/g, "%27");
                this.api.Update.Execute(this.formGroup.value);
            }
        } else {
            this.addImage();
        }
    }
    addImage(): void {
        const imageData = new FormData();
        imageData.append("file", this.imagePreview[0].rawFile);
        this.api.postApi("Manager/ProductManagerController/uploads", imageData).subscribe((rs) => {
            this.formGroup.value.description = encodeURIComponent(this.formGroup.value.description).replace(/'/g, "%27");
            this.formGroup.value.descriptionDetail = encodeURIComponent(this.formGroup.value.descriptionDetail).replace(/'/g, "%27");
            if (rs.status) {
                this.api.Update.Execute(this.formGroup.value);
            }
        });
    }
    select(e: SelectEvent): void {
        this.imagePreview = e.files;
    }
    selectCategory(event: any): void {
        this.disabled = false;
        this.formGroup.value.categorydetail = this.defaultItem;
        this.CategoryDetailById = this.categoryDetail.filter((x) => x.category.id == event.id);
    }
    selectCategoryDetail(event: any): void {

    }
}