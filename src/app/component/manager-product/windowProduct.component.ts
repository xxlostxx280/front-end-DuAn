import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ApiService } from "src/app/shared/api.service";
import { MessageService } from "src/app/shared/message.service";
@Component({
    selector: "window-info",
    templateUrl: './windowProduct.component.html',
})
export class WindowProductComponent implements OnInit {
    @Input() public dataItem: any;
    public formGroup !: FormGroup;
    constructor(private message: MessageService, private formBuilder: FormBuilder,private api: ApiService) { }

    ngOnInit(): void {
        this.dataItem.description = decodeURIComponent(this.dataItem.description.replace(/\+/g,  " "));
        this.dataItem.descriptionDetail = decodeURIComponent(this.dataItem.descriptionDetail.replace(/\+/g,  " "));
        this.formGroup = this.formBuilder.group({
            name: new FormControl(),
            price: new FormControl(),
            image: new FormControl(),
            description: new FormControl(),
            descriptionDetail: new FormControl()
        })
    }

    saveHandler(event: any):void{
        this.formGroup.value.description = encodeURIComponent(this.formGroup.value.description).replace(/'/g,"%27").replace(/"/g,"%22");
        this.formGroup.value.descriptionDetail = encodeURIComponent(this.formGroup.value.description).replace(/'/g,"%27").replace(/"/g,"%22");
        this.api.Update.UpdateDataWindow('saveProduct',this.formGroup.value).subscribe((res)=>{
            console.log(res);
        });
    }
}