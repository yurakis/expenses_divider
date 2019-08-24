import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Member } from '../shared';

@Component({
  selector: 'ed-member-dialog',
  templateUrl: './member-dialog.component.html',
  styleUrls: ['./member-dialog.component.scss']
})
export class MemberDialogComponent implements OnInit {
  nameControl: FormControl;
  isEditMode: boolean;

  constructor(
    private dialogRef: MatDialogRef<MemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private member: Member
  ) {}

  ngOnInit() {
    this.isEditMode = Boolean(this.member);
    this.nameControl = new FormControl(
      this.isEditMode ? this.member.name : null,
      [Validators.required, Validators.minLength(3)]
    );
  }

  saveMember() {
    if (this.nameControl.invalid) {
      return;
    }

    this.dialogRef.close(this.nameControl.value);
  }
}
