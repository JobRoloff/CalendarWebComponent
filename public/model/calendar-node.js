export class CalendarNodeModel {
    #isPre;
    #isPost;
    #isReg;
    #displayNumber;
    #dateObj

    #year
    #month
    #day

    constructor(isPre, isPost, isReg, dateObj) {
        this.#isPre = isPre
        this.#isPost = isPost
        this.#isReg = isReg
        //setter for the date of the node
        this.dateObj = dateObj
    }


    

    /**
     * 
     * @param {node} node 
     * @returns true if this is the same as the node argument
     */
    equals(node) {
        console.log("calling .equals()")
        this.#wellformed()
        //input doesn't have the same year, month, day parameter values
        if (node.year != this.year || node.month != this.month || node.day != this.day) {
            return false
        }
        //input is the same as this
        return true
    }
    /**
     * checks if this is a well formed calendar node
     */
    #wellformed(){
        let node = this;
        //is this null?
        if (node == null){throw console.error("argument must not be null");}
        //is it of type calendar node?
        // if (! node instanceof CalendarNodeModel) {return false}
        //are all date properties present?
        // if (node.year == null || node.month == null || node.day == null) {throw console.error("One of the arguments date property is null")}
        // if this is a pre node, the number must be at least 28-6
        if(this.isPre == true){
            if (this.day < 22){throw console.error("the pre node's day value is too small")}
        }
        // if this is a post node, the number must be at most 6
        if(this.isPost == true){
            if (this.day > 6){throw console.error("the post node's day value is too large")}
        }
    }
    //Getters && Setters

    get isPre() { return this.#isPre }
    set isPre(value) { this.isPre = value }
    get isPost() { return this.#isPost }
    set isPost(value) { this.#isPost = value }
    get isReg() { return this.#isReg }
    set isReg(value) { this.#isReg = value }

    get dateObj() { return this.#dateObj }
    set dateObj(value) {
        this.#wellformed()
        this.#dateObj = value
    }
    // set displayNumber(value){this.#displayNumber = value}
    get displayNumber() { return this.#displayNumber }
    get year() { return this.#year }
    set year(value) { this.#year = value }

    get month() { return this.#month }
    set month(value) { this.#month = value }

    get day() { return this.#day }
    set day(value) {
        // console.log("setting day"); 
        this.#day = value }
}
