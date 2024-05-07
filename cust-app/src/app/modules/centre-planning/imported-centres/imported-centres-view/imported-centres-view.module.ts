import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportedCentresViewRoutingModule } from './imported-centres-view-routing.module';
import { ImportedCentresViewComponent } from './imported-centres-view.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { ImportedCentresViewDetailsComponent } from './imported-centres-view-details/imported-centres-view-details.component';


@NgModule({
  declarations: [ImportedCentresViewComponent, ImportedCentresViewDetailsComponent],
  imports: [
    CommonModule,
    ImportedCentresViewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    MenuToggleModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ] 
})
export class ImportedCentresViewModule { }
