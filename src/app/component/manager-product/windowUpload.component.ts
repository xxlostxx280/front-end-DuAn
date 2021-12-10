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
    @Input() public formGroup !: FormGroup;
    @Input() public dataSource: any;
    @Input() public status: String | undefined;

    public imagePreview: any[] = [];
    public state: State = {
        filter: undefined,
        skip: 0,
        take: 5,
        group: [],
        sort: [],
    };

    constructor(public api: ApiService) { }

    ngOnInit(): void {
        this.api.Controller = "RestUploatImgController";
    }
    update(event: any): void {
        event.preventDefault();
        let formData = new FormData();
        if (this.imagePreview.length > 0) {
            for (let i = 0; i < this.imagePreview.length; i++) {
                formData.append("files", this.imagePreview[i].rawFile);
            }
        }
        formData.append("idPro", this.dataSource.id);
        this.api.postApi(('Manager/' + this.api.Controller + "/upload"), formData).subscribe((rs) => {
            let result = rs;
        })
    }
    select(e: SelectEvent): void {
        this.imagePreview = e.files;
    }
    addHandler(event: any): void {
        this.api.Create.Execute(null, event.sender.data.data);
        event.sender.addRow(this.api.formGroup);
    }
    saveHandler(event: any) {
        this.api.Grid.saveHandler(event);
        event.sender.closeRow(event.rowIndex);
    }

    cellClickHandler(event: any): void {
        this.api.Grid.cellClickHandler(event);
    }
    cellCloseHandler(event: any): void {
        this.api.Grid.cellCloseHandler(event);
    }

    removeHandler(event: any): void {
        this.api.Grid.removeHandler(event);
        event.sender.cancelCell();
    }

    cancelChanges(grid: any): void {
        grid.cancelCell();
    }

    cancelHandler(event: any): void {
        event.sender.closeRow(event.rowIndex);
    }
}