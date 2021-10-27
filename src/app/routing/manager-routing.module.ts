import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "../component/dashboard/dashboard.component";
import { ManagerProductComponent } from "../component/manager-product/manager-product.component";
import { DefaultManagerComponent } from "../layout/default-manager/default-manager.component";

const routes: Routes = [
    {
        path: 'manager',
        component: DefaultManagerComponent,
        children: [
            {   
                path: '',
                component: DashboardComponent
            },
            {   
                path: 'Quan-ly-san-pham',
                component: ManagerProductComponent
            }
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