import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'AdmitCard'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/layouts.module').then(m => m.LayoutsModule)
      },
      {
        path: 'setup',
        loadChildren: () => import('./setup/setup.module').then(m => m.SetupModule)
      },
      {
        path: 'centres',
        loadChildren: () => import('./admit-card-planning-centres/admit-card-planning-centres.module').then(m => m.AdmitCardPlanningCentresModule)
      },
      {
        path: 'generate',
        loadChildren: () => import('./admit-card-generate/admit-card-generate.module').then(m => m.AdmitCardGenerateModule)
      },
      {
        path: 'publish',
        loadChildren: () => import('./publish/publish.module').then(m => m.PublishModule)
      },
      {
        path: 'registrations',
        loadChildren: () => import('./admit-card/admit-card-registrations/admit-card-registrations.module').then(m => m.AdmitCardRegistrationsModule)
      },
      {
        path: 'registration/:registrationId/snapshot/:snapshotId/manage',
        loadChildren: () => import('./admit-card-generate/manage-admit-card-generate/manage-admit-card-generate.module').then(m => m.ManageAdmitCardGenerateModule)
      },
      {
        path: 'registration/:registrationId/exam/:examGuid/snapshot/:snapshotId',
        loadChildren: () => import('./admit-card-generate/manage-admit-card-view/manage-admit-card-view.module').then(m => m.ManageAdmitCardViewModule)
      },


      {
        path: 'centre/registrations',
        loadChildren: () => import('./admit-card-centre-registrations/admit-card-centre-registrations.module').then(m => m.AdmitCardCentreRegistrationsModule)
      },
      {
        path: 'registration/:registrationId/snapshot/:snapshotId/exams',
        loadChildren: () => import('./admit-card-centre-registrations/admit-card-exam-view/admit-card-exam-view.module').then(m => m.AdmitCardExamViewModule)
      },

      {
        path: 'registrations/:registrationId/snapshot/:snapshotId',
        loadChildren: () => import('./admit-card-centre-registrations/admit-card-centres-view/admit-card-centres-view.module').then(m => m.AdmitCardCentresViewModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmitCardPlanningRoutingModule { }
