import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BsDropdownModule } from 'ngx-bootstrap';
import { MenuToggleModule } from '../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../directives/filter-toggle/filter-toggle.module';

import { TotalExamsComponent } from './total-exams/total-exams.component';
import { QuestionPapersComponent } from './question-papers/question-papers.component';
import { AuthoringStatusComponent } from './authoring-status/authoring-status.component';
import { TotalRegistrationsComponent } from './total-registrations/total-registrations.component';
import { RegistrationStatusComponent } from './registration-status/registration-status.component';
import { RegistrationPerHourComponent } from './registration-per-hour/registration-per-hour.component';
import { TotalCentersComponent } from './total-centers/total-centers.component';
import { CenterAllocationComponent } from './center-allocation/center-allocation.component';
import { AdmitCardsComponent } from './admit-cards/admit-cards.component';
import { ExamStatusComponent } from './exam-status/exam-status.component';
import { PostExamComponent } from './post-exam/post-exam.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    BsDropdownModule.forRoot(),
    ChartsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [MainComponent, TotalExamsComponent, QuestionPapersComponent, AuthoringStatusComponent, TotalRegistrationsComponent, RegistrationStatusComponent, RegistrationPerHourComponent, TotalCentersComponent, CenterAllocationComponent, AdmitCardsComponent, ExamStatusComponent, PostExamComponent]
})
export class MainModule { }
