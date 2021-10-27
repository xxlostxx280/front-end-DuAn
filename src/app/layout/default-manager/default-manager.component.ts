import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerItem } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-default-manager',
  templateUrl: './default-manager.component.html',
  styleUrls: ['./default-manager.component.css']
})
export class DefaultManagerComponent implements OnInit {
  public expanded = true;
  public items: Array<any> = [
    {text: ''}
  ];
  constructor() {}

  ngOnInit(): void {
    
  }

  signOut(): void {
    sessionStorage.removeItem('USERNAME');
    sessionStorage.removeItem('TOKEN');
  }
}
