import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentreMainComponent } from './centre-main/centre-main.component'

const routes: Routes = [
    {
        path: '',
        data: {
            title: ''
        },
        children: [
            {
                path: '',
                component: CentreMainComponent,
                data: {
                    title: 'CentreMainComponent'
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
export class CentreSetupViewRoutingModule { }
