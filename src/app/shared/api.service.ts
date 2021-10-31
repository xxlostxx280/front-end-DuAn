import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { DialogService, WindowService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { MessageService } from './message.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public Controller: String | undefined;
  public formGroup !: FormGroup;
  public status: String | undefined;
  constructor(private http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
    private notificationService: NotificationService,private message: MessageService,private formBuilder: FormBuilder) {

  }

  getApi(url: any) {
    return this.http.get('http://localhost:8080/' + url)
      .pipe(map((res: any) => {
        return res;
      }))
  }
  postApi(url: any, data: any) {
    return this.http.post('http://localhost:8080/' + url, data)
      .pipe(map((res: any) => {
        return res;
      }))
  } 
  public OpenWindow = {
    _: this,
    title: '',
    Width: 1200,
    Height: 650,
    top: -70,
    left: -120,
    After: function(getInfoWindow: any){
      return getInfoWindow;
    },
    Execute: function (component: any,data: any,status: any) {
      let windowRef = this._.windowService.open({
        title: this.title,
        content: component,
        width: this.Width,
        height: this.Height,
        top: this.top,
        left: this.left
      })
      const getInfoWindow = windowRef.content.instance;
      if(data.dataItem != undefined){
        getInfoWindow.dataSource = data.dataItem;
      }else{
        getInfoWindow.dataSource = this._.formGroup.value;
      }
      getInfoWindow.formGroup = this._.formGroup;
      getInfoWindow.status = status;
      this.After(getInfoWindow);
    },
  }
  public Notification = {
    _: this,
    notificationData: function (data:any) {
      if(data.status){
        this._.notificationService.show({
          cssClass: 'notification-show',
          content: data.message,
          animation: { type: "fade", duration: 800 },
          type: { style: 'success', icon: true },
          position: { horizontal: 'right', vertical: 'top'}
        })
      }else{
        this._.notificationService.show({
          cssClass: 'notification-show',
          content: data.message,
          animation: { type: "fade", duration: 800 },
          type: { style: 'error', icon: true },
          position: { horizontal: 'right', vertical: 'top'}
        })
      }
    }
  }
  public Edit = {
    _: this,
    Default: function(row:any){
      return row;
    },
    Execute: function(component: any,data: any){
      this._.status = "EDIT";
      let arr = Object.keys(data.dataItem);
      this._.formGroup = this._.formBuilder.group({});
      for (let key of arr) {
        this._.formGroup.addControl(key,new FormControl());
        this._.formGroup.controls[key].setValue(data.dataItem[key]);
      }
      this.Default(this._.formGroup.controls)
      this._.OpenWindow.Execute(component, data,"EDIT");
      return;
    }
  }
  public Create = {
    _: this, 
    Default: function(row: any){
      return row;
    },   
    Execute: function (component: any,data: any) {
      this._.status = "CREATE";
      let arr = Object.keys(data);
      this._.formGroup = this._.formBuilder.group({});
      for (let key of arr) {
        this._.formGroup.addControl(key,new FormControl());
        this._.formGroup.controls[key].setValue('');
      }
      this._.OpenWindow.Execute(component,data,"CREATE");
      return;
    },
  }
  public Read = {
    _: this,
    Execute: function (url: any) {
      return this._.http.get('http://localhost:8080/' + url)
        .pipe(map((res: any) => {
          return res;
        }))
    },
    After: function () { },
  }
  public Update = {
    _: this,
    UpdateDataGrid: function (url: any, data: any) {
      url = "http://localhost:8080/" + this._.Controller + "/saveAndFlush"; 
      return this._.http.post(url, JSON.stringify(data)).pipe(map((res: any) => {
        return res;
      }))
    },
    UpdateDataWindow: function (url: any, data: any){
      url = "http://localhost:8080/" + this._.Controller + "/saveAndFlush"; 
      return this._.http.post(url, data).pipe(map((res: any) => {
        if(res.status){
          res.type = this._.status;
          this._.Notification.notificationData(res);
          this._.message.SendDataAfterUpdate(res);
        }else{
          this._.Notification.notificationData(res);
        }
        return res;
      }))
    }
  }
  public Destroy = {
    _: this,
    Destroy: function (data: any, url: any) {
      return this._.http.post('http://localhost:8080/' + url, data).pipe(map((res: any) => {
        
        return res;
      }))
    }
  }
  RunBase(){
    let ui = this;
  }
}
