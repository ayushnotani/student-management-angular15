import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student, StudentApiService } from 'src/app/services/student-api-service/student-api.service';

@Component({
  selector: 'app-add-edit-student',
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.scss']
})
export class AddEditStudentComponent implements OnInit {
  public student: FormGroup;
  public editMode = false;

  constructor(private readonly studentApiService: StudentApiService, private readonly formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public inputData: Student, public dialogRef: MatDialogRef<AddEditStudentComponent>, private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.inputData) {
      this.student = this.formBuilder.group({
        name: [this.inputData.name, [Validators.required]],
        gender: [this.inputData.gender, [Validators.required]],
        phoneno: [this.inputData.phone,[Validators.required]],
        age: [this.inputData.age,[Validators.required]],
        class: [this.inputData.class,[Validators.required]],
        type:[this.inputData.type,[Validators.required]]
      })
      this.editMode = true;
    }
    else {
      this.student = this.formBuilder.group({
        name: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        phoneno: [,[Validators.required]],
        age: [,[Validators.required]],
        class: ['',[Validators.required]],
        type:['',[Validators.required]]
      })
    }
  }

  public addStudent() {
    this.studentApiService.addStudent({
      name: this.student.get('name').value,
      gender: this.student.get('gender').value,
      phone: this.student.get('phoneno').value,
      age: this.student.get('age').value,
      class: this.student.get('class').value,
      type: this.student.get('type').value
    }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (message) => {
        this.matSnackBar.open(message, 'ok', {
          duration: 5000,
        })
      }
    })
  }

  public editStudent() {
    this.studentApiService.editStudent({
      name: this.student.get('name').value,
      gender: this.student.get('gender').value,
      phone: this.student.get('phoneno').value,
      age: this.student.get('age').value,
      class: this.student.get('class').value,
      type: this.student.get('type').value,
      id: this.inputData.id
    }).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (message) => {
        this.matSnackBar.open(message, 'ok', {
          duration: 5000,
        })
      }
    })
  }

  public closeDialog() {
    this.dialogRef.close();
  }

}
