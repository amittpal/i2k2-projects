import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutSampleDataViewRoutingModule } from './layout-sample-data-view-routing.module';
import { LayoutSampleDataViewComponent } from './layout-sample-data-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { BsDropdownModule, TabsModule, ModalModule } from 'ngx-bootstrap';
import { LoadComponentModule } from 'src/app/directives/load-component/load-component.module';
import { IxcheckLibComponentsModule } from '../ixcheck-lib-components.module';
import { GridsterModule } from 'angular-gridster2';


@NgModule({
  declarations: [LayoutSampleDataViewComponent],
  imports: [
    CommonModule,
    LayoutSampleDataViewRoutingModule,
    CommonModule,               
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
    BsDropdownModule.forRoot(),
    LoadComponentModule,   
    IxcheckLibComponentsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    GridsterModule
  ]
})
export class LayoutSampleDataViewModule { }
