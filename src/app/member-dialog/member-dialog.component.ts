import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Member, MemberService } from '../shared';

@Component({
  selector: 'ed-member-dialog',
  templateUrl: './member-dialog.component.html',
  styleUrls: ['./member-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberDialogComponent implements OnInit {
  nameControl: FormControl;
  isEditMode: boolean;
  private minLength = 3;

  constructor(
    private dialogRef: MatDialogRef<MemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private member: Member,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.isEditMode = Boolean(this.member);
    this.nameControl = new FormControl(
      this.isEditMode ? this.member.name : null,
      [Validators.required, this.nameValidator]
    );
  }

  saveMember() {
    if (this.nameControl.invalid) {
      return;
    }

    this.dialogRef.close(this.nameControl.value.trim());
  }

  get errorMessage(): string {
    const errors = this.nameControl.errors;
    let message: string = null;

    if (errors !== null) {
      if (errors.minLength) {
        message = `Member name is too short. Minimum length: ${this.minLength} symbols`;
      } else if (errors.unique) {
        message = 'Member name must be unique';
      }
    }

    return message;
  }

  private get nameValidator(): ValidatorFn {
    return ({value}: FormControl) => {
      if (!value) {
        return null;
      }

      const trimmedValue = value.trim().toLowerCase();
      const errors: ValidationErrors = {};

      if (trimmedValue.length < this.minLength) {
        errors.minLength = true;
      }

      if (this.memberService.members.some(({name}) => name.toLowerCase() === trimmedValue)) {
        errors.unique = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }
}
