import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddalertPageRoutingModule } from './addalert-routing.module';

import { AddalertPage } from './addalert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddalertPageRoutingModule
  ],
  declarations: [AddalertPage]
})
export class AddalertPageModule {}
