﻿import { Component, OnInit, Pipe, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { BusinessService } from '../../services/business.service';
import { Business } from '../../model/business';
import { Task } from '../../model/task';
import * as moment from 'moment';

import { TaskService } from '../../services/task.service'

@Component({
    selector: 'create-edit-task',
    templateUrl: './create-edit-task.component.html',
    styleUrls: ['./create-edit-task.component.css']
})
export class CreateEditTaskComponent implements AfterViewInit {
    public ismeridian: boolean = false;
    now: Date = new Date();
    selectedTime: Date = new Date();
    selectedDate: Date = new Date();
    statusMessage: string;
    taskTypes: string[] = [
        'Grafisk Opgave',
        'Video Opgave',
        'Event Opgave', 
        'Strategisk Opgave',
        'Målgruppeanalyse',
        'Dataanalyse'
    ];
    business: Business;
    edit: Boolean;
    loading: Boolean = false;
    model: Task = new Task();

    constructor(private taskService: TaskService,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private businessService: BusinessService) {
        accountService.loggedIn.subscribe(newValue => {
            if (newValue)
                this.getBusiness();
            else
                this.business = null;
        })
    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.taskService.getTask(id).subscribe(res => {
                    console.log(res);
                    this.model = res;
                    this.edit = true;
                });
            } else {
                this.edit = false;
            }

        })
    }

    @ViewChild('f') form: any;

    onSubmit() {
        if (this.form.valid) {
            this.loading = true;
            if (!this.model.id) {
                if (this.model.rewardType === 'Anbefaling')
                    this.model.rewardValue = 0;
                this.taskService.createTask(this.model).subscribe((data) => {
                    console.log(data);
                    this.loading = false;
                    this.router.navigateByUrl('business');
                }, (err) => {
                    this.loading = false;
                });
                //this.businessService.createBusiness(this.model);
            } else {
                if (this.model.rewardType === 'Anbefaling')
                    this.model.rewardValue = 0;
                this.taskService.updateTask(this.model).subscribe((data) => {
                    console.log(data);
                    this.loading = false;
                    this.router.navigateByUrl('business');
                }, (err) => {
                    this.loading = false;
                });
            }  
        }
    }

    getBusiness() {
        this.loading = true;
        this.businessService.getBusinessFromUser().subscribe(res => {
            this.business = res;
            this.model.address = res.address;
            this.model.city = res.city;
            this.model.zip = res.zip;
            this.loading = false;
        }, err => {
            if (err.status !== 401)
                console.log(err);
            this.loading = false;
        });
    }

    deadlineChanged(something) {
        console.log("im here!");
        let _date: moment.Moment = moment(this.selectedDate).startOf("day");
        let _time: moment.Moment = moment(this.selectedTime);
        _date.add(_time.hours(), "h").add(_time.minutes(), "m");
        if (_date.isAfter(moment())) {
            this.model.deadline = _date;
            this.statusMessage = '';
        }
        else {
            this.statusMessage = "Tiden for din deadline skal ligge før nuværende tidspunkt på dagen";
        }   
    }
}
