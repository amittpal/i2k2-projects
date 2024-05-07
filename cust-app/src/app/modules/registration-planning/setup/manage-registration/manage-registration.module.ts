import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import{ReactiveFormsModule,FormsModule} from '@angular/forms'
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule,TabsModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { ManageRegistrationRoutingModule } from './manage-registration-routing.module';
import { ManageRegistrationComponent } from './manage-registration.component';
import { BasicSetupComponent } from './basic-setup/basic-setup.component';
import { ApplicableFeesComponent } from './applicable-fees/applicable-fees.component';
import { FinalReviewComponent } from './final-review/final-review.component';
import { NgxIxcheckProductInfoLibModule } from 'src/app/components/ngx-ixcheck-product-info-new/ngx-ixcheck-product-info-new.module';
import { NgxIxcheckTable3LibModule } from 'ngx-ixcheck-table3-lib';
import { ApplicableFeesRowDetailsComponent } from './applicable-fees/applicable-fees-row-details/applicable-fees-row-details.component';
import { OutgoingMailsComponent } from './outgoing-mails/outgoing-mails.component';


@NgModule({
  declarations: [
    ManageRegistrationComponent,
    BasicSetupComponent,
    ApplicableFeesComponent,
    FinalReviewComponent,
    ApplicableFeesRowDetailsComponent,
    OutgoingMailsComponent
      ],
  imports: [
    CommonModule,
    ManageRegistrationRoutingModule,
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
    NgxIxcheckTable3LibModule
  ]
})
export class ManageRegistrationModule { }
