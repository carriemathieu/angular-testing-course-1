import {async, ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';




describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;
  // allows us to obtain instance of component, etc.
  // 
  let fixture: ComponentFixture<CoursesCardListComponent>
  // debug element
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // declare component + any other components that component uses internally
      // declarations: [
      //   CoursesCardListComponent
      // ]
      // imports CoursesCardListCompnent + all necesary module/components
      imports: [CoursesModule]
    })
    // get us back a promise that gets resolved when compilation is finished
    // async process
    .compileComponents()
    // wait for promise to resovle, then...
    .then(() => {
      fixture = TestBed.createComponent(CoursesCardListComponent);
      // creates instance of component
      component = fixture.componentInstance;
      el = fixture.debugElement;
    });
  }))

  it("should create the component", () => {

   expect(component).toBeTruthy();

  });


  it("should display the course list", () => {

    // pulls from data.db & src/app/courses/common/setup-test-data.ts
    // setupCourses creates an array of courses in sequential order
    component.courses = setupCourses();

    // without change detection, component does not recognize that courses were assigned (above)
    fixture.detectChanges();

    // gives us native element 
    // console.log(el.nativeElement.outerHTML);

    // searches dom for all elements w/ CSS class "course-card"
    const cards = el.queryAll(By.css(".course-card"))

    expect(cards).toBeTruthy("Could not find cards");

    expect(cards.length).toBe(12, "Unexpected number of courses");
  });


  it("should display the first course", () => {

      component.courses = setupCourses();
      fixture.detectChanges();

      const course = component.courses[0];

      const card = el.query(By.css(".course-card:first-child")),
        title = card.query(By.css("mat-card-title")),
        image = card.query(By.css("img"))

      expect(card).toBeTruthy("Could not find course card.");

      expect(title.nativeElement.textContent).toBe(course.titles.description);

      expect(image.nativeElement.src).toBe(course.iconUrl);
  });


});


