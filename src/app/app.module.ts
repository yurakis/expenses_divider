import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTableModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ExpenseDialogComponent } from './expense-dialog/expense-dialog.component';
import { MemberDialogComponent } from './member-dialog/member-dialog.component';
import { MemberListComponent } from './member-list/member-list.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ResultListComponent } from './result-list/result-list.component';
import { TableComponent } from './shared';

const dialogs = [
  MemberDialogComponent,
  ExpenseDialogComponent
];

@NgModule({
  declarations: [
    ...dialogs,
    AppComponent,
    MemberDialogComponent,
    ResultListComponent,
    MemberListComponent,
    ExpenseListComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule
  ],
  entryComponents: [...dialogs],
  bootstrap: [AppComponent]
})
export class AppModule { }
