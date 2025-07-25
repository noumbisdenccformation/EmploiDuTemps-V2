import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimetableComponent } from './components/timetable/timetable.component';
import { AuthComponent } from './components/auth/auth.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { AssignmentsComponent } from './components/assignments/assignments.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'timetable', component: TimetableComponent, canActivate: [AuthGuard] },
  { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard] },
  { path: 'assignments', component: AssignmentsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }