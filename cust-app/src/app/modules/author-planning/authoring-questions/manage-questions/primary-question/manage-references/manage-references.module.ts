import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageReferencesComponent } from './manage-references.component';
import { NgxIxcheckTable3LibModule } from 'ngx-ixcheck-table3-lib';
import { RowDetailsComponent } from './row-details/row-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ManageReferencesComponent, RowDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIxcheckTable3LibModule
    
  ],
  exports:[ManageReferencesComponent]
})
export class ManageReferencesModule { }
