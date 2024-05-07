import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrimaryLayoutComponent } from './modules/layout/primary-layout/primary-layout.component';
import { AuthGuard } from './shared/gaurds/authgaurd/auth.gaurd';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'main'
    },
    component: PrimaryLayoutComponent,
    children: [
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
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'registration',
        loadChildren: () => import('./modules/registration/registration.module').then(m => m.RegistrationModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'admitcard',
        loadChildren: () => import('./modules/admit-card-preview/admit-card-preview.module').then(m => m.AdmitCardPreviewModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'change-password',
        loadChildren: () => import('./modules/change-password/change-password.module').then(m => m.ChangePasswordModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'registration-guidelines',
        loadChildren: () => import('./modules/instructions-and-guidelines/registration-guidelines/registration-guidelines.module').then(m => m.RegistrationGuidelinesModule)        
      },
      {
        path: 'important-dates',
        loadChildren: () => import('./modules/instructions-and-guidelines/important-dates/important-dates.module').then(m => m.ImportantDatesModule)        
      },
      {
        path: 'contact-us',
        loadChildren: () => import('./modules/instructions-and-guidelines/contact-us/contact-us.module').then(m => m.ContactUsModule)        
      },
      {
        path: 'helpline',
        loadChildren: () => import('./modules/instructions-and-guidelines/admission-helpline/helpline/helpline.module').then(m => m.HelplineModule)        
      },
      {
        path: 'faq',
        loadChildren: () => import('./modules/instructions-and-guidelines/admission-helpline/faq/faq.module').then(m => m.FaqModule)        
      },
      
    ],    
  },
  {
    path: 'exam-preview',
    loadChildren: () => import('./modules/exam-dashboard/exam-dashboard.module').then(m => m.ExamDashboardModule),
    canActivate: [AuthGuard]
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
