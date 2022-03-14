import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProfileComponent } from './profile/profile.component';
import { profileRoutes } from './profile.route';
import { ProfileService } from './profile/profile.service';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(profileRoutes), NgMultiSelectDropDownModule.forRoot()],
  declarations: [ProfileComponent],
  providers: [ProfileService],
})
export class ProfileModule {}
