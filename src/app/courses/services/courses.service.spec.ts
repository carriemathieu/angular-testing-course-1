import { createMayBeForwardRefExpression } from "@angular/compiler";
import { TestBed } from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { CoursesService } from "./courses.service"
import { COURSES, findLessonsForCourse } from '../../../../server/db-data'
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe ("CoursesService", () => {
    // new instance of service for each specification
    let coursesService: CoursesService;

    // in order to specify data
    let httpTestingController: HttpTestingController

    beforeEach(() => {

        TestBed.configureTestingModule({
            // need httpclienttestingmodule bc coursesservice relies on it
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService
            ]
        })

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    })

    it('should retrieve all courses', () => {
        coursesService.findAllCourses()
            .subscribe(courses => {
                expect(courses).toBeTruthy('No courses returned');
                expect(courses.length).toBe(12, "incorrect number of courses");

                // return one instance of course (12)
                const course = courses.find(course => course.id == 12);

                // expects course title = Angular Testing Course
                expect(course.titles.description).toBe("Angular Testing Course");
            });

            const req = httpTestingController.expectOne('/api/courses');
            expect(req.request.method).toEqual('GET');

            // flush - pass data to mock request
            req.flush({payload: Object.values(COURSES)})
    })

    it('should find course by id', () => {
        coursesService.findCourseById(12)
            .subscribe( course => {
                expect(course).toBeTruthy();
                expect(course.id).toBe(12);
            });
        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("GET");
        req.flush(COURSES[12])
    })

    it('should save the course data', () => {

        const changes: Partial<Course> =  {titles: {description: 'Testing'}};
        // calls save course, changes title of course
        coursesService.saveCourse(12, changes)
            .subscribe(course => {
                expect(course.id).toBe(12);
            })

            const req = httpTestingController.expectOne('/api/courses/12');

            expect(req.request.method).toEqual('PUT');

            expect(req.request.body.titles.description).toEqual(changes.titles.description);

            req.flush({
                ...COURSES[12],
                ...changes
            });
    })

    it ('should give an error if save course fails', () => {
        const changes: Partial<Course> =  {titles: {description: 'Testing'}};

        const error = new HttpErrorResponse({
            status: 500,
            statusText: 'Internal Server Error'
        })

        coursesService.saveCourse(12, changes)
            .subscribe({ 
                error: (error: HttpErrorResponse) => 
                expect(error.status).toBe(500)
            });
            const req = httpTestingController.expectOne('/api/courses/12')

            // expect(req.request.method.toEqual("PUT"));
            req.flush(null, error)
    })

    it('should find a list of lessons', async () => {
        coursesService.findLessons(12)
            .subscribe(lessons => {
                expect(lessons).toBeTruthy();
                expect(lessons.length).toBe(3);
            });
        // use this way bc the url is complex depending on the course/lessons
        const req = httpTestingController.expectOne(req => req.url == '/api/lessons')

        expect(req.request.method).toEqual("GET");

        expect(req.request.params.get("courseId")).toEqual("12")

        expect(req.request.params.get("filter")).toEqual("");

        expect(req.request.params.get("sortOrder")).toEqual("asc");
        
        expect(req.request.params.get("pageNumber")).toEqual("0");

        expect(req.request.params.get("pageSize")).toEqual("3")

        req.flush({
            payload: findLessonsForCourse(12).slice(0,3)
        })
    })


    afterEach(() => {
        // ensures no unintended http rqsts being 'accidentally' made by method being tested
        httpTestingController.verify();
    })
})