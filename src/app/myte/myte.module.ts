import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MyteComponent } from './myte.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuperviserViewComponent } from './superviser-view/superviser-view.component';
import { UserViewComponent } from './user-view/user-view.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { TableComponent } from '../common/table/table.component';
import { myTeRouting } from './myte.routing';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


import { RecordComponent } from '../common/pages/record/record.component';
import { ReviewComponent } from './superviser-view/review/review.component';
import { AuthGuard } from '../service/auth-guard.service';
import { Ng2Storage } from '../service/storage';
import { HeaderComponent } from "../common/header/header.component";
import { FooterComponent } from "../common/footer/footer.component";

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BusyModule} from 'angular2-busy';
import { EmptyTableComponent } from '../common/utils/empty-table/empty-table.component';

import { CalendarModule } from '../common/calendar/calendar.module';
import { AssignmentsComponent } from './superviser-view/assignments/assignments.component';
import { AddAssignmentComponent } from './superviser-view/assignments/add-assignment/add-assignment.component';
import { CommonService} from '../../app/service/common.service';
import { MultiselectDropdownModule } from '../common/dropdown/dropdown.module';

import { ConfirmModule } from '../../app/common/confirm/confirm.module';
import { ConfigSettingsComponent } from '../common/config-settings/config-settings.component';
import { AssignmentSettingsComponent } from './superviser-view/assignments/assignment-settings/assignment-settings.component';
import {CategoryPipe} from './superviser-view/assignments/category.pipe';
import {OrderrByPipe} from './superviser-view/assignments/orderby.pipe';
import { RoleMappingComponent } from './superviser-view/role-mapping/role-mapping.component';
import { SelectModule } from '../common/select/select.module';
import { RecordHistoryComponent } from '../common/record-history/record-history.component';

@NgModule({
    imports: [
        myTeRouting,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        BrowserAnimationsModule,
        BusyModule,
        CalendarModule.forRoot(),
        ConfirmModule.forRoot(),
        SelectModule,
        MultiselectDropdownModule.forRoot()
    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
        MyteComponent,
        DashboardComponent,
        UserViewComponent,
        NotFoundComponent,
        SuperviserViewComponent,
        TableComponent,
        RecordComponent,
        ReviewComponent,
        EmptyTableComponent,
        AssignmentsComponent,
        AddAssignmentComponent,
        AssignmentSettingsComponent,
        CategoryPipe,
        OrderrByPipe,
        RoleMappingComponent,
        RecordHistoryComponent
    ],
    exports: [
        MyteComponent
    ],
    providers:[
        AuthGuard,
        Ng2Storage,
        CommonService
    ],
    entryComponents:[
        AssignmentSettingsComponent,
        RecordHistoryComponent
    ]
})
export class MyteModule {

}
