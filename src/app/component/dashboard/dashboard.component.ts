import { Component, Input, ElementRef, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, NgZone } from '@angular/core';
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public current = 0;
  public chart: any;
  public status: any;
  public date = new Date();
  public series: Array<any> = [];
  public chartDayOfMonth: Array<any> = [];
  public chartMonthOfYear: Array<any> = [];
  public listStatus: Array<{ id: any, name: string }> = [
    {
      id: 0,
      name: "CHUA_XAC_NHAN"
    },
    {
      id: 1,
      name: "DA_XAC_NHAN_VA_DONG_GOI"
    },
    {
      id: 2,
      name: "DA_GIAO_BEN_VAN_CHUYEN"
    },
    {
      id: 3,
      name: "KHACH_DA_NHAN_HANG"
    },
    {
      id: 4,
      name: "HOAN_HANG"
    },
    {
      id: 5,
      name: "HUY"
    },
  ]
  constructor(public api: ApiService) { }
  ngOnInit(): void {
    this.api.Controller = "StatisController";
    this.Read();
  }

  Read(): void {
    if (this.current == 0) {
      for (let i = 0; i < this.listStatus.length; i++){
        let status = this.listStatus[i].name;
        this.getDataDayOfMonth(this.date.getMonth() + 1,this.date.getFullYear(),status);
      }
    }
    if (this.current == 1) {
      for (let i = 0; i < this.listStatus.length; i++){
        let status = this.listStatus[i].name;
        this.getDataMonthOfYear(this.date.getFullYear(),status);
      }
    }
  }
  getDataDayOfMonth(month: any, year: any, status: any): void {
    this.api.getApi('Manager/' + this.api.Controller + '/getEveryDayOfTheMonth?month=' + month + '&year=' + year + '&status=' + status)
      .subscribe((rs) => {
        this.chartDayOfMonth = [];
        rs.data.map((val: any, idx: any) => {
          let day = new Date(val.day).getDate();
          let chartDayOfMonth = {
            day: day,
            status: status,
            total: val.total
          }
          this.chartDayOfMonth.push(chartDayOfMonth);
        })
        let arr = groupBy(this.chartDayOfMonth, [{ field: "status" }]) as GroupResult[];
        this.series.push(arr[0]);
      }, (error) => {
        if (error.status == 500) {
          let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
          window.location.href = "/login/" + id;
        } else {
          this.api.Notification.notificationError('');
        }
      })
  }
  getDataMonthOfYear(year: any, status: any) {
    this.api.getApi('Manager/' + this.api.Controller + '/getEveryMonthOfTheYear?year=' + year + '&status=' + status)
      .subscribe((rs) => {
        this.chartMonthOfYear = [];
        rs.data.map((val: any) => {
          let chartMonthOfYear = {
            month: val.month,
            status: status,
            total: val.total
          }
          this.chartMonthOfYear.push(chartMonthOfYear);
        })
        let arr = groupBy(this.chartMonthOfYear, [{ field: "status" }]) as GroupResult[];
        this.series.push(arr[0]);
      }, (error) => {
        if (error.status == 500) {
          let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
          window.location.href = "/login/" + id;
        } else {
          this.api.Notification.notificationError(error.error.message);
        }
      })
  }

  onSelect(event: any): void {
    if (event.index == 0) {
      this.series = [];
      this.chartDayOfMonth = [];
      this.current = event.index;
    }
    if (event.index == 1) {
      this.series = [];
      this.chartMonthOfYear = [];
      this.current = event.index;
    }
    this.Read();
  }
  
  onChangeDate(event: any): void {
    this.date = event;
    if (this.current == 0) {
      this.series = [];
      this.chartDayOfMonth = [];
    }
    if (this.current == 1) {
      this.series = [];
      this.chartMonthOfYear = [];
    }
    this.Read();
  }
}