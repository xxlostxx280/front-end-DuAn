import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "../component/dashboard/dashboard.component";
import { ManagerCategoryComponent } from "../component/manager-category/manager-category.component";
import { ManagerProductComponent } from "../component/manager-product/manager-product.component";
import { ManagerPropertyComponent } from "../component/manager-property/manager-property.component";
import { ManagerQuantityComponent } from "../component/manager-quantity/manager-quantity.component";
import { ManagerSizeComponent } from "../component/manager-size/manager-size.component";
import { DefaultManagerComponent } from "../layout/default-manager/default-manager.component";

const routes: Routes = [
    {
        path: 'manager',
        component: DefaultManagerComponent,
        children: [
            {   
                path: 'dashboard',
                component: DashboardComponent
            },
            {   
                path: 'quan-ly-san-pham',
                component: ManagerProductComponent
            },
            {   
                path: 'quan-ly-size',
                component: ManagerSizeComponent
            },
            {   
                path: 'quan-ly-danh-muc',
                component: ManagerCategoryComponent
            },
            {   
                path: 'quan-ly-thuoc-tinh',
                component: ManagerPropertyComponent
            },
            {   
                path: 'quan-ly-so-luong',
                component: ManagerQuantityComponent
            },
        ]
    }
]
@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule]
})
export class ManagerRoutingModule{}