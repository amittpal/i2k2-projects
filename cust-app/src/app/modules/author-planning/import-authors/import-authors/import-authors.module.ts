import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportAuthorsRoutingModule } from './import-authors-routing.module';
import { ImportAuthorsComponent } from './import-authors.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuToggleModule } from '../../../../directives/menu-toggle/menu-toggle.module';
import { FilterToggleModule } from '../../../../directives/filter-toggle/filter-toggle.module';
import{ReactiveFormsModule,FormsModule} from '@angular/forms'
import { NgxIxcheckTableLibModule } from 'ngx-ixcheck-table-lib';
import { NgxIxcheckBubbleLibModule } from 'ngx-ixcheck-bubble-lib';
import { BsDropdownModule,TabsModule } from 'ngx-bootstrap';
import { NgxIxcheckTableOuterPaginationLibModule } from 'ngx-ixcheck-table-outer-pagination-lib';
import { LanguagesFilterComponent } from '../languages-filter/languages-filter.component';
import { SubjectsFilterComponent } from '../subjects-filter/subjects-filter.component';
import { AuthorsFilterComponent } from '../authors-filter/authors-filter.component';




@NgModule({
  declarations: [ImportAuthorsComponent,LanguagesFilterComponent,SubjectsFilterComponent,AuthorsFilterComponent],
  
  imports: [
    CommonModule,
    ImportAuthorsRoutingModule,
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
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ] 
})
export class ImportAuthorsModule { }
