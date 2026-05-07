class ThrowableObject extends MovableObject {
    width = 70;
    height = 80;
    speedX = 10;
    groundY = 360;
    throwLeft = false;
    hasHit = false;
    isSplashing = false;
    markForDeletion = false;
    splashAnimationIndex = 0;
    offset = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };

    IMAGES_ROTATION = [
        "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    ];

    IMAGES_SPLASH = [
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
    ];

    constructor(x, y, throwLeft) {
        super();
        this.x = x;
        this.y = y;
        this.throwLeft = throwLeft;
        this.loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.throw();
        this.animate();
    }

    /**
     * Starts the bottle throw.
     */
    throw() {
        this.speedY = 18;
        this.applyGravity();
        setGameInterval(() => this.moveBottle(), 1000 / 60);
    }

    /**
     * Moves the bottle horizontally.
     */
    moveBottle() {
        if (this.isSplashing || this.markForDeletion) return;
        this.x += this.throwLeft ? -this.speedX : this.speedX;
        if (!this.isAboveGround() && this.speedY === 0) this.startSplash();
    }

    /**
     * Starts bottle animation.
     */
    animate() {
        setGameInterval(() => this.handleAnimation(), 90);
    }

    /**
     * Chooses rotation or splash animation.
     */
    handleAnimation() {
        if (this.markForDeletion) return;
        if (this.isSplashing) this.playSplashAnimation();
        else this.playAnimation(this.IMAGES_ROTATION);
    }

    /**
     * Marks the bottle as target hit.
     */
    hitTarget() {
        if (this.hasHit) return;
        this.hasHit = true;
        this.startSplash();
    }

    /**
     * Starts splash animation.
     */
    startSplash() {
        this.isSplashing = true;
        this.speedX = 0;
        this.speedY = 0;
        this.splashAnimationIndex = 0;
    }

    /**
     * Plays splash animation once.
     */
    playSplashAnimation() {
        if (this.splashAnimationIndex < this.IMAGES_SPLASH.length) {
            this.showSplashImage();
        } else {
            this.markForDeletion = true;
        }
    }

    /**
     * Shows one splash image.
     */
    showSplashImage() {
        const imagePath = this.IMAGES_SPLASH[this.splashAnimationIndex];
        this.img = this.imageCache[imagePath];
        this.splashAnimationIndex++;
    }

    /**
     * Checks whether the bottle can be removed.
     * @returns {boolean}
     */
    isReadyForRemoval() {
        return this.markForDeletion || this.x < -200 || this.x > 3200;
    }
}