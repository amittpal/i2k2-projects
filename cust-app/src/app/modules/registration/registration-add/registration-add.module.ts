import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationAddRoutingModule } from './registration-add-routing.module';
import { RegistrationAddComponent } from './registration-add.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { NgxIxcheckProductInfoLibModule } from 'src/app/components/ngx-ixcheck-product-info-new/ngx-ixcheck-product-info-new.module';
import { NgxIxcheckTable3LibModule } from 'ngx-ixcheck-table3-lib';
import { BasicSetupComponent } from './basic-setup/basic-setup.component';
import { BasicSetupRowDetailsComponent } from './basic-setup/basic-setup-row-details/basic-setup-row-details.component';


@NgModule({
  declarations: [RegistrationAddComponent, BasicSetupComponent, BasicSetupRowDetailsComponent, ],
  imports: [
    CommonModule,
    RegistrationAddRoutingModule,
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
    
  ]
})
export class RegistrationAddModule { }
