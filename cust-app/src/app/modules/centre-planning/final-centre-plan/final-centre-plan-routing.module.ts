import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Centre'
        },
        children: [
            {
                path: '',
                loadChildren: () => import('./centre-plan-list-view/centre-plan-list-view.module').then(m => m.CentrePlanListViewModule)
            },
            {
                path: 'registrations/:examId/snapshots/:snapShotId/setup',
                loadChildren: () => import('./centre-setup-view/centre-setup-view.module').then(m => m.CentreSetupViewModule)
            }
        ]
    }
];


@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class FinalCentrePlanRoutingModule { }
