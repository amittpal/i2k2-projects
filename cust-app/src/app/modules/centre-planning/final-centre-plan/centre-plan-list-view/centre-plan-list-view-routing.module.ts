import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentrePlanListViewComponent } from './centre-plan-list-view.component'

const routes: Routes = [
    {
        path: '',
        data: {
            title: ''
        },
        children: [
            {
                path: '',
                component: CentrePlanListViewComponent,
                data: {
                    title: 'CentrePlanListViewComponent'
                }
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CentrePlanListViewRoutingModule { }
