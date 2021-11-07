import { Component, ElementRef, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EditService, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';
import { WindowProductComponent } from './windowProduct.component';

@Component({
  selector: 'app-manager-product',
  templateUrl: './manager-product.component.html',
  styleUrls: ['./manager-product.component.css']
})
export class ManagerProductComponent implements OnInit {
  // @ViewChild('datalist',{read: ElementRef}) public datalist !: ElementRef;

  public gridData: Array<any> = [];
  public method: any;
  constructor(private api: ApiService, private message: MessageService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.api.isManager = true;
    this.api.Controller = "ProductManagerController";
    this.api.OpenWindow.Width = 1200;
    this.api.Read.Execute().subscribe((rs) => {
      this.api.dataSource = rs.data;
      this.gridData = rs.data;
    })
    this.message.receivedDataAfterUpadte().subscribe((res) => {
      if (res.status) {
        this.gridData = this.api.dataSource;
      }
    })
  }
  saveHandler(event: any) {

  }
  addHanler(event: any) {
    this.api.Create.Execute(WindowProductComponent, this.gridData[0]);
  }
  editHandler(event: any) {
    this.api.Edit.Execute(WindowProductComponent, event);
  }
  removeHandler(event: any) {

  }
}
