import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AvgMood, Mood, MoodArray, MoodObjectFRBK, NumberOfChanges, UpdateMood } from '../models/mood.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  url: string = "http://localhost:3000";

  moodObjectFRBK: Mood;
  // moodObjectFRBK: MoodObjectFRBK;

  constructor(private myhttp: HttpClient, public userService: UserService) { }


  createMood(newMood: Mood): Observable<MoodObjectFRBK> {
    let header = this.userService.getHeaderWithToken();
    
    return this.myhttp.post<MoodObjectFRBK>(
      // this.url + '/mood/create',
      this.url + '/mood',
      newMood,
      header
    );
  }


  getMoods(): Observable<MoodArray> {
    let header = this.userService.getHeaderWithToken();
    return this.myhttp.get<MoodArray>(
      // this.url + '/mood/read',
      this.url + '/mood',
      header
    )
  }

  getMoodsBetween(date1: Number, date2: Number): Observable<MoodArray> {
    let header = this.userService.getHeaderWithToken();
    return this.myhttp.get<MoodArray>(
      // this.url + '/mood/rbd',
      this.url + '/mood',
      // { date1, date2 },
      header
    )
  }

  updateMood(updateMood: UpdateMood): Observable<MoodObjectFRBK> {
    let header = this.userService.getHeaderWithToken();
    return this.myhttp.put<MoodObjectFRBK>(
      // this.url + '/mood/update',
      this.url + '/mood/' + updateMood._id,
      updateMood,
      header
    );
  }

  deleteMood(id): Observable<MoodObjectFRBK> {
    let header = this.userService.getHeaderWithToken();
    return this.myhttp.delete<MoodObjectFRBK>(
      this.url + '/mood/' + id,
      header
    );
  }

  numberOfChanges(date1: Number): Observable<NumberOfChanges> {
    let header = this.userService.getHeaderWithToken();
    return this.myhttp.post<NumberOfChanges>(
      this.url + '/mood/year',
      { date1 },
      header
    )
  }

  avgMoodWeek(): Observable<AvgMood>{
    let header = this.userService.getHeaderWithToken();
    return this.myhttp.get<AvgMood>(
      this.url + '/mood/week',
      header
    )
  }

  getChangeType(x){
    switch (x) {
      case 1:
        return "Diet";
        break;

      case 2: 
        return "Routine";
        break;

      case 3:
        return "Exercise";
        break;

      case 4:
        return "Sleep";
        break;

      case 5:
        return "Hygiene";
        break;

      case 6:
        return "Social";
        break;

      case 7:
        return "Other";
        break;

      default:
        return "error";
        break;
    }
  }

}
