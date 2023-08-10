import { Component, OnInit } from '@angular/core';
import { endOfDay, startOfDay } from 'date-fns';
import { MoodService } from 'src/app/shared/services/mood.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-mood-info',
  templateUrl: './mood-info.component.html',
  styleUrls: ['./mood-info.component.scss']
})
export class MoodInfoComponent implements OnInit {
  good: boolean = false;
  neutral: boolean = false;
  bad: boolean = false;
  mood: string = "LOADING";
  recent: boolean = false;

  constructor(public moodService: MoodService, public ui: UiService) { }

  ngOnInit(): void {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    
    //gets first day of the month
    var firstDay = startOfDay(new Date(y, m, 1)).getTime();

    //gets last day of month
    var lastDay = endOfDay(new Date(y, m + 1, 0)).getTime();

    this.moodService.getMoodsBetween(firstDay, lastDay).subscribe((res) => {
      let resData = res.data;
      if(resData.length !== 0){
        this.recent = true;
      }
      console.log(this.recent);
    })
    this.moodService.avgMoodWeek().subscribe((res) => {
      if(res.success){
        if(res.data > 0.5){
          this.good = true;
          this.mood = "good"
        }
        if(res.data <= 0.5 && res.data >= -0.5){
          this.neutral = true;
          this.mood = "neutral"
        }
        if(res.data < -0.5){
          this.bad = true;
          this.mood = "bad"
        }
      }
    },
    (res) => {
      console.log(res.error);
      if (!res.error.success && res.error.message) {
        let message = 'Error: ' + res.error.message;
        this.ui.showToastMessage(message, 'danger');
      } else {
        this.ui.showToastMessage('Error: failed to load', 'danger');
      }
    })
  }

}
