import { Component, ElementRef, Inject, OnInit, ViewChild,AfterViewInit } from '@angular/core';
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
  public view: Observable<GridDataResult> | undefined;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };
  public productForm!: FormGroup;

  private editService!: EditService;
  editedRowIndex: any;

  constructor(private api: ApiService,private message: MessageService,private formBuilder: FormBuilder) {
  }

  // ngAfterViewInit() {
  //   this.datalist.nativeElement.insertAdjacentHTML('afterend',this.api.Grid.template)
  //   console.log(this.datalist.nativeElement.innerHTML);
  // }
  
  ngOnInit(): void {
    this.api.Controller = "ProductController";
    this.api.OpenWindow.Width = 1200;
    this.api.Read.ReadData('list-product').subscribe((rs)=>{
      this.gridData = rs.data;
    })
    this.productForm = this.formBuilder.group({
      name: new FormControl(''),
      price: new FormControl(''),
      categoryDetail: new FormControl(''),
      description: new FormControl(''),
      descriptionDetail: new FormControl(''),
      image: new FormControl('')
    })
    this.message.receivedDataAfterUpadte().subscribe((res)=>{
      if(res.status){
        this.gridData.push(res.data);
      }
    },(err)=>{

    })
  }
  saveHandler(event: any){
    
  }
  addHanler(event: any){
    this.api.Create.Default(WindowProductComponent,this.productForm.value);
  }
  editHandler(event: any) {
    this.api.Edit.Default(WindowProductComponent,event.dataItem);
  }
  removeHandler(event: any){
    
  }
}
