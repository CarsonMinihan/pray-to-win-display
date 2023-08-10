import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { ChangeListComponent } from './pages/change-list/change-list.component';
import { DailyMoodChangesComponent } from './pages/daily-mood-changes/daily-mood-changes.component';
import { JournalComponent } from './pages/journal/journal.component';
import { LoginComponent } from './pages/login/login.component';
import { MoodInfoComponent } from './pages/mood-info/mood-info.component';
import { AuthGuard } from './shared/services/authservices/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },


  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard]},
  { path: 'journal', component: JournalComponent, canActivate: [AuthGuard]},
  { path: 'dailymood', component: DailyMoodChangesComponent, canActivate: [AuthGuard]},
  { path: 'moodinfo', component: MoodInfoComponent, canActivate: [AuthGuard]},
  { path: 'changelist', component: ChangeListComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
