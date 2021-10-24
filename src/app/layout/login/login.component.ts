import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from "@progress/kendo-angular-notification";
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';
import { UserModel } from './user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild("appendTo", { read: ViewContainerRef })
  public appendTo: ViewContainerRef | undefined;
  public showAvartar = true;
  public loaderVisible = false;
  public userForm !: FormGroup;
  public accountModel: UserModel = new UserModel();
  constructor(private formBuilder: FormBuilder, private api: ApiService, private notificationService: NotificationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      username: [''],
      password: [''],
    })
  }
  getAccount() {
    this.loaderVisible = true;
    this.accountModel.username = this.userForm.value.username;
    this.accountModel.password = this.userForm.value.password;
    this.api.postApi('api/auth/login', this.accountModel).subscribe((res) => {
      if (res.status == true) {
        sessionStorage.setItem('USERNAME', res.data.username);
        sessionStorage.setItem('TOKEN', res.data.token);
        window.location.href = "/";
        this.loaderVisible = false;
      } else {
        this.loaderVisible = false;
        if (res.message == "Mật khẩu sai")
          this.notificationService.show({
            appendTo: this.appendTo,
            content: res.message,
            animation: { type: "fade", duration: 500 },
            position: { horizontal: "right", vertical: "top" },
            type: { style: "error", icon: true },
          });
        else
          this.notificationService.show({
            appendTo: this.appendTo,
            content: res.message,
            animation: { type: "fade", duration: 500 },
            position: { horizontal: "right", vertical: "top" },
            type: { style: "warning", icon: true },
          });
      }
    })
  }
}
