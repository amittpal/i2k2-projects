import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrimaryLayoutComponent } from './modules/layout/primary-layout/primary-layout.component';
import { AuthGuard } from './shared/gaurds/authgaurd/auth.gaurd';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    data: {
      title: 'login'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
      }
    ]
  },
  {
    path: '',
    data: {
      title: 'main'
    },
    component: PrimaryLayoutComponent,
    children: [
      {
        path: 'main',
        loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'exam',
        loadChildren: () => import('./modules/exam-planning/plan-exams.module').then(m => m.PlanExamsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'centre',
        loadChildren: () => import('./modules/centre-planning/plan-centres/centre-plan.module').then(m => m.CentrePlanModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'centre/planning/finalize',
        loadChildren: () => import('./modules/centre-planning/final-centre-plan/final-centre-plan.module').then(m => m.FinalCentrePlanModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'question',
        loadChildren: () => import('./modules/exam-planning/question-requirements/question-requirements.module').then(m => m.QuestionRequirementsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'imported',
        loadChildren: () => import('./modules/centre-planning/centre-planning.module').then(m => m.CentrePlanningModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'registration',
        loadChildren: () => import('./modules/registration-planning/registration-planning.module').then(m => m.RegistrationPlanningModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'author',
        loadChildren: () => import('./modules/author-planning/author-planning.module').then(m => m.AuthorPlanningModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'admitcard',
        loadChildren: () => import('./modules/admit-card-Planning/admit-card.module').then(m => m.AdmitCardPlanningModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'changepassword',
        loadChildren: './modules/changepassword/changepassword.module#ChangepasswordModule',
        canActivate: [AuthGuard]
      },
      {
        path: 'packaging',
        loadChildren: () => import('./modules/packages-planning/packages-planning.module').then(m => m.PackagesPlanningModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'candidates',
        loadChildren: () => import('./modules/candidates/candidates.module').then(m => m.CandidatesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'registrations',
        loadChildren: () => import('./modules/registration/registration.module').then(m => m.RegistrationModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'payments',
        loadChildren: () => import('./modules/payments/payments.module').then(m => m.PaymentsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'configuration',
        loadChildren: () => import('./modules/mail-configuation/mail-configuation.module').then(m => m.MailConfiguationModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'edituserprofile',
        loadChildren: './modules/userprofile/userprofile.module#UserprofileModule',
        canActivate: [AuthGuard]
      },
  {
    path: 'jobs',
    loadChildren:'./modules/jobs/jobs.module#JobsModule',
    canActivate: [AuthGuard]
  }
    ]
  },
  {
    path: 'registration/exam/:examId',
    loadChildren: () => import('./modules/registration-planning/registration/registration-add/registration-add.module').then(m => m.RegistrationAddModule)
  },
  {
    path: 'registration/exam/:id/edit',
    loadChildren: () => import('./modules/registration-planning/registration/registration-edit/registration-edit.module').then(m => m.RegistrationEditModule)
  },
  {
    path: 'registration/complete',
    loadChildren: () => import('./modules/registration-planning/registration/registration-complete/registration-complete.module').then(m => m.RegistrationCompleteModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
