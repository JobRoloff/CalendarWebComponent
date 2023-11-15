export class CalendarModel {
    #selectedNode;
    MIN_MONTH = 1;
    currentDate = new Date();
    #currMonth = this.currentDate.getMonth() + 1;
    #currYear = this.currentDate.getFullYear()
    MAX_MONTH = 12;
    monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    //TODO: what if we want local storage of date 
    constructor() { }

    /**
     * @param {int} month Jan being 1 and Dec being 12
     * @param {int} year 
     * @returns the number of calendar days in the given month and year
    */
    numDaysInMonth(month, year) {
        const daysInMonth = [31, this.isCommonYear(year) ? 28 : 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return daysInMonth[month - 1];
    };

    /**
     * @param {int} year 
     * @returns boolean representing true if year is NOT a leap year
     */
    isCommonYear(year) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param {int} month  Jan being 1 and Dec being 12
     * @param {int} year 
     * @returns the day of the week which the 1st of the month lands on
     */
    getDayOfMonth(month, year) {
        if (month < 3) {
            month += 12;
            year -= 1;
        }
        const k = year % 100;
        const j = Math.floor(year / 100);
        const day = 1; // First day of the month
        const h = (day + Math.floor((13 * (month + 1)) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) - 2 * j) % 7;
        return this.daysOfWeek[h - 1];
    }

    /**
     * @param {int} month Jan being 1 and Dec being 12
     * @param {int} year 
     * @returns the number of days of the week before the 1st of the month
     */
    numberEmptyNodesBefore1st(month, year) {
        let firstDay = this.getDayOfMonth(month, year)
        let nameToInt = this.daysOfWeek.indexOf(firstDay)
        let difference = Math.abs(0 - nameToInt);
        return difference
    }

    /**
     * This method returns the previous month as a number 1 - 12
     * @param {} month 
     * @param {*} year 
     */
    getPrevMonth(month, year) {
        if (month == 1) { return 12 }
        else { return month - 1; }
    }

    decrementMonth() {
        if (this.MIN_MONTH < this.currMonth) {
            this.currMonth -= 1
        } else {
            this.currMonth = this.MAX_MONTH;
            this.currYear -= 1
        }
    }
    incrementMonth() {
        if (this.currMonth < this.MAX_MONTH) {
            this.currMonth += 1
        } else {
            this.currMonth = this.MIN_MONTH;
            this.currYear += 1
        }
    }
  


    get currMonth() {
        return this.#currMonth;
    }
    set currMonth(value) {
        this.#currMonth = value;
    }
    get currYear() {
        return this.#currYear;
    }
    set currYear(value) {
        this.#currYear = value;
    }

    get selectedNode() {
        return this.#selectedNode
    }

    set selectedNode(value) {
        // console.log(`setting this.selectedNodeDate: ${this.selectedNodeDate}\nto value.displayNumber: ${value}`)
        if (value == null) { throw new Error("Argument must not be null") }

        //value is of type CalendarNode
        if (!(value instanceof HTMLElement)) {
            throw new Error('Argument must be an instance of the CalendarNode class');
        }
        //set the value
        this.#selectedNode = value;
    }

    //create dynamic styling vars
    backgroundColor(value) {
        this.style.setProperty('--background-color', value);
    }
    color(value) {
        this.style.setProperty('--color', value);
    }
    nodeColor(value) {
        this.style.setProperty('--node-color', value);
    }
    nodeBackgroundColor(value) {
        this.style.setProperty('--node-background-color', value);
    }
}

