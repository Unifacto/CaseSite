﻿import { Component, OnInit, Pipe, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Job } from '../../model/job';
import * as moment from 'moment';

import { JobService } from '../../services/job.service'

@Component({
    selector: 'create-edit-job',
    templateUrl: './create-edit-job.component.html',
    styleUrls: ['./create-edit-job.component.css']
})
export class CreateEditJobComponent implements AfterViewInit {
    jobTypes: string[] = [
        'Grafisk Opgave',
        'Video Opgave',
        'Event Opgave',
        'Strategisk Opgave',
        'Målgruppeanalyse',
        'Dataanalyse'
    ];

    model: Job = new Job();

    constructor(private jobService: JobService, private route: ActivatedRoute, private router: Router) {
    }

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];
            if (id) {
                this.jobService.getJob(id).subscribe(res => {
                    console.log(res);
                    this.model = res;
                    //this.jobService.getJob(res.id).subscribe(res => this.model = res);
                });
            }

        }) 

    }

    @ViewChild('f') form: any;

    onSubmit() {
        if (this.form.valid) {
            if(!this.model.id) {
                this.jobService.createJob(this.model).subscribe((data) => {
                    console.log(data);
                    this.router.navigateByUrl('business');
                }, (err) => {

                });
                //this.businessService.createBusiness(this.model);
            } else {
                this.route.params.subscribe(params => {
                    let id = params['id'];
                    this.jobService.updateJob(id, this.model).subscribe((data) => {
                        console.log(data);
                        this.router.navigateByUrl('business');
                    }, (err) => {

                    });
                })
            }  
        }
    }

    deadlineChanged(newValue) {
        this.model.deadline = moment(newValue);
        console.log(this.model.deadline.format());
    }
}
