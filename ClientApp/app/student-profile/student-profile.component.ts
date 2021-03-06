﻿import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { StudentService } from '../services/student.service';
import { UtilService } from '../services/util.service';
import { SolutionService } from '../services/solution.service';
import { Student } from '../model/student';
import * as moment from 'moment';

@Component({
    selector: 'student-profile',
    templateUrl: './student-profile.component.html',
    styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements AfterViewInit {
    student: Student;
    solutions: any[] = [];
    pastSolutions: any[] = [];

    constructor(private router: Router, private studentService: StudentService, private accountService: AccountService, private utilService: UtilService, private solutionService: SolutionService) {
        this.accountService.loggedIn.subscribe(newValue => {
            if (newValue === "student")
                this.studentService.getStudentFromUser().subscribe(res => {
                    console.log(res);
                    this.student = res;
                });
        });
    }

    ngAfterViewInit() {
        this.utilService.displayLoading(true);
        this.solutionService.getStudentSolutions().subscribe(res => {
            if (res.length > 0) {
                let now = moment();
                res.forEach(s => {
                    if (s.task.deadline.isAfter(now))
                        this.solutions.push(s);
                    else
                        this.pastSolutions.push(s);
                });
                this.utilService.displayLoading(false);
                console.log(res);
            } else {
                this.utilService.displayLoading(false);
            }
        }, (err) => {
                this.utilService.displayLoading(false);
                this.utilService.alert.next({ type: "danger", titel: "Fejl", message: "Der skete en fejl da vi forsøgte at hente dine løsningsforslag" });
            });
    }

    gotoUploadSolution(taskId) {
        this.router.navigate(['student/upload-solution/' + taskId]);
    }

    gotoTaskDetail(taskId) {
        this.router.navigate(['tasks/detail/' + taskId]);
    }

    getUserImage() {
        if (this.student) {
            return "https://graph.facebook.com/" + this.student.facebookId + "/picture?type=large";
        }
    }
}
