
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Author Planning'
    },
    children: [
     {
        path: 'imported',
        loadChildren: () => import('./imported-authors/imported-authors-list/author-planning-list.module').then(m => m.AuthorPlanningListModule)
      },

      {
        path: 'imported/:id',
        loadChildren: () => import('./imported-authors/imported-authors-view/imported-authors-view.module').then(m=>m.ImportedAuthorsViewModule)
      },
      {
        path: 'import',
        loadChildren: () => import('./import-authors/import-authors/import-authors.module').then(m => m.ImportAuthorsModule)
      },
      {
        path: 'assignments/exams/:id/manage',
        loadChildren: () => import('./question-assignments/question-assignments-list/manage-exam-shifts/manage-exam-shifts.module').then(m => m.ManageExamShiftsModule)
      },
      {
        path: 'assignments/exams/:id/shifts/:shiftNo/language/:language_guid/primary/:primary/manage',
        loadChildren: () => import('./question-assignments/question-assignments-list/manage-question-assignments/manage-question-assignments.module').then(m => m.ManageQuestionAssignmentsModule)
      },
      {
        path: 'assignments/:id/exams/:examId/shifts/:shiftNo/language/:language_guid/primary/:primary/manage/question',
        loadChildren: () => import('./question-assignments/question-assignments-list/assign-questions/assign-questions.module').then(m => m.AssignQuestionModule)
      },
      {
        path: 'assignments',
        loadChildren: () => import('./question-assignments/question-assignments-list/question-assignments-list/question-assignments-list.module').then(m => m.QuestionAssignmentListModule)
      },
      {
        path: 'questions',
        loadChildren: () => import('./authoring-questions/authoring-questions.module').then(m => m.AuthoringQuestionsModule)
      },
      {
        path: 'approval/authority',
        loadChildren: () => import('./approval-authorities/approval-authorities.module').then(m => m.ApprovalAuthoritiesModule)
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
export class AuthorPlanningRoutingModule { }
