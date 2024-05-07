import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageExamShiftsComponent } from './manage-exam-shifts.component';


const routes: Routes = [
    {
        path: '',
        data: {
            title: ''
        },
        children: [
            {
                path: '',
                component: ManageExamShiftsComponent,
                data: {
                    title: 'Manage Exam Shifts Component'
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
export class ManageExamShiftsRoutingModule { }
