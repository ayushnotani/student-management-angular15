import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AddEditStudentComponent } from './add-edit-student/add-edit-student.component';
import { FilterOptions, Student, StudentApiService } from '../services/student-api-service/student-api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public studentData = this.formBuilder.group({
    typeFilter: ['all'],
    ageFilter: [],
    classFilter: [''],
    students: this.formBuilder.array([])
  });;
  public data: Student[]

  constructor(private readonly formBuilder: FormBuilder, private readonly studentApiService: StudentApiService, private matSnackBar: MatSnackBar, private modal: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  get students() {
    return this.studentData.controls["students"] as FormArray;
  }

  get studentsControls() {
    return this.students.controls as FormGroup[];
  }

  public applyFilter() {
    const filterObj: FilterOptions = {};

    const typeFil = this.studentData.get('typeFilter').value;
    const ageFil = this.studentData.get('ageFilter').value;
    const classFil = this.studentData.get('classFilter').value;
    if (typeFil !== 'all') {
      filterObj.type = typeFil;
    }
    if (ageFil) {
      filterObj.age = ageFil;
    }
    if (classFil) {
      filterObj.class = classFil;
    }
    if (filterObj.type || filterObj.age || filterObj.class) {
      this.loadData(filterObj);
    }
    else {
      this.loadData();
    }
  }

  public addStudent() {
    const dialog = this.modal.open(AddEditStudentComponent);
    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.matSnackBar.open('Student added successfully', 'ok', {
            duration: 5000,
          })
          this.loadData();
        }
      }
    })
  }

  public editStudent(student) {
    const inputData: Student = {
      name: student.controls.name.value,
      age: student.controls.age.value,
      class: student.controls.class.value,
      gender: student.controls.gender.value,
      phone: student.controls.phonenumber.value,
      type: student.controls.type.value,
      id: student.controls.id.value
    }
    const dialog = this.modal.open(AddEditStudentComponent, {
      data: inputData
    });
    dialog.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          this.matSnackBar.open('successfully edited student record', 'ok', {
            duration: 5000,
          })
          this.loadData();
        }
      }
    })
  }

  public deleteStudent(studentId: number) {
    this.studentApiService.deleteStudentData(studentId).subscribe({
      next: () => {
        this.matSnackBar.open('successfully deleted student record', 'ok', {
          duration: 5000,
        })
        this.loadData();
      },
      error: (message) => {
        this.matSnackBar.open(message, 'ok', {
          duration: 5000,
        })
      }
    });
  }

  private addStudentInForm(data: Student) {
    this.students.push(
      this.formBuilder.group({
        name: [{value: data.name, disabled:true}],
        gender: [{value: data.gender, disabled:true}],
        phonenumber: [{value: data.phone, disabled:true}],
        age: [{value: data.age, disabled:true}],
        class: [{value: data.class, disabled:true}],
        type: [{value: data.type, disabled: true}],
        id: [data.id]
      })
    )
  }

  private loadData(filter?: FilterOptions) {
    this.studentData.setControl('students',this.formBuilder.array([]));
    if (filter) {
      this.studentApiService.getData(filter).subscribe({
        next: (data: Student[]) => {
          data.forEach((student) => {
            this.addStudentInForm(student);
          })
          this.data = data;
        }
      });
    }
    else {
      this.studentApiService.getData().subscribe({
        next: (data: Student[]) => {
          data.forEach((student) => {
            this.addStudentInForm(student);
          })
          this.data = data;
        }
      });
    }
  }

}
