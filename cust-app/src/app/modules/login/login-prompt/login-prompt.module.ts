import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPromptRoutingModule } from './login-prompt-routing.module';
import { LoginPromptComponent } from './login-prompt.component';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [LoginPromptComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginPromptRoutingModule
  ]
})
export class LoginPromptModule { }
