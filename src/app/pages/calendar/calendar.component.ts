import {
  Component,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarView,
} from 'angular-calendar';
import { UiService } from 'src/app/shared/services/ui.service';
import { MoodService } from 'src/app/shared/services/mood.service';

import { Router } from '@angular/router';
import { MoodObjectWithId, UpdateMood } from 'src/app/shared/models/mood.model';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  black: {
    primary: '#000000',
    secondary: '#000000',
  },
};
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  editMood: boolean = false;
  hasChanges: boolean;

  viewDate: Date = new Date();

  modalData: {
    title: string;
    details: string;
    id: string;
    mood: string;
  };

  editedObj: UpdateMood = new UpdateMood;

  refresh: Subject<any> = new Subject();



  

        //Calendar events is an array!!!


  data: MoodObjectWithId[] = [];

  events: CalendarEvent[] = [
    // {
    //   start: startOfDay(new Date("2021-11-24T08:00:00.000Z")),
    //   title: 'An event with no end date and you can edit the time',
    //   color: colors.yellow,
    //   actions: this.actions,
    // },
  ];

  activeDayIsOpen: boolean = false;
  eventsLoaded: Promise<boolean>;


  constructor(private modal: NgbModal, public ui: UiService, public moodService: MoodService, private router: Router) {}

  ngOnInit(): void {
    this.ui.show();
    var date = new Date(this.viewDate), y = date.getFullYear(), m = date.getMonth();
    
    //gets first day of the month
    var firstDay = startOfDay(new Date(y, m, 1)).getTime();

    //gets last day of month
    var lastDay = endOfDay(new Date(y, m + 1, 0)).getTime();

    this.moodService.getMoodsBetween(firstDay, lastDay).subscribe((res) => {

      var length_object = Object.keys(res).length;
      
      let resData = res;
      
      // console.log(res[1]._id)
      
      
      for (let i = 0; i < length_object; i++) {

       
        
        this.data.push(resData[i]);
        let calendarItem = {
          start: new Date(resData[i].date),
          title: "",
          color: colors.customColor,
          mood: "",
          details: resData[i].details,
          id: resData[i]._id,
          changes: true
        }
        // console.log (calendarItem.id)
        
        calendarItem.changes = resData[i].changes;

        switch (resData[i].mood) {
          case -1: 
            calendarItem.mood = "Bad"
            calendarItem.color = colors.red;
            break;
          
          case 0: 
            calendarItem.mood = "Neutral"
            calendarItem.color = colors.yellow;
            break;
          
          case 1: 
            calendarItem.mood = "Good"
            calendarItem.color = colors.blue;
            break;
          
          default: 
            calendarItem.color = colors.black;
            break;
        }

        

        if (resData[i].changes){
          calendarItem.title = this.moodService.getChangeType(resData[i].makeChanges) + " Change";
        }
        else {
          calendarItem.title = "No Change"
        }


        // console.log(calendarItem);
        this.events.push(calendarItem);


      }
      this.eventsLoaded = Promise.resolve(true);
    });;
  }

  getMoodsForOneMonth(){
    this.data = [];
    this.events = [];

    var date = new Date(this.viewDate), y = date.getFullYear(), m = date.getMonth();
    var firstDay = startOfDay(new Date(y, m, 1)).getTime();
    var lastDay = endOfDay(new Date(y, m + 1, 0)).getTime();

    this.moodService.getMoodsBetween(firstDay, lastDay).subscribe((res) => {

      var length_object = Object.keys(res).length;
      let resData = res;
      
      
      for (let i = 0; i < length_object; i++) {
        this.data.push(resData[i]);
        let calendarItem = {
          start: new Date(resData[i].date),
          title: "",
          color: colors.customColor,
          mood: "",
          details: resData[i].details,
          id: resData[i]._id,
          changes: true
        }

        calendarItem.changes = resData[i].changes;

        switch (resData[i].mood) {
          case -1: 
            calendarItem.mood = "Bad"
            calendarItem.color = colors.red;
            break;
          
          case 0: 
            calendarItem.mood = "Neutral"
            calendarItem.color = colors.yellow;
            break;
          
          case 1: 
            calendarItem.mood = "Good"
            calendarItem.color = colors.blue;
            break;
          
          default: 
            calendarItem.color = colors.black;
            break;
        }

        

        if (resData[i].changes){
          calendarItem.title = this.moodService.getChangeType(resData[i].makeChanges) + " Change";
        }
        else {
          calendarItem.title = "No Change"
        }


        console.log(calendarItem);
        this.events.push(calendarItem);


      }
      this.eventsLoaded = Promise.resolve(true);
    });;
  }

  editChangeOrMood(){
    this.editMood = true;
  }

  saveEdit(){
    this.editMood = false;
    console.log(this.editedObj._id)
    let item: any = this.events.find(i => i.id === this.editedObj._id);
    //gets all items from the events array that have the same id

    let resObj = this.data.find(i => i._id === this.editedObj._id);
    //gets all items from the data array that have the same id
    //this is what needs to be sent to the backend


    resObj.mood = this.editedObj.mood;

    //sets the mood type
    switch (this.editedObj.mood) {
      case -1: 
        item.mood = "Bad"
        item.color = colors.red;
        break;
      
      case 0: 
        item.mood = "Neutral"
        item.color = colors.yellow;
        break;
      
      case 1: 
        item.mood = "Good"
        item.color = colors.blue;
        break;
      
      default: 
        item.color = colors.black;
        break;
    }

    resObj.mood = this.editedObj.mood;
    resObj.makeChanges = this.editedObj.makeChanges;


    //sets the change type and details (if any)
    if (resObj.makeChanges){
      item.title = this.moodService.getChangeType(this.editedObj.makeChanges) + " Change";
      item.details = this.editedObj.details;
      resObj.details = this.editedObj.details;
    }
    else {
      item.title = "No Change"
      item.details = "";
    }

    this.editedObj.date == resObj.date;
    this.editedObj.changes == resObj.changes;

    console.log(this.editedObj);
    console.log(resObj);

    this.moodService.updateMood(this.editedObj).subscribe(res => {
      console.log(res);
    });

    this.modal.dismissAll();
    this.ui.showToastMessage('Mood Successfully Changed', "primary");

    
  }



  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(events);
    this.activeDayIsOpen = false;
    if (events.length >= 1) {
      this.activeDayIsOpen = true;
      this.viewDate = date;
    } else {
      this.activeDayIsOpen = false;
      this.viewDate = date;
    }
  }

  handleEvent(event: any): void {
    console.log(event)
    let details = event.details;
    let title = event.title;
    let id = event.id;
    let mood = event.mood;
    this.modalData = { details, title, id, mood };
    this.modal.open(this.modalContent, { size: 'lg' });
    

    // let editedObjArray = this.data.filter((data) => data._id === this.modalData.id);
    let editedObjArray = this.data.filter((data) => data._id === this.modalData.id);
    
    console.log(editedObjArray)
    let editedObjItem = editedObjArray[0]
    if(editedObjItem.changes){
      this.hasChanges = true;
    }
    else{
      this.hasChanges = false;
    }

    this.editedObj = {
      changes: editedObjItem.changes,
      date: editedObjItem.date,
      _id: editedObjItem._id,
      mood: editedObjItem.mood,
      makeChanges: editedObjItem.makeChanges,
      details: editedObjItem.details,
    };
  }



  delete() {
    console.log(this.modalData.id);
    this.moodService.deleteMood(this.modalData.id).subscribe(res => {
      console.log(res);
      if (res.success) {
        this.events = this.events.filter((modalData) => modalData.id !== res.data._id);
        this.modal.dismissAll();
        this.ui.showToastMessage('Mood Successfully Deleted', "primary");
      }
      else {

        //disabled for display version
        //this.ui.showToastMessage(res.message, "danger");
        this.refresh
      }
      this.modal.dismissAll();
      this.getMoodsForOneMonth();
      this.closeOpenMonthViewDay();
    });
  }
  editToFalse(){
    this.editMood = false;
    this.modal.dismissAll();
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}