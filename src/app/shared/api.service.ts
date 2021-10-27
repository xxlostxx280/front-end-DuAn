import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { DialogService, WindowService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import { MessageService } from './message.service';

const CREATE_ACTION = "create";
const UPDATE_ACTION = "update";
const REMOVE_ACTION = "destroy";
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public Controller: String | undefined;
  public isNew = true;
  constructor(private http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
    private notificationService: NotificationService,private message: MessageService) {

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
    top: -50,
    left: -120,
    WindowData: function (component: any,data: any) {
      let windowRef = this._.windowService.open({
        title: this.title,
        content: component,
        width: this.Width,
        height: this.Height,
        top: this.top,
        left: this.left
      })
      const getInfoWindow = windowRef.content.instance;
      getInfoWindow.dataItem = data;
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
          content: '',
          animation: { type: "fade", duration: 800 },
          type: { style: 'error', icon: true },
          position: { horizontal: 'right', vertical: 'top'}
        })
      }
    }
  }
  public Edit = {
    _: this,
    Default: function(component: any,data: any){
      this._.OpenWindow.WindowData(component,data);
    }
  }
  public Create = {
    _: this,    
    Default: function (component: any,data: any) {
      this._.OpenWindow.WindowData(component,data);
    },
  }
  public Read = {
    _: this,
    ReadData: function (url: any) {
      return this._.http.get('http://localhost:8080/' + url)
        .pipe(map((res: any) => {
          return res;
        }))
    },
    ReadAfter: function () { },
  }
  public Update = {
    _: this,
    UpdateDataGrid: function (url: any, data: any) {
      url = "/" + this._.Controller + "/saveAndFlush"; 
      return this._.http.post('http://localhost:8080' + url, JSON.stringify(data)).pipe(map((res: any) => {
        return res;
      }))
    },
    UpdateDataWindow: function (url: any, data: any){
      url = "/" + this._.Controller + "/saveAndFlush"; 
      return this._.http.post('http://localhost:8080' + url, data).pipe(map((res: any) => {
        this._.Notification.notificationData(res);
        this._.message.SendDataAfterUpdate(res);
        return res;
      },(err: any)=>{
        this._.Notification.notificationData(err);
        return err;
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
}
