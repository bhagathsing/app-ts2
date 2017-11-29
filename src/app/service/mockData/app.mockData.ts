import { ILogin, User, AllEmployees} from '../../app.interface';

export const LoginUser:ILogin[] = [
    {userId:'E002913',password:'laludolly@234'},
    {userId:'E001286',password:'Aug2017$$'},
    {userId:'E001289',password:'abc'}
];

export const AllUsers:AllEmployees[] = [
    {employeeId:'E002913',userName:'Bhagath Singh',userEmail:'bhagathsingh.ramavath@cigniti.com',password:'laludolly@234',userId:'E002913'},
    {employeeId:'E001286',userId:'E001286',userName:'Kasi',userEmail:'kasi@cigniti.com',password:'Aug2017$$'},
    {employeeId:'E001289',userId:'E001289',userName:'Shakar',userEmail:'shakar@cigniti.com',password:'abcd'},
    {employeeId:'E002915',userId:'E002915',userName:'Naveen',userEmail:'naveen@cigniti.com',password:'abcd'},
    {employeeId:'E002918',userId:'E002918',userName:'Shaik',userEmail:'shaik@cigniti.com',password:'abcd'}
];

export const timeSheetDetail = {
    "readonly": false,
    "totalHours":[
      {day:"wed 1",dayHrs:11},
      {day:"wed 1",dayHrs:10},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},
      {day:"wed 1",dayHrs:6},],
    "totalTsHorsLogged": 91,
    "timesheetDetails": [{
      "id": 11,
      "assignment_id": 21,
      "tsTotal": 35,
      "data": [
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 3, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false }
      ]
    },
    {
      "id": 11,
      "assignment_id": 22,
      "tsTotal": 33,
      "data": [
        { day: "wed 1", hours: 4, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 1, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false }
      ]
    },
    {
      "id": 11,
      "assignment_id": 23,
      "tsTotal": 39,
      "data": [
        { day: "wed 1", hours: 5, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 6, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "wed 1", hours: 2, "is_weekday": true, "is_holiday": false },
        { day: "thu 2", hours: 2, "is_weekday": true, "is_holiday": false }
      ]
    }
    ],
    "chargeCodes": [{ name: "CSEA", assignment_id: 21 }, { name: "Verita", assignment_id: 22 }, { name: "CSEA", assignment_id: 23 }]
  }

