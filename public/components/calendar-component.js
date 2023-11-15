import { CalendarModel } from "../model/calendar.js"

let calendarTemplate = document.createElement("template")
calendarTemplate.innerHTML = `
<style>
* {
    box-sizing: border-box;
  }
  .dim{
    opacity: .5
}
  @media screen and (max-width: 400px) {
    body {
      margin: 0px;
    }
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    max-width: 400px;
    height: fit-content;
    background-color: var(--background-color);
    color: var(--color);
  }
  @media screen and (max-width: 400px) {
    .wrapper {
      padding-inline: 0px;
      margin-inline: 0px;
    }
  }
  
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media screen and (max-width: 400px) {
    .header * {
        padding-inline: 1rem;
    }
  }
  .header .top {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-block: 1rem;
  }
  .header hr {
    width: 100%;
    border: none;
    border-top: 2px solid var(--md-sys-color-on-primary-container);
  }
  
  .body {
    display: grid;
    place-items: center;
    gap: 1rem;
    grid-template-columns: repeat(7, 1fr);
  }

  .body .labels {
    display: flex;
    height: 10px;
    grid-column-start: 1;
    grid-column-end: 8;
  }
  .body .date {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--node-background-color);
  }
  .selected{
    background-color:red;
  }
</style>
<div class="wrapper">
        <div class="header">
            <div class="top">
                <i id="arrow-left"> < </i>
                <div id="title-calendar">{{Month}} {{Year}}</div>
                <i id="arrow-right">></i>
            </div>
            <hr/>
        </div>
        <div class="body">
            <div class="date">Su</div>
            <div class="date">Mo</div>
            <div class="date">Tu</div>
            <div class="date">We</div>
            <div class="date">Th</div>
            <div class="date">Fr</div>
            <div class="date">Sa</div>
        </div>
    </div>
`
/**
 * Modify colors with the following attributes
 * background-color -> the calendar background color
 * color -> the calandar's text color
 * node-background-color 
 * node-color
 */
class Calendar extends HTMLElement {
    #model = new CalendarModel()
    static observedAttributes = ["cal-background-color", "cal-color", "node-color", "node-background-color"]

    constructor() {
        super();
        let calendarTemplateContent = calendarTemplate.content
        this.attachShadow({ mode: "open" })
        this.shadowRoot.appendChild(calendarTemplateContent.cloneNode(true))
    }

    connectedCallback() {
        this.#initUI()
        this.#setupCalendarNavigation()
        this.#setupSingleNodeSelect()
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.#updateUI()
        this.#updateColors(name, oldValue, newValue)
    }

