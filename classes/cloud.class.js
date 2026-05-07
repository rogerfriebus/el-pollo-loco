class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    constructor(imagePath, x) {
        super();
        this.x = x;
        this.speed = 0.15;
        this.loadImage(imagePath);
        this.animate();
    }

    /**
     * Starts slow cloud movement.
     */
    animate() {
        setGameInterval(() => this.moveCloud(), 1000 / 60);
    }

    /**
     * Moves cloud and recycles it after leaving the screen.
     */
    moveCloud() {
        this.moveLeft();
        if (this.x < -600) this.x = 2200 + Math.random() * 600;
    }
}