import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageAdmitCardComponent } from './manage-admit-card.component';
import { ManageAdmitCardRoutingModule } from './manage-admit-card-routing.module';
import { BasicSetupComponent } from './basic-setup/basic-setup.component';
import { AdditionalSetupComponent } from './additional-setup/additional-setup.component';
import { SmsSetupComponent } from './sms-setup/sms-setup.component';
import { EmailSetupComponent } from './email-setup/email-setup.component';
import { QrcodeSetupComponent } from './qrcode-setup/qrcode-setup.component';
import { FinalReviewComponent } from './final-review/final-review.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import{ReactiveFormsModule,FormsModule} from '@angular/forms'
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule,TabsModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { NgxIxcheckProductInfoLibModule } from 'src/app/components/ngx-ixcheck-product-info-new/ngx-ixcheck-product-info-new.module';
import { NgxIxcheckTable3LibModule } from 'ngx-ixcheck-table3-lib';
import { QuillModule } from 'ngx-quill';




@NgModule({
  declarations: [ManageAdmitCardComponent, BasicSetupComponent, AdditionalSetupComponent, SmsSetupComponent, EmailSetupComponent, FinalReviewComponent, QrcodeSetupComponent],
  imports: [
    CommonModule,
    ManageAdmitCardRoutingModule,
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
    QuillModule.forRoot()
  ]
})
export class ManageAdmitCardModule { }
