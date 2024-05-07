import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from 'src/app/directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from 'src/app/directives/filter-toggle/filter-toggle.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { LoadComponentModule } from 'src/app/directives/load-component/load-component.module';
import { RegistrationListComponent } from './registration-list/registration-list.component';
import { RegistrationListFilterComponent } from './registration-list/registration-list-filter/registration-list-filter.component';
import { PublishRegistrationRoutingModule } from './publish-routing.module';
import { PublishRegistrationComponent } from './publish-registration/publish-registration.component';
import { ExtendRegistrationComponent } from './extend-registration/extend-registration.component';



@NgModule({
  declarations: [RegistrationListComponent, RegistrationListFilterComponent, PublishRegistrationComponent, ExtendRegistrationComponent],
  imports: [
    CommonModule,                     
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
    LoadComponentModule,   
    PublishRegistrationRoutingModule
  ]
})
export class PublishModule { }
