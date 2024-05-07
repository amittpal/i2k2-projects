import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportedAuthorsViewRoutingModule } from './imported-authors-view-routing.module';
import { ImportedAuthorsViewComponent } from './imported-authors-view.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';


@NgModule({
  declarations: [ImportedAuthorsViewComponent],
  imports: [
    CommonModule,
    ImportedAuthorsViewRoutingModule,
    CommonModule,
    
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    MenuToggleModule,
    NgxIxcheckTableLibModule,
    NgxIxcheckBubbleLibModule,
    NgxIxcheckTableOuterPaginationLibModule,
  ]
})
export class ImportedAuthorsViewModule { }
