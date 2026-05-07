class Character extends MovableObject {
    height = 250;
    width = 130;
    y = 180;
    x = 80;
    speed = 8;
    world;
    deathAnimationIndex = 0;
    deathAnimationStarted = false;
    deathAnimationFinished = false;
    lastActionTime = Date.now();
    sleepDelay = 15000;
    offset = {
        top: 90,
        right: 35,
        bottom: 15,
        left: 35
    };

    IMAGES_IDLE = [
        "img/2_character_pepe/1_idle/idle/I-1.png",
        "img/2_character_pepe/1_idle/idle/I-2.png",
        "img/2_character_pepe/1_idle/idle/I-3.png",
        "img/2_character_pepe/1_idle/idle/I-4.png",
        "img/2_character_pepe/1_idle/idle/I-5.png",
        "img/2_character_pepe/1_idle/idle/I-6.png",
        "img/2_character_pepe/1_idle/idle/I-7.png",
        "img/2_character_pepe/1_idle/idle/I-8.png",
        "img/2_character_pepe/1_idle/idle/I-9.png",
        "img/2_character_pepe/1_idle/idle/I-10.png"
    ];

    IMAGES_LONG_IDLE = [
        "img/2_character_pepe/1_idle/long_idle/I-11.png",
        "img/2_character_pepe/1_idle/long_idle/I-12.png",
        "img/2_character_pepe/1_idle/long_idle/I-13.png",
        "img/2_character_pepe/1_idle/long_idle/I-14.png",
        "img/2_character_pepe/1_idle/long_idle/I-15.png",
        "img/2_character_pepe/1_idle/long_idle/I-16.png",
        "img/2_character_pepe/1_idle/long_idle/I-17.png",
        "img/2_character_pepe/1_idle/long_idle/I-18.png",
        "img/2_character_pepe/1_idle/long_idle/I-19.png",
        "img/2_character_pepe/1_idle/long_idle/I-20.png"
    ];

    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png"
    ];

    IMAGES_JUMPING = [
        "img/2_character_pepe/3_jump/J-31.png",
        "img/2_character_pepe/3_jump/J-32.png",
        "img/2_character_pepe/3_jump/J-33.png",
        "img/2_character_pepe/3_jump/J-34.png",
        "img/2_character_pepe/3_jump/J-35.png",
        "img/2_character_pepe/3_jump/J-36.png",
        "img/2_character_pepe/3_jump/J-37.png",
        "img/2_character_pepe/3_jump/J-38.png",
        "img/2_character_pepe/3_jump/J-39.png"
    ];

    IMAGES_HURT = [
        "img/2_character_pepe/4_hurt/H-41.png",
        "img/2_character_pepe/4_hurt/H-42.png",
        "img/2_character_pepe/4_hurt/H-43.png"
    ];

    IMAGES_DEAD = [
        "img/2_character_pepe/5_dead/D-51.png",
        "img/2_character_pepe/5_dead/D-52.png",
        "img/2_character_pepe/5_dead/D-53.png",
        "img/2_character_pepe/5_dead/D-54.png",
        "img/2_character_pepe/5_dead/D-55.png",
        "img/2_character_pepe/5_dead/D-56.png",
        "img/2_character_pepe/5_dead/D-57.png"
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadAllCharacterImages();
        this.applyGravity();
        this.animate();
    }

    /**
     * Loads all character animation images.
     */
    loadAllCharacterImages() {
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Starts movement and sprite animation intervals.
     */
    animate() {
        setGameInterval(() => this.handleMovement(), 1000 / 60);
        setGameInterval(() => this.handleAnimation(), 140);
    }

    /**
     * Handles movement based on keyboard input.
     */
    handleMovement() {
        if (this.isDead()) return;
        if (this.isActivelyControlled()) this.resetActivityTimer();
        this.moveByKeyboard();
        this.jumpByKeyboard();
        this.updateCamera();
    }

    /**
     * Moves the character left or right.
     */
    moveByKeyboard() {
        if (this.canMoveRight()) this.walkRight();
        if (this.canMoveLeft()) this.walkLeft();
    }

    /**
     * Handles jump input.
     */
    jumpByKeyboard() {
        if (this.shouldJump()) this.jump();
    }

    /**
     * Updates the camera position.
     */
    updateCamera() {
        if (this.world) this.world.updateCamera();
    }

    /**
     * Plays the correct animation state.
     */
    handleAnimation() {
        if (this.isDead()) {
            this.playDeathAnimationOnce();
            return;
        }

        this.playAliveAnimation();
    }

    /**
     * Plays the correct animation while Pepe is alive.
     */
    playAliveAnimation() {
        if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
        else if (this.isAboveGround()) this.playAnimation(this.IMAGES_JUMPING);
        else if (this.isMoving()) this.playAnimation(this.IMAGES_WALKING);
        else if (this.isSleeping()) this.playAnimation(this.IMAGES_LONG_IDLE);
        else this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Plays the dead animation exactly one time.
     */
    playDeathAnimationOnce() {
        if (this.deathAnimationFinished) {
            this.keepLastDeathImage();
            return;
        }

        this.startDeathAnimationIfNeeded();
        this.showNextDeathImage();
    }

    /**
     * Initializes the dead animation.
     */
    startDeathAnimationIfNeeded() {
        if (this.deathAnimationStarted) return;
        this.deathAnimationStarted = true;
        this.deathAnimationIndex = 0;
    }

    /**
     * Shows the next dead image.
     */
    showNextDeathImage() {
        if (this.deathAnimationIndex < this.IMAGES_DEAD.length) {
            this.showDeathImageAtCurrentIndex();
            return;
        }

        this.finishDeathAnimation();
    }

    /**
     * Draws one dead animation image.
     */
    showDeathImageAtCurrentIndex() {
        const imagePath = this.IMAGES_DEAD[this.deathAnimationIndex];
        this.img = this.imageCache[imagePath];
        this.deathAnimationIndex++;
    }

    /**
     * Finishes the dead animation and informs the world.
     */
    finishDeathAnimation() {
        this.deathAnimationFinished = true;
        this.keepLastDeathImage();
        this.world?.finishGameOver();
    }

    /**
     * Keeps Pepe on the final dead frame.
     */
    keepLastDeathImage() {
        const lastImage = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
        this.img = this.imageCache[lastImage];
    }

    /**
     * Checks whether Pepe is idle long enough to sleep.
     * @returns {boolean}
     */
    isSleeping() {
        return Date.now() - this.lastActionTime > this.sleepDelay;
    }

    /**
     * Resets the inactivity timer.
     */
    resetActivityTimer() {
        this.lastActionTime = Date.now();
    }

    /**
     * Checks whether the player currently presses a game control.
     * @returns {boolean}
     */
    isActivelyControlled() {
        return this.world?.keyboard.right || this.world?.keyboard.left || this.world?.keyboard.up || this.world?.keyboard.space || this.world?.keyboard.d;
    }

    /**
     * Checks right movement.
     * @returns {boolean}
     */
    canMoveRight() {
        return this.world?.keyboard.right && this.x < this.world.level.levelEndX;
    }

    /**
     * Checks left movement.
     * @returns {boolean}
     */
    canMoveLeft() {
        return this.world?.keyboard.left && this.x > 0;
    }

    /**
     * Moves and faces right.
     */
    walkRight() {
        this.moveRight();
        this.otherDirection = false;
    }

    /**
     * Moves and faces left.
     */
    walkLeft() {
        this.moveLeft();
        this.otherDirection = true;
    }

    /**
     * Checks jump permission.
     * @returns {boolean}
     */
    shouldJump() {
        return (this.world?.keyboard.space || this.world?.keyboard.up) && !this.isAboveGround();
    }

    /**
     * Checks if walk animation is needed.
     * @returns {boolean}
     */
    isMoving() {
        return this.world?.keyboard.right || this.world?.keyboard.left;
    }
}