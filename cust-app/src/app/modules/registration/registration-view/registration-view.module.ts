import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationViewRoutingModule } from './registration-view-routing.module';
import { RegistrationViewComponent } from './registration-view.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { NgxIxcheckProductInfoLibModule } from 'src/app/components/ngx-ixcheck-product-info-new/ngx-ixcheck-product-info-new.module';
import { NgxIxcheckTable3LibModule } from 'ngx-ixcheck-table3-lib';
import { BasicSetupComponent } from '../registration-view/basic-setup/basic-setup.component';
import { BasicSetupRowDetailsComponent } from './basic-setup/basic-setup-row-details/basic-setup-row-details.component';
import { RegTypesComponent } from './reg-types/reg-types.component';
import { RegTypesRowEditComponent } from './reg-types/reg-types-row-edit/reg-types-row-edit.component';
import { RegTypeMappingComponent } from './reg-type-mapping/reg-type-mapping.component';
import { RegTypeMappingRowEditComponent } from './reg-type-mapping/reg-type-mapping-row-edit/reg-type-mapping-row-edit.component';
import { RegMailServerConfigComponent } from './reg-mail-server-config/reg-mail-server-config.component';
import { RegApplicableFeesComponent } from './reg-applicable-fees/reg-applicable-fees.component';
import { ApplicableFeesRowDetailsComponent } from './reg-applicable-fees/reg-applicable-fees-list/applicable-fees-row-details/applicable-fees-row-details.component';
import { RegApplicableFeesListComponent } from './reg-applicable-fees/reg-applicable-fees-list/reg-applicable-fees-list.component';
import { RegFinalReviewComponent } from './reg-final-review/reg-final-review.component';
import { RegistrationExamCitiesComponent } from './registration-exam-cities/registration-exam-cities.component';
import { ExamCitiesRowEditComponent } from './registration-exam-cities/exam-cities-row-edit/exam-cities-row-edit.component';

@NgModule({
  declarations: [RegistrationViewComponent, BasicSetupComponent, BasicSetupRowDetailsComponent, RegTypesComponent, RegTypesRowEditComponent,
    RegTypeMappingComponent, RegTypeMappingRowEditComponent,
    RegMailServerConfigComponent, RegApplicableFeesComponent,
    ApplicableFeesRowDetailsComponent, RegApplicableFeesListComponent,
    RegFinalReviewComponent, RegistrationExamCitiesComponent, ExamCitiesRowEditComponent],
  imports: [
    CommonModule,
    RegistrationViewRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgxIxcheckProductInfoLibModule,
    NgxIxcheckTable3LibModule,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RegistrationViewModule { }