    /**
     * This method allows for the changing of months by clicking on the < > icons
     */
    #setupCalendarNavigation() {
        let leftArrow = this.shadowRoot.getElementById("arrow-left")
        let rightArrow = this.shadowRoot.getElementById("arrow-right")
        leftArrow.addEventListener("click", () => {
            this.#goToPrevMonth()
        })
        rightArrow.addEventListener("click", () => {
            this.#goToNextMonth()
        })
    }

    #goToNextMonth() {
        this.model.incrementMonth()
        this.#updateUI()
    }
    #goToPrevMonth() {
        this.model.decrementMonth()
        this.#updateUI()
    }

    /**
     * This method makes selecting one node deselect all other nodes
     */
    #setupSingleNodeSelect() {
        let outerThis = this;
        // let selectedNode = this.model.selectedNode;
        //TODO : Setup nodes
        //setup regular nodes
        let allNodes = this.shadowRoot.querySelectorAll("calendar-node-component")
        // console.log(allNodes)

        allNodes.forEach(function (node) {
            node.addEventListener("click", function (event) {
                event.preventDefault()//used to prevent single click acting as a "double" click
                //select the first node
                console.log("clicked")
                if (outerThis.model.selectedNode == null) {
                    // console.log("selected your first node")
                    //toggle the current node
                    node.classList.toggle("selected")
                    //save the node as the Calendar's node
                    outerThis.model.selectedNode = node;
                }
                //select a new node given one is already selected
                // else{
                //     console.log(outerThis.model.selectedNode.isEqualNode(node))
                // }
                else if (outerThis.model.selectedNode != null){
                    //get all other nodes to toggle
                    allNodes.forEach((node)=>node.classList.remove("selected"))

                    // console.log("ther's a saved node already")
                    // console.log(outerThis.model.selectedNode)
                    // console.log(node)
                    if (outerThis.model.selectedNodenode===node) {
                        // console.log("matched")
                        //toggle off the the previously selected node
                        selectedNode.classList.toggle("selected")
                        //toggle on the node that have been clicked
                        node.classList.add("selected")
                        //update the Calendar's selected node
                        selectedNode = node
                    }
                    // //select the same node
                    else{
                        // console.log("selected a new node")
                        node.classList.toggle("selected")
                        
                    outerThis.model.selectedNode = node;
                    }
                }
            })
        })

        //setup dim nodes
        let dimPreNodes = this.shadowRoot.querySelectorAll("label.dim")
    }

    /**
      * populates the  calendar with the correct number of nodes all on the correct days of the week
      * 
      * @param {*} month Jan being 1 and Dec being 12 
      * @param {*} year 
      */
    #populateCalendar(month, year) {
        let preBlanks = this.model.numberEmptyNodesBefore1st(month, year)//start 1st on the correct day of week
        let numInLastRow = ((preBlanks + this.model.numDaysInMonth(month, year)) % 7);
        let postBlanks = 7 - numInLastRow;//7 - number in last row

        let section = this.shadowRoot.querySelector(".body")
        if(this.model.selectedNode !=null){
            console.log(`selected day: ${this.model.selectedNode.day}\nselected month: ${this.model.selectedNode.month}\nselected year: ${this.model.selectedNode.year}`)
        }
        for (let i = 0; i < this.model.numDaysInMonth(month, year) + preBlanks + postBlanks; i++) {
            //see if the calendar need to re build the selected date node
            if (this.model.selectedNode != null && i - 2 == this.model.selectedNode.day && this.model.currMonth == this.model.selectedNode.month && this.model.currYear == this.#model.selectedNode.year) {
                console.log(`this month contains your selected date`)
                
                let num = i + 1 - preBlanks;
                // let date = new Date(this.model.currYear, this.model.currMonth() - 1, num)

                let node = this.#buildNode(this.model.currYear, this.#model.currMonth, num, false, true, false)
                
                node.setAttribute("data-int", num)

                node.classList.add("selected")
                section.appendChild(node)

            }
            else if (i < preBlanks) {
                let num = this.model.numDaysInMonth(this.model.getPrevMonth(month)) - preBlanks + 1 + i;
                let node = this.#buildNode(this.model.currYear, this.#model.currMonth, num, true, false, false)
                node.setAttribute("data-int", num)
                section.appendChild(node)
            }
            //if the current node to add is past the num days in the month
            else if (i > preBlanks + this.model.numDaysInMonth(month, year) - 1) {
                let num = i - this.model.numDaysInMonth(month, year) - preBlanks + 1;
                let date = new Date(this.model.currYear, this.model.currMonth - 1, num)
                let node = this.#buildNode(this.model.currYear, this.#model.currMonth, num, false, false, true)
                node.setAttribute("data-int", num)
                section.appendChild(node)
            }

            else {
                let num = i + 1 - preBlanks;
                let date = new Date(this.model.currYear, this.model.currMonth - 1, num)
                let node = this.#buildNode(this.model.currYear, this.#model.currMonth, num, false, true, false)
                
                node.setAttribute("data-int", num)
                section.appendChild(node)
            }
            
        }
    }


    /**
     * Methods - Utility
     */


    /**
     * This method sets the initial UI: text && colors
     */
    #initUI() {
        const calendarTitle = this.shadowRoot.getElementById("title-calendar")
        calendarTitle.innerHTML = `${this.model.monthNames[this.model.currMonth - 1]}, ${this.model.currYear}`
        this.#populateCalendar(this.model.currMonth, this.model.currYear)
        this.color("var(--md-sys-color-on-background)")
        this.backgroundColor("var(--md-sys-color-primary-container)")
        this.nodeBackgroundColor("var(--md-sys-color-on-primary-container)")
        this.nodeColor("var(--md-sys-color-primary-container)")
    }
    /**
     * This method updates the displayed month && dates
     */
    #updateUI() {
        //Update Title
        const calendarTitle = this.shadowRoot.getElementById("title-calendar")
        calendarTitle.innerHTML = `${this.model.monthNames[this.model.currMonth - 1]}, ${this.model.currYear}`

        //clear out the nodes
        let section = this.shadowRoot.querySelector(".body")
        let children = Array.from(section.children)
        children.forEach(child => {
            //remove the nodes without the date class
            if (!child.classList.contains("date")) {
                section.removeChild(child)
            }
        })

        //add new nodes
        this.#populateCalendar(this.model.currMonth, this.model.currYear)
    }
    /**
     * This method updates the style attributes
     */
    #updateColors(attributeName, oldValue, newValue) {
        console.log(`working with ${attributeName}`)
        switch (attributeName) {
            case "cal-color":
                this.color(newValue)
                break;
            case "cal-background-color":
                this.backgroundColor(newValue)
                break;
            case "node-color":
                this.nodeColor(newValue)
                break;
            case "node-background-color":
                this.nodeBackgroundColor(newValue)
                break;
            default:
                console.log(attributeName)
        }
    }

    /**
     * 
     * @param {CalendarNode} node to construct && add to the calendar. This method abstracts the logic associated with building the calendar-node-component 
     * @returns 
     */
    #buildNode(year, month, day, isPre, isReg, isPost) {
        let child = document.createElement("calendar-node-component")

        child.day = day
        child.month = month
        child.year = year
        // if its a pre/ post node -> dim the UI, clicking toggles the calendar
        if (isPost) {
            child.classList.add("dim")
            child.addEventListener("click", (event) => {
                event.preventDefault()
                this.#goToNextMonth()
            })
        }
        if (isPre) {
            child.classList.add("dim")
            child.addEventListener("click", (event) => {
                event.preventDefault()
                this.#goToPrevMonth()
            })
        }
        return child;
    }




    /**
     * 
     * Getters && Setters
     */

    get model() { return this.#model }

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
customElements.define('calendar-component', Calendar)

