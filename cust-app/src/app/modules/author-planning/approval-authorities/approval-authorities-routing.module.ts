
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Approval Authorities'
        },
        children: [
            {
                path: '',
                loadChildren: () => import('./exam-list/exam-list.module').then(m => m.ExamListModule)
            },
            {
                path: 'exams/:id/manage',
                loadChildren: () => import('./assign-approval-authority/assign-approval-authority.module').then(m => m.AssignApprovalAuthorityModule)
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
export class ApprovalAuthorityRoutingModule { }
