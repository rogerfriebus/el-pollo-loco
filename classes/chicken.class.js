class Chicken extends MovableObject {
    isDeadEnemy = false;
    removeFromLevel = false;

    constructor(x, variant = "normal") {
        super();
        this.x = x;
        this.variant = variant;
        this.applyVariantSettings();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    /**
     * Applies size, speed and image settings.
     */
    applyVariantSettings() {
        if (this.variant === "small") this.applySmallChickenSettings();
        else this.applyNormalChickenSettings();
    }

    /**
     * Applies normal chicken settings.
     */
    applyNormalChickenSettings() {
        this.y = 355;
        this.width = 70;
        this.height = 70;
        this.speed = 0.25 + Math.random() * 0.5;
        this.IMAGE_DEAD = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";
        this.IMAGES_WALKING = this.getNormalWalkingImages();
        this.offset = { top: 8, right: 8, bottom: 5, left: 8 };
    }

    /**
     * Applies small chicken settings.
     */
    applySmallChickenSettings() {
        this.y = 380;
        this.width = 48;
        this.height = 48;
        this.speed = 0.45 + Math.random() * 0.7;
        this.IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";
        this.IMAGES_WALKING = this.getSmallWalkingImages();
        this.offset = { top: 5, right: 5, bottom: 3, left: 5 };
    }

    /**
     * Returns normal chicken walk images.
     * @returns {string[]}
     */
    getNormalWalkingImages() {
        return [
            "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
            "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
            "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
        ];
    }

    /**
     * Returns small chicken walk images.
     * @returns {string[]}
     */
    getSmallWalkingImages() {
        return [
            "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
            "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
            "img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
        ];
    }

    /**
     * Starts enemy movement and animation.
     */
    animate() {
        setGameInterval(() => this.moveIfAlive(), 1000 / 60);
        setGameInterval(() => this.animateIfAlive(), 160);
    }

    /**
     * Moves the chicken only while alive.
     */
    moveIfAlive() {
        if (!this.isDeadEnemy) this.moveLeft();
    }

    /**
     * Animates the chicken only while alive.
     */
    animateIfAlive() {
        if (!this.isDeadEnemy) this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Kills the chicken and switches to dead image.
     */
    kill() {
        this.isDeadEnemy = true;
        this.speed = 0;
        this.loadImage(this.IMAGE_DEAD);
    }
}

class SmallChicken extends Chicken {
    constructor(x) {
        super(x, "small");
    }
}