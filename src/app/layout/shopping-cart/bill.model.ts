export class BillModel {
    username: String = '';
    statusshipping: String = '' ;
    transportFee: number = 0;
    voucher_id: String = '' ;
    discount: String = '' ;
    payment!: boolean | true | false;
    downtotal: number = 0;
    total: number = 0;
    address: String = '' ;
    note: String = '' ;
    fullname: String = '' ;
    sdt: String = '' ;
    list_quantity: Array<any> = [];
}