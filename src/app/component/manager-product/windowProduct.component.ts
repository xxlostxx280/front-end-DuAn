import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { EventManager } from "@angular/platform-browser";
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
    constructor(private message: MessageService, private formBuilder: FormBuilder, private api: ApiService) { }

    ngOnInit(): void {
        this.formGroup.addControl('category', new FormControl());
        if (this.status == "EDIT") {
            this.formGroup.controls.description.setValue(decodeURIComponent(this.dataSource.description.replace(/\+/g, " ")));
            this.formGroup.controls.descriptionDetail.setValue(decodeURIComponent(this.dataSource.descriptionDetail.replace(/\+/g, " ")));
        } else {
            this.disabled = true;
            this.dataSource.categorydetail = this.defaultItem;
            this.formGroup.controls.categorydetail.setValue(this.defaultItem);
        }
        this.getCategory();
    }

    getCategory(): void {
        this.api.Read.Execute('listCategory').subscribe((rs) => {
            this.category = rs;
        })
        this.api.Read.Execute('list-categoryDetail').subscribe((rs) => {
            this.categoryDetail = rs;
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
                this.api.Update.UpdateDataWindow('saveProduct', this.formGroup.value).subscribe((res) => { });
            }
        } else {
            this.addImage();
        }
    }
    addImage(): void {
        const imageData = new FormData();
        imageData.append("file", this.imagePreview[0].rawFile);
        this.api.postApi("uploads", imageData).subscribe((rs) => {
            this.formGroup.value.description = encodeURIComponent(this.formGroup.value.description).replace(/'/g, "%27");
            this.formGroup.value.descriptionDetail = encodeURIComponent(this.formGroup.value.descriptionDetail).replace(/'/g, "%27");
            if (rs.status) {
                this.api.Update.UpdateDataWindow('saveProduct', this.formGroup.value).subscribe((res) => {
                    console.log(res);
                });
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