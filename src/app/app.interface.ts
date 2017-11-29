export interface ILogin{
    userId:string;
    password:string
}
export interface UserData{
    userId:string;
    userName:string;
    userEmail:string;
    password?:string;
    du_id?:number;
    bu_id?:number;
    userRoleId:number;
    userRoleName:string;
    project?:string;
    token?:string;
}

export interface commonDataObj{
    actionStatus:boolean;
    errorMessage?:any
}
export interface UserMenu{
    menuId:number;
    menuName:string;
}
export interface menuBeanUserListObj{
    menuBeanList:UserMenu[];
    userBean:UserData
}
export interface User{
    actionStatus?:boolean;
    details:menuBeanUserListObj;
}
export interface LoginResponse{
    employeeId:string;
    employeeName:string;
    employeeRoleId:number;
    employeeRoleName:string;
}
export interface AllEmployees{
    employeeId?:string;
    employeeName?:string;
    employeeRoleId?:number;
    employeeRoleName?:string;
    userId?:string;
    userName?:string;
    userEmail?:string;
    password?:string;
}
export interface TimeSheetDatBean{
    day:string;
    holiday:boolean;
    hours:number;
    weekday:boolean;
    isValidHour?:boolean;
    countryName?:string;
    countryId?: number | string;
    editCountry?: boolean;
}
export interface TimeSheetDetails{
    assignmentId:number | string;
    dataBean:TimeSheetDatBean[];
    periodId:number;
    periodName:string;
    projectCode:string;
    projectDesc:string;
    tstatus:string;
    isSelectValid?:boolean;
    recordNew?:boolean;
    tsTotal?:number;
    comments?:string;
    empId?:string;
    loc_id?:number;
    location_name?:string;
    location_hours:number;
}

export interface TimeSheetDetails2{
    timeSheetDetails:TimeSheetDetails;
    resourceList:ResouseList[]
}

export interface Timesheet{
    details:TimeSheetDetails[];
    actionStatus:boolean;
    resourceList?:any[];
    totalHours:any[],
    tableHeader?:any[],
    totalTsHorsLogged?:number | string
}

export interface ReviewData{
    details:TimeSheetDetails2;
    actionStatus:boolean;
    totalHours?:any[];
}
export interface Resourses{
    employeeId:string;
    userName:string;
    supervisorEmpId:string;
    approverorEmpId:string;
    copytoEmpId:string;
    status: string;
}
export interface ResourceData{
    details:Resourses[];
    actionStatus:boolean
}

export interface ResouseList{
    employeeId:string;
    userName:string;
    supervisorEmpId:string;
    approverorEmpId:string;
    copytoEmpId:string;
}
export interface ChargeCodeData{
    charge_code:string;
    charge_code_description:string;
    charge_code_id:string;
    
}
export interface ChargeCode{
    details:ChargeCodeData[];
    actionStatus:boolean;
}

export interface TimePeriodData{
    timePeriodId:number;
    timePeriodName:string;
    timePeriodLastdate:number;
}
export interface TimePeriod{
    details:TimePeriodData[];
    actionStatus:boolean;
}
export interface PeriodData{
    currentPeriodDetailsBean:CurrentPeriod;
    timePeriodMasterBean:CurrentPeriod[];
}
export interface CurrentPeriod{
    timePeriodId:number;
    timePeriodName:string;
    timePeriodLastdate:number
}

export interface EmployeeDetails {
    userId:string;
    userEmail?:string;
    userName:string;
 }
 export interface EmployeeData {
     details:EmployeeDetails[];
     actionStatus:boolean;
     errorMessage:any;
 }
 export interface SaveConfigEmployeeData {
     empId :string;
     approverIds:string[];
     superiorId:string[];
     copytoId:string[];
 }
 
 export interface ConfigEmployeeData {
     details:SaveConfigEmployeeData
     actionStatus:boolean;
     errorMessage:any;
 }

export interface ChargeObj{
    charge_code_id: number;
    charge_code: string;
    charge_code_description: string;
    charge_code_owner: string;
    charge_code_type: string;
    charge_code_subtype: string;
    client: string;
    country:string;
    bu_id: number;
    bu_name: string;
    du_id: number;
    du_name: string;
    project: string;
    function_grp_id: number;
    function_grp_name: string;
}
export interface ChargeCodeDetails extends commonDataObj{
    details:ChargeObj[];
}

export interface FunctionData{
    function_grp_id: number|string;
    function_grp_name: string;
}
export interface FunctionGroups extends commonDataObj{
    details:FunctionData[]
}
export interface BusinessUnitData{
    bu_id: number|string;
    bu_name: string;
}
export interface BusinessUnit extends commonDataObj{
    details:BusinessUnitData[]
}
export interface DeliverUnitData{
    du_id: number|string;
    du_name: string;
    bu_id:number;
}
export interface DeliverUnit extends commonDataObj{
    details:DeliverUnitData[]
}

export interface ChargeCodeType extends commonDataObj{
    details:string[]
}
export interface SaveChargeCodeResp extends commonDataObj{
    details:any;
}
export interface SaveChargeCodeData{
    charge_code: string;
    charge_code_description: string;
    charge_code_owner: string;
    charge_code_type: string;
    charge_code_subtype: string;
    client: string;
    country: string;
    bu_id: number;
    bu_name: string;
    du_id: number;
    du_name: string;
    project: string;
    function_grp_id: number;
    function_grp_name: string;

}
export interface SaveChargeCode extends commonDataObj{
    details:SaveChargeCodeData[]
}
export interface LastLoginDetails {
    details?:string;
    actionStatus:boolean;
    errorMessage:any;
}
export interface chargeCodeObject {
    empIds:string[];
    chargeCodeIds:string[];
    timePeriodIds:number[];
    charge_code_assign_by:string;
    user_charge_code_assign_date:string;
}

export interface Assignroles{
    empId:string;
    roleIds:number[]
}
export interface AssignrolesResponse extends commonDataObj{
    details:any;
}
export interface RolesData{
    roleId:number;
    roleName:string;
}
export interface Roles extends commonDataObj{
    details:RolesData[];
}
export interface TimeSheetSummaryReportData{
    time_period_id: number;
    time_period_name:string;
    tstatus:string;
}
export interface TimeSheetSummaryReport extends commonDataObj{
    details:TimeSheetSummaryReportData[];
}
export interface LocationData{
    loc_id: number;
    location_name: string;
    std_wrk_hrs: number;
}
export interface Location extends commonDataObj{
    details:LocationData[];
}
