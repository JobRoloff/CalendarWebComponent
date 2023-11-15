import { CalendarNodeModel } from "../model/calendar-node.js";

//create template
let calendarNodeTemplate = document.createElement("template");
//populate template
calendarNodeTemplate.innerHTML = `
<style>
    *{
        box-sizing: border-box;
    }
    input[type="date"]{
        display: none;
        width: 0px;
        height: 0px;
        overflow: hidden;
    }
    label {
        display: grid;
        place-items: center;
    }
    label span {
        display: grid;
        place-items: center;
        background-color: var(--background-color);
        color: var(--color);
        border-radius: 99999999px;
        width: 2rem;
        height: 2rem;
        text-align: center;
        user-select: none;
    }
    label input[checked=true] + span {
        background-color: var(--background-color);
        color: var(--color);
        border: 2px solid var(--color);
    }
    *.dim{
        color: red;
        opacity: .5;
    }
</style>
<label>
    <input type="date">
    <span></span>
</label>
`
/**
 * Modify the background && number color using the following attributes: data-backgroundColor && data-color
 * 
 */
class CalendarNode extends HTMLElement {
    #nodeModel = new CalendarNodeModel();
    constructor() {
        super();
        // console.log("constructor")

        this.#setupShadow()
    }
    #setupShadow(){
        //get teplate content
        let templateContent = calendarNodeTemplate.content;
        //get clone
        let clone = templateContent.cloneNode("true")

        //attach a shadow dom to this obj
        this.attachShadow({ mode: "open" })
        //attach the copy template to the shadow
        this.shadowRoot.appendChild(clone)
    }
    connectedCallback() {
        // console.log("calendar-node-component connected callback")
        
        this.#initNodeColors()
        this.calendarNumber = this.getAttribute("data-int");
        if (this.calendarNumber != null) {
            let text = this.shadowRoot.querySelector("span");
            text.innerText = `${this.calendarNumber}`;
        }
        //    this.#setupStyleHandlers()
        // this.shadowRoot.addEventListener("data-color", (event) => {
        //     console.log(`Calendar Node: \nEvent Recieved : ${event}`)
        // })
    }
    disconnectedCallback() {
        // Remove the event listener when the component is removed from the DOM
        // this.removeEventListener('data-color');
    }
    /**
     * This method sets this node's colors using the passed data attributes. Default vaules are based on my root vars
     */
    #initNodeColors() {
        this.#setBackgroundColor(this.getAttribute("data-backgroundColor") || "var(--md-sys-color-on-background)")
        this.#setColor(this.getAttribute("data-color") || "var(--md-sys-color-background)")
    }

    /**
     * This method sets up event listeners for data-attribute changes that relate to the styling of the Calendar Node
     */
    #setupStyleHandlers() {
        // console.log(`Calendar Node Class:\n`)
        this.shadowRoot.addEventListener("data-color", function (event) {
            console.log(`Calendar Node :\ngot an event`)
        })
    }
    handleDataChange(event) {
        console.log("got an event!")

        // const { name, oldValue, newValue } = event.detail
        // console.log(`Child Component Received Data Change:`);
        // console.log(`Attribute Name: ${name}`);
        // console.log(`Old Value: ${oldValue}`);
        // console.log(`New Value: ${newValue}`);
    }

    // /**
    //  * Getters && Setters
    //  */

    get nodeModel() { return this.#nodeModel }
    set nodeModel(model) { this.#nodeModel = model }
    
    // get displayNumber(){return this.#displayNumber}
    // set displayNumber(value){this.#displayNumber = value}

    // get getIsSelected() {
    //     return this.#isSelected;
    // }

    // set setIsSelected(value) {
    //     this.#isSelected = value;
    // }

    /**
     * Set template attributes
     */
    #setBackgroundColor(value) { this.style.setProperty('--background-color', value) }
    #setColor(value) { this.style.setProperty('--color', value) }
}


customElements.define('calendar-node-component', CalendarNode)
