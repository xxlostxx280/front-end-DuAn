import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogCloseResult, WindowCloseResult, WindowRef, WindowService } from '@progress/kendo-angular-dialog';
import { DialogService } from "@progress/kendo-angular-dialog";
import { QuanityModel } from 'src/app/component/product-details/quantity.model';
import { ApiService } from 'src/app/shared/api.service';
import { MessageService } from 'src/app/shared/message.service';
import { DialogInfoProductComponent } from 'src/app/layout/shopping-cart/infoProductDialog.component'
import { DialogLoginComponent } from './loginDialog.component';
import { NotificationService } from '@progress/kendo-angular-notification';
import { HttpClient } from '@angular/common/http';
import { ApiVietNam, BillModel } from './bill.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  @ViewChild("appendTo", { read: ViewContainerRef })
  public opened = false;
  public appendTo: ViewContainerRef | undefined;
  public dataSource: Array<any> = [];
  public loading = false;
  public key = Object.keys(localStorage);
  public badge = localStorage.length;
  public infoProduct: any;
  private dialog: any;
  public total: number = 0;
  public toMoney: number = 0;
  public newPrice: number = 0;
  public isDiscount = false;
  public isPayment = false;
  public listProvince: Array<any> = ApiVietNam;
  public listDistrict: Array<any> = [];
  public listWards: Array<any> = [];
  public oldAddress: Array<any> = [];
  public myWallet: any;
  public selectedValue = null;
  public totalShipping = 30000;
  public steps = [
    { label: "Bước 1", index: 0 },
    { label: "Bước 2", index: 1, disabled: true },
    { label: "Bước 3", index: 2, disabled: true },
  ];
  public current = 0;
  public stepType = 'full';
  public step_1: boolean = true;
  public step_2: boolean = true;
  public step_3: boolean = true;

  public listImageProduct: Array<any> = [];
  public listTypeSize: Array<any> = [];
  public listSize: Array<any> = [];
  public listProductByCategory: Array<any> = [];
  public listProductByQuantity: Array<any> = [];
  public listProperty: Array<any> = [];
  public listVoucher: Array<any> = [];
  public QuantityObj: QuanityModel = new QuanityModel();
  public BillObj: BillModel = new BillModel();

  public formGroup = new FormGroup({
    property: new FormControl(),
    size: new FormControl(),
  });
  public InfomationCustomer = new FormGroup({
    FullName: new FormControl('', Validators.required),
    PhoneNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10)]),
    Province: new FormControl('', Validators.required),
    District: new FormControl('', Validators.required),
    Wards: new FormControl('', Validators.required),
    Hamlet: new FormControl('', Validators.required),
    Address: new FormControl('', Validators.required),
    Note: new FormControl(),
  })
  public Address = new FormGroup({
    Province: new FormControl('', Validators.required),
    District: new FormControl('', Validators.required),
    Wards: new FormControl('', Validators.required),
    Hamlet: new FormControl('', Validators.required),
  })
  public Payment = new FormGroup({
    payment: new FormControl('cash'),
  })
  public defaultVoucher: any = {
    name: "Chọn Voucher...",
    id: null,
  };

  constructor(public api: ApiService, private message: MessageService, public http: HttpClient, private windowService: WindowService, private dialogService: DialogService,
    private notificationService: NotificationService, private formBuilder: FormBuilder, private cdref: ChangeDetectorRef) { }

  public Quantity: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public Property: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public Size: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public Voucher: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public Customer: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);
  public Account: ApiService = new ApiService(this.http, this.windowService, this.dialogService, this.notificationService, this.message, this.formBuilder);

  ngOnInit(): void {
    this.step_2 = false;
    this.step_3 = false;
    this.Quantity.Controller = "QuantityController";
    this.Property.Controller = "PropertyController";
    this.Size.Controller = "SizeController";
    this.Voucher.Controller = "VoucherController";
    this.Customer.Controller = "CustomerController";

    this.Quantity.Read.Execute().subscribe((rs) => {
      this.Quantity.dataSource = rs.data;
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api.Notification.notificationError('');
      }
    })
    this.Voucher.getApi('Customer/' + this.Voucher.Controller + '/findVoucherByAmount').subscribe((rs) => {
      this.Voucher.dataSource = rs.data;
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api.Notification.notificationError('');
      }
    })
    if (sessionStorage.getItem('Account') != null || sessionStorage.getItem('Account') != undefined) {
      this.Customer.getApi('Customer/' + this.Customer.Controller + '/' + sessionStorage.getItem('Account')).subscribe((rs) => {
        let getAddress = rs.data.address.split(',');
        this.InfomationCustomer.controls.FullName.setValue(rs.data.fullname);
        this.InfomationCustomer.controls.Address.setValue(rs.data.address);
        this.Address.controls.Province.setValue(rs.data);
      }, (error) => {
        if (error.status == 500) {
          let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
          window.location.href = "/login/" + id;
        } else {
          this.api.Notification.notificationError('');
        }
      })
      this.Account.getApi('api/account/' + sessionStorage.getItem('Account')).subscribe((rs) => {
        this.InfomationCustomer.controls.PhoneNumber.setValue(rs.data.phone);
      }, (error) => {
        if (error.status == 500) {
          let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
          window.location.href = "/login/" + id;
        } else {
          this.api.Notification.notificationError('');
        }
      })
      this.api.getApi('api/bill/get-address').subscribe((rs) => {
        this.oldAddress = rs.data;
      }, (error) => {
        if (error.status == 500) {
          let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
          window.location.href = "/login/" + id;
        } else {
          this.api.Notification.notificationError('');
        }
      })
      this.api.getApi('Customer/MamiPayController/mamipay').subscribe((rs) => {
        this.myWallet = rs.data;
      }, (error) => {
        if (error.status == 500) {
          let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
          window.location.href = "/login/" + id;
        } else {
          this.api.Notification.notificationError('');
        }
      })
    }

    this.key.map((x: any) => {
      let data: any = localStorage.getItem(x);
      let value = JSON.parse(data);
      this.dataSource.push(value);
    })
    this.dataSource.map((x) => {
      this.total = this.total + Number(x.newPrice * x.Quantity);
      this.toMoney = this.toMoney + Number(x.newPrice * x.Quantity);
    })
    this.toMoney = this.toMoney + this.totalShipping;

    this.message.receivedStorageCart().subscribe((res) => {
      this.Voucher.getApi('Customer/' + this.Voucher.Controller + '/findVoucherByAmount').subscribe((rs) => {
        this.Voucher.dataSource = rs.data;
        this.listVoucher = this.Voucher.dataSource.filter((x) => x.minimumValue <= this.total);
      }, (error) => {
        if (error.status == 500) {
          let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
          window.location.href = "/login/" + id;
        } else {
          this.api.Notification.notificationError('');
        }
      })
      this.dataSource = [];
      this.BillObj.voucher_id = '';
      this.BillObj.discount = '';
      this.selectedValue = null;
      this.key.map((x: any) => {
        let data: any = localStorage.getItem(x);
        let value = JSON.parse(data);
        this.dataSource.push(value);
      })
      let same_cart = this.dataSource.filter((x: any) => {
        if (x.Product.id == res.Product.id &&
          x.Property.idproperty == res.Property.idproperty &&
          x.Size.id == res.Size.id) {
          return res;
        } else {
          return null;
        }
      });
      if (same_cart.length == 2) {
        this.total = this.total - Number(parseInt(same_cart[0].newPrice) * parseInt(same_cart[0].Quantity));
        this.toMoney = this.toMoney - Number(parseInt(same_cart[0].newPrice) * parseInt(same_cart[0].Quantity)) + this.totalShipping;
        localStorage.removeItem(this.dataSource[0].Id);
        this.message.SendBadgeCart(localStorage.length);
        this.dataSource.splice(this.dataSource.indexOf(this.dataSource[0]), 1);
        this.notificationService.show({
          appendTo: this.appendTo,
          content: "Chúng tôi đã xóa 1 sản phẩm trong giỏ hàng của bạn vì bạn đã sửa sản phẩm trùng với sản phẩm đã có trong giỏ hàng",
          animation: { type: "fade", duration: 500 },
          position: { horizontal: "right", vertical: "top" },
          type: { style: "success", icon: true },
        });
      } else {
        this.total = 0;
        this.toMoney = 0;
        this.dataSource.map((x) => {
          this.total = this.total + Number(parseInt(x.newPrice) * parseInt(x.Quantity));
          this.toMoney = this.toMoney + Number(x.newPrice * x.Quantity)
        })
        this.toMoney =  this.toMoney + this.totalShipping;
      }
    })
  }
  Rules(): boolean {
    if (this.InfomationCustomer.controls.FullName.errors != null) {
      this.api.Notification.notificationWarning('Thông tin nhận hàng đang sai mời bạn điền lại');
      return false;
    }
    if (this.InfomationCustomer.controls.PhoneNumber.errors != null) {
      this.api.Notification.notificationWarning('Thông tin nhận hàng đang sai mời bạn điền lại');
      return false;
    }
    if (this.InfomationCustomer.value.Address == "") {
      this.api.Notification.notificationWarning('Không được để trống địa chỉ');
      return false;
    }
    return true;
  }
  ProvinceChange(event: any) {
    this.InfomationCustomer.value.Address = "";
    this.listDistrict = this.listProvince.find((x) => x.Id == event).Districts;
    this.Address.value.Province = this.listProvince.find((x) => x.Id == event).Name;
    this.InfomationCustomer.value.Address = ',' + this.Address.value.Province
  }
  DistrictChange(event: any) {
    this.InfomationCustomer.value.Address = "";
    this.listWards = this.listDistrict.find((x) => x.Id == event).Wards;
    this.Address.value.District = this.listDistrict.find((x) => x.Id == event).Name
    this.InfomationCustomer.value.Address = ',' + this.Address.value.District + ',' + this.Address.value.Province
  }
  WardsChange(event: any) {
    this.InfomationCustomer.value.Address = "";
    this.InfomationCustomer.value.Address = this.listWards.find((x) => x.Id == event).Name + ', ' + this.InfomationCustomer.value.Address;
    this.Address.value.Wards = this.listWards.find((x) => x.Id == event).Name;
    this.InfomationCustomer.value.Address = this.Address.value.Wards + ',' + this.Address.value.District + ',' + this.Address.value.Province
  }
  HamletChange(event: any) {
    this.InfomationCustomer.value.Address = "";
    this.Address.value.Hamlet = event.target.value;
    this.InfomationCustomer.value.Address =
      event.target.value + ', ' + this.Address.value.Wards + ', ' + this.Address.value.District + ', ' + this.Address.value.Province;
  }
  activate(event: any): void {
    if (event.index == 0) {
      this.step_1 = true;
      this.step_2 = false
      this.step_3 = false;
      this.steps[1].disabled = true;
      this.steps[2].disabled = true;
    }
  }
  buyProduct(): void {
    if (sessionStorage.getItem('TOKEN') == null) {
      this.dialog = this.dialogService.open({
        title: "Đăng nhập",
        content: DialogLoginComponent,
        width: 600,
        height: 400,
      });
      const getInfoWindow = this.dialog.content.instance;
      getInfoWindow.dialog = this.dialog;
    } else if (this.dataSource.length == 0) {
      this.api.Notification.notificationError('Trong giỏ hàng không có sản phẩm')
    } else if (this.step_1) {
      if (!this.Rules()) { return; }
      else {
        this.step_1 = false;
        this.step_2 = true;
        this.BillObj.fullname = this.InfomationCustomer.value.FullName;
        this.BillObj.sdt = this.InfomationCustomer.value.PhoneNumber;
        this.BillObj.address = this.InfomationCustomer.value.Address;
        this.BillObj.note = this.InfomationCustomer.value.Note;
        this.current += 1;
        this.steps.map((x) => {
          if (x.index == this.current) {
            x.disabled = false;
          }
        })
      }
    } else if (this.step_2) {
      this.BillObj.statusshipping = "Đang xử lý";
      this.BillObj.username = String(sessionStorage.getItem('USERNAME'));
      if (this.isPayment == true && this.myWallet.surplus < this.toMoney) {
        return this.api.Notification.notificationWarning('Số dư trong ví không đủ để thanh toán đơn')
      }
      if (this.Payment.value.payment == "cash") {
        this.isPayment = false;
        this.BillObj.payment = false;
        this.BillObj.transportFee = 30000;
        this.BillObj.total = this.total;
        this.BillObj.downtotal = this.toMoney;
        this.dataSource.map((x) => {
          let sendRequest = {
            id_quantity: x.IdQuantity,
            bill_quantity: x.Quantity
          }
          this.BillObj.list_quantity.push(sendRequest);
        })
      } else {
        this.isPayment = true;
        this.BillObj.payment = true;
        this.BillObj.transportFee = 0;
        this.BillObj.total = this.total;
        this.BillObj.downtotal = this.toMoney;
        this.dataSource.map((x) => {
          let sendRequest = {
            id_quantity: x.IdQuantity,
            bill_quantity: x.Quantity
          }
          this.BillObj.list_quantity.push(sendRequest);
        })
      }
      this.api.postApi('api/bill/creat', this.BillObj).subscribe((rs) => {
        if (rs.status) {
          this.dataSource.map((x) => {
            localStorage.removeItem(x.Id);
          })
          this.dataSource = [];
          this.total = 0;
          this.toMoney = 0;
          this.totalShipping = 0;
          this.step_2 = false;
          this.step_3 = true;
          this.current += 1;
          this.message.SendBadgeCart(localStorage.length);
        }
      }, (error) => {
        if (error.status == 500) {
          let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
          window.location.href = "/login/" + id;
        } else {
          this.api.Notification.notificationError(error.error.message);
        }
        this.api.loading = false;
      })
    }
  }
  removeCardItem(e: any, data: any, index: any): void {
    this.Voucher.getApi('Customer/' + this.Voucher.Controller + '/findVoucherByAmount').subscribe((rs) => {
      this.Voucher.dataSource = rs.data;
      this.listVoucher = this.Voucher.dataSource.filter((x) => x.minimumValue <= this.total);
    }, (error) => {
      if (error.status == 500) {
        let id = encodeURIComponent('Bạn không có quyền vào trang đó').replace(/'/g, "%27").replace(/"/g, "%22")
        window.location.href = "/login/" + id;
      } else {
        this.api.Notification.notificationError('');
      }
    })
    let removeItem = JSON.parse(String(localStorage.getItem(data)));
    this.BillObj.list_quantity = [];
    this.total = this.total - Number(parseInt(removeItem.newPrice) * parseInt(removeItem.Quantity));
    this.toMoney = this.toMoney - Number(parseInt(removeItem.newPrice) * parseInt(removeItem.Quantity));
    localStorage.removeItem(data);
    this.badge = localStorage.length;
    this.message.SendBadgeCart(this.badge);
    this.dataSource.splice(index, 1);
    this.notificationService.show({
      appendTo: this.appendTo,
      content: "Removed success",
      animation: { type: "fade", duration: 500 },
      position: { horizontal: "right", vertical: "top" },
      type: { style: "success", icon: true },
    });
  }
  infoCardItem(e: any, data: any, index: any): void {
    this.listSize = [];
    this.listProperty = [];
    let info = localStorage.getItem(data);
    this.infoProduct = JSON.parse(String(info));
    this.dialog = this.dialogService.open({
      title: "Thông tin sản phẩm",
      content: DialogInfoProductComponent,
      width: 750,
      height: 500,
    });
    const getInfoWindow = this.dialog.content.instance;
    getInfoWindow.infoProduct = this.infoProduct;
    this.Quantity.getApi('Customer/' + this.Quantity.Controller + '/findQuantityByProduct/' + this.infoProduct.Product.id).subscribe((res) => {
      this.listProductByQuantity = res.data;
      if (res.status) {
        this.Property.Read.Execute().subscribe((rs) => {
          this.listProductByQuantity.map((val: any, idx: any) => {
            let data = rs.data.filter((x: any) => x.idproperty == val.property.idproperty);
            if (data.length > 0) {
              if (this.listProperty.length == 0) {
                this.listProperty.push(data[0]);
              } else {
                let color_same = this.listProperty.filter((x: any) => {
                  if (x.idproperty == data[0].idproperty)
                    return x;
                  else
                    return null;
                });
                if (color_same.length == 0) {
                  this.listProperty.push(data[0]);
                }
              }
            }
          })
          getInfoWindow.listProperty = this.listProperty;
          getInfoWindow.formGroup.controls.property.setValue(String(this.infoProduct.Property.idproperty))
          this.formGroup.controls.property.setValue(String(this.listProperty[0].idproperty));
        })
        this.Size.Read.Execute().subscribe((rs) => {
          this.listProductByQuantity.map((val: any, idx: any) => {
            let data = rs.data.filter((x: any) => x.id == val.size.id);
            if (data.length > 0) {
              if (this.listSize.length == 0) {
                this.listSize.push(data[0]);
              } else {
                let size_same = this.listSize.filter((x: any) => {
                  if (x.id == data[0].id)
                    return x;
                  else
                    return null;
                });
                if (size_same.length == 0) {
                  this.listSize.push(data[0]);
                }
              }
            }
          })
          getInfoWindow.listSize = this.listSize;
          getInfoWindow.formGroup.controls.size.setValue(this.infoProduct.Size)
          this.formGroup.controls.size.setValue(this.listSize[0]);
        })
      }
    })
  }
  changeQuantity(value: any): void {
    this.QuantityObj.Quantity = value;
  }
  selectVoucher(event: any): void {
    this.toMoney = 0;
    this.total = 0;
    if (event.discount == undefined) {
      this.BillObj.voucher_id = '';
      this.BillObj.discount = '';
      this.dataSource.map((x) => {
        this.total = this.total + Number(parseInt(x.newPrice) * parseInt(x.Quantity));
        this.toMoney = this.toMoney + Number(x.newPrice * x.Quantity);
      })
    } else {
      this.BillObj.voucher_id = event.id;
      this.BillObj.discount = event.discount;
      this.dataSource.map((x) => {
        this.total = this.total + Number(parseInt(x.newPrice) * parseInt(x.Quantity));
        this.toMoney = (this.toMoney + Number(x.newPrice * x.Quantity))*(1 - event.discount/100) ;
      })
    }
    this.toMoney = this.toMoney + this.totalShipping;
  }
  PaymentMethodChange(event: any): void {
    if (event.target.value == "cash") {
      this.BillObj.voucher_id = '';
      this.BillObj.discount = '';
      this.toMoney = this.total;
      this.selectedValue = null;
      this.isPayment = false;
      this.totalShipping = 30000;
      this.toMoney = this.total + this.totalShipping
    } else {
      this.listVoucher = this.Voucher.dataSource.filter((x) => x.minimumValue <= this.total);
      this.selectedValue = null;
      this.isPayment = true;
      this.totalShipping = 0;
      this.toMoney = this.total + this.totalShipping
    }
  }

  close(status: any) {
    this.opened = false;
  }
  open(): void {
    this.opened = true;
  }
  valueChange(item: any) {
    this.InfomationCustomer.value.Address = item;
  }
}