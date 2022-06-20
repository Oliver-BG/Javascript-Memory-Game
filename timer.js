export default class Timer {
    constructor(root){
        console.log(root);
        root.innerHTML = Timer.getHTML();

        this.el = {
            minutes : root.querySelector('timer-minutes'),
            seconds : root.querySelector('timer-seconds')
        };

        this.interval = null;
        this.remainingSecond = 0;
    }

    

    static getHTML(){
        return `<span class = 'timer-minute'>00</span>
        <span class = 'timer-part'>:</span> 
        <span class = 'timer-seconds'>00</span>  `
    }
}