import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateAdmitCardRoutingModule } from './generate-admit-card-routing.module';
import { GenerateAdmitCardComponent } from './generate-admit-card/generate-admit-card.component';

@NgModule({
  declarations: [GenerateAdmitCardComponent],
  imports: [
    CommonModule,
    GenerateAdmitCardRoutingModule
  ]
})
export class GenerateAdmitCardModule { }
