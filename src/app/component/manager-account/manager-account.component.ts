import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-manager-account',
  templateUrl: './manager-account.component.html',
  styleUrls: ['./manager-account.component.css']
})
export class ManagerAccountComponent implements OnInit {
  public gridData: Array<any> = [];
  public isAdmin = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    phone: new FormControl(''),
    role: new FormControl(false)
  })
  constructor(public api: ApiService, private message: MessageService) { }

  ngOnInit(): void {
    this.api.Controller = "AccountManagerController";
    this.api.isManager = true;
    this.api.Read.Execute().subscribe((rs) => {
      this.gridData = rs.data;
      this.api.dataSource = rs.data
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api.Notification.notificationError('');
      }
    })
    this.message.receivedDataBehavior().subscribe((rs) => {
      this.gridData = rs;
    })
    this.message.receivedDataAfterUpadte().subscribe((rs) => {
      this.gridData = rs.data;
      this.api.dataSource = rs.data;
    })
  }
  Rules(): boolean{
    this.api.formGroup.controls.email.setValidators([Validators.email]);
    this.api.formGroup.controls.password.setValidators([Validators.minLength(6)]);
    if(this.api.formGroup.value.email == ""){
      this.api.Notification.notificationWarning('Không được để trống email');
      return false;
    }
    if(this.api.formGroup.controls.email.errors){
      this.api.Notification.notificationWarning('Sai định dạng email');
      return false;
    }
    if(this.api.formGroup.value.username == ""){
      this.api.Notification.notificationWarning('Không được để trống username');
      return false;
    }
    if(this.api.formGroup.value.password == ""){
      this.api.Notification.notificationWarning('Không được để trống password')
      return false;
    }
    if(this.api.formGroup.controls.password.hasError('minlength')){
      this.api.Notification.notificationWarning('Mật khẩu phải hơn 6 ký tự')
      return false;
    }
    if(this.api.formGroup.value.phone == ""){
      this.api.Notification.notificationWarning('Không được để trống SDT');
      return false;
    }
    if(this.api.formGroup.controls.phone.hasError('maxlength') || this.api.formGroup.controls.phone.hasError('minlength')){
      this.api.Notification.notificationWarning('SDT phải có đủ 10 ký tự');
      return false;
    }
    return true;
  }
  Update(grid: any): void {
    if(!this.Rules()){return;}
    this.api.postApi('',this.isAdmin.value).subscribe((rs)=>{
      
    })
  }

  addHandler(event: any): void {
    this.api.Create.Execute(null, event.sender.data.data);
    event.sender.addRow(this.api.formGroup);
  }
  saveHandler(event: any) {
    if(!this.Rules()){return;}
    this.api.Grid.saveHandler(event);
    event.sender.closeRow(event.rowIndex);
  }
  cellClickHandler(event: any): void {
    this.api.Grid.cellClickHandler(event);
  }
  cellCloseHandler(event: any): void {
    if(!this.Rules()){return;}
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
  changeIsAdmin(event: any): void{
    let e = event;
  }
}
