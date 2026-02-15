export class VancedPopUpAnimation {
    constructor(config) {
        this.container = document.querySelector(config.containerSelector || '.vanced-popup-container');
        this.displayDuration = config.displayDuration || 5000;
        this.delayBetween = config.delayBetween || 3000;
        this.isActive = false;
        this.timer = null;
        
        // Bind context
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    show() {
        if (!this.container) return;
        this.container.classList.add('active');
        this.isActive = true;
        
        console.log("PopUp Shown"); // Debug

        // Schedule hide
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(this.hide, this.displayDuration);
    }

    hide() {
        if (!this.container) return;
        this.container.classList.remove('active');
        this.isActive = false;

        console.log("PopUp Hidden"); // Debug
    }

    // Method to update config dynamically (for Builder)
    updateConfig(newConfig) {
        if (newConfig.displayDuration) this.displayDuration = newConfig.displayDuration;
        if (newConfig.delayBetween) this.delayBetween = newConfig.delayBetween;
        
        console.log("Config Updated", this.displayDuration, this.delayBetween);
    }
}
