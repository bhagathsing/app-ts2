import { RouterModule, Routes } from '@angular/router';
import { MyteComponent } from './myte.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuperviserViewComponent } from './superviser-view/superviser-view.component';

import { UserViewComponent } from './user-view/user-view.component';
import { NotFoundComponent } from '../not-found/not-found.component';

import { RecordComponent } from '../common/pages/record/record.component';
import { ReviewComponent } from './superviser-view/review/review.component';
import { RoleMappingComponent } from './superviser-view/role-mapping/role-mapping.component';
import { AssignmentsComponent } from './superviser-view/assignments/assignments.component';
import { AuthGuard } from '../service/auth-guard.service';

const routes: Routes = [
    {path:'app',component:MyteComponent,children:[
        {path:'superviser',canActivate: [AuthGuard],component:SuperviserViewComponent, 
            children:[
            {path:'record',component:RecordComponent},
            {path:'review',component:ReviewComponent},
            {path:'assignments',component:AssignmentsComponent},
            {path:'roleMapping',component:RoleMappingComponent},
            {path:'',redirectTo:'record',pathMatch: 'full'}
        ]},
        {path:'userview', canActivate: [AuthGuard],component:UserViewComponent,children:[
            {path:'record',component:RecordComponent},
            {path:'',redirectTo:'record',pathMatch: 'full'}
        ]},
        {path:'',redirectTo:'superviser',pathMatch: 'full',canActivate:[AuthGuard]},
        {path:'**',component:NotFoundComponent}
    ]}
];

export const myTeRouting = RouterModule.forChild(routes);