import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

// xdescribe - bypass tests // fdescribe - focus on this test suite
describe('CalculatorService', () => {

    // scope - lets each expect block have access to variable
    let calculator: CalculatorService,
    loggerSpy: any;

    beforeEach(() => {
        loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);

        // components receive services and its dependencies in constructor, makes sense for tests to do the same
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                {provide: LoggerService, useValue: loggerSpy} // creates "fake" loggerService via dependency injection
                // LoggerService
            ]
        })
        calculator = TestBed.inject(CalculatorService);
    })

    it('should add two numbers', () => {
        // creates instance of Calculator service
        // const calculator = new CalculatorService(new LoggerService());

        // create *fake* dependency - this ensures only reason test would fail is due to actual service
        // contains *only* "log" method
        

        // test if a function returns a specific value
        // logger.log.and.returnValue();

        // see how many times logger is used
        // spyOn(logger, 'log')

        // create *actual* instance of calculator service
        
        
        let result = calculator.add(2,2)

        expect(result).toBe(4)
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    })

    it('should subtract two numbers', () => {
        
        const result = calculator.subtract(2,2)

        expect(result).toBe(0, "unexpected subtraction result")
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    })
})
// ng test --no-watch (runs tests then exits)