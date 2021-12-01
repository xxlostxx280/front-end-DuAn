import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EventManager } from "@angular/platform-browser";
import { DialogService, WindowService } from "@progress/kendo-angular-dialog";
import { NotificationService } from "@progress/kendo-angular-notification";
import { FileInfo, SelectEvent } from "@progress/kendo-angular-upload";
import { State } from "@progress/kendo-data-query";
import { ApiService } from "src/app/shared/api.service";
import { MessageService } from "src/app/shared/message.service";
@Component({
    selector: "window-info",
    templateUrl: './windowUpload.component.html',
})
export class WindowUploadComponent implements OnInit {
    @Input() public dataSource: any;
    @Input() public status: String | undefined;

    public formGroup = new FormGroup({
        idProduct: new FormControl(),
        files: new FormControl('',Validators.required)
    })
    public imagePreview: any[] = [];
    public state: State = {
        filter: undefined,
        skip: 0,
        take: 5,
        group: [],
        sort: [],
      };

    constructor(public api: ApiService){}

    ngOnInit(): void {

    }
    saveHandler(event: any): void {
        event.preventDefault();
        
    }
    select(e: SelectEvent): void {
        this.imagePreview = e.files;
    }
}