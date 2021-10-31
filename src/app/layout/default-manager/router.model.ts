export const items = [
    { text: 'Dashboard', icon: 'fa fa-home', path: 'dashboard', expanded: false },
    { text: 'Quản lý sản phẩm', icon: 'fa fa-product-hunt', path: 'quan-ly-san-pham', expanded: false },
    {
      text: 'Quản lý danh mục', icon: 'fa fa-list', path: '', expanded: false, children: [
        {
          text: 'Danh much cấp 1',
          path: ''
        },
        {
          text: 'Danh much cấp 2',
          path: ''
        }
      ]
    },
    { text: 'Quản lý tài khoản', icon: 'fa fa-users', path: 'quan-ly-tai-khoan', expanded: false },
    { text: 'Quản lý sản đơn hàng', icon: 'fa fa-check-square', path: 'quan-ly-don-hang', expanded: false },
    { text: 'Quản lý thuộc tính', icon: 'fa fa-tint', path: 'quan-ly-thuoc-tinh', expanded: false },
    { text: 'Quản lý size', icon: 'fa fa-child', path: 'quan-ly-size', expanded: false },
]