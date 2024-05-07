import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';

import { AngularSvgIconModule } from 'angular-svg-icon';

//components
import { PrimaryLayoutComponent } from './primary-layout/primary-layout.component';

import { PrimaryHeaderComponent } from './primary-header/primary-header.component';
import { FilterToggleModule } from '../../directives/filter-toggle/filter-toggle.module';
import { PrimaryHeaderService } from './primary-header/primary-header.service';
import { BsDropdownModule } from 'ngx-bootstrap';
import { MenuToggleModule } from '../../directives/menu-toggle/menu-toggle.module';
import { ExamHeaderComponent } from './exam-header/exam-header.component';
import { ServerStatusCheckModule } from './server-status-check/server-status-check.module';



@NgModule({
  declarations: [
    PrimaryLayoutComponent,    
    PrimaryHeaderComponent,
    ExamHeaderComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    AngularSvgIconModule,
    MenuToggleModule,
    FilterToggleModule,
    BsDropdownModule.forRoot(),
    ServerStatusCheckModule
  ],
  //providers: [PrimaryHeaderService]
})
export class LayoutModule { }
