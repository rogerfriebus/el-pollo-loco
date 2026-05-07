class Endboss extends MovableObject {
    y = 55;
    width = 260;
    height = 400;
    energy = 100;
    speed = 2;
    isActivated = false;
    isAttacking = false;
    isDeadEnemy = false;
    deathAnimationIndex = 0;
    deathAnimationStarted = false;
    deathAnimationFinished = false;
    activationDistance = 560;
    attackDistance = 170;
    offset = {
        top: 70,
        right: 35,
        bottom: 20,
        left: 35
    };

    IMAGES_WALKING = [
        "img/4_enemie_boss_chicken/1_walk/G1.png",
        "img/4_enemie_boss_chicken/1_walk/G2.png",
        "img/4_enemie_boss_chicken/1_walk/G3.png",
        "img/4_enemie_boss_chicken/1_walk/G4.png"
    ];

    IMAGES_ALERT = [
        "img/4_enemie_boss_chicken/2_alert/G5.png",
        "img/4_enemie_boss_chicken/2_alert/G6.png",
        "img/4_enemie_boss_chicken/2_alert/G7.png",
        "img/4_enemie_boss_chicken/2_alert/G8.png",
        "img/4_enemie_boss_chicken/2_alert/G9.png",
        "img/4_enemie_boss_chicken/2_alert/G10.png",
        "img/4_enemie_boss_chicken/2_alert/G11.png",
        "img/4_enemie_boss_chicken/2_alert/G12.png"
    ];

    IMAGES_ATTACK = [
        "img/4_enemie_boss_chicken/3_attack/G13.png",
        "img/4_enemie_boss_chicken/3_attack/G14.png",
        "img/4_enemie_boss_chicken/3_attack/G15.png",
        "img/4_enemie_boss_chicken/3_attack/G16.png",
        "img/4_enemie_boss_chicken/3_attack/G17.png",
        "img/4_enemie_boss_chicken/3_attack/G18.png",
        "img/4_enemie_boss_chicken/3_attack/G19.png",
        "img/4_enemie_boss_chicken/3_attack/G20.png"
    ];

    IMAGES_HURT = [
        "img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img/4_enemie_boss_chicken/4_hurt/G22.png",
        "img/4_enemie_boss_chicken/4_hurt/G23.png"
    ];

    IMAGES_DEAD = [
        "img/4_enemie_boss_chicken/5_dead/G24.png",
        "img/4_enemie_boss_chicken/5_dead/G25.png",
        "img/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    constructor(x) {
        super();
        this.x = x;
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadAllImages();
        this.animate();
    }

    /**
     * Loads all boss images.
     */
    loadAllImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Starts boss animation.
     */
    animate() {
        setGameInterval(() => this.handleAnimation(), 180);
    }

    /**
     * Updates boss behavior based on Pepe's position.
     * @param {Character} character current player character
     */
    updateBehavior(character) {
        if (this.isDead()) return;
        const distance = this.x - character.x;
        this.activateIfNear(distance);
        this.updateAttackState(distance);
        this.moveTowardsCharacter(distance);
    }

    /**
     * Activates the boss when Pepe comes close.
     * @param {number} distance distance to Pepe
     */
    activateIfNear(distance) {
        if (distance < this.activationDistance) this.isActivated = true;
    }

    /**
     * Updates attack state.
     * @param {number} distance distance to Pepe
     */
    updateAttackState(distance) {
        this.isAttacking = this.isActivated && distance < this.attackDistance;
    }

    /**
     * Moves boss toward Pepe after activation.
     * @param {number} distance distance to Pepe
     */
    moveTowardsCharacter(distance) {
        if (!this.canMoveTowardsCharacter(distance)) return;
        this.moveLeft();
    }

    /**
     * Checks whether boss should move.
     * @param {number} distance distance to Pepe
     * @returns {boolean}
     */
    canMoveTowardsCharacter(distance) {
        return this.isActivated && !this.isAttacking && distance > this.attackDistance;
    }

    /**
     * Plays the correct boss animation.
     */
    handleAnimation() {
        if (this.isDead()) this.playDeathAnimationOnce();
        else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
        else if (this.isAttacking) this.playAnimation(this.IMAGES_ATTACK);
        else if (this.isActivated) this.playAnimation(this.IMAGES_ALERT);
        else this.playAnimation(this.IMAGES_WALKING);
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
     * Initializes dead animation.
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
     * Draws one dead image.
     */
    showDeathImageAtCurrentIndex() {
        const imagePath = this.IMAGES_DEAD[this.deathAnimationIndex];
        this.img = this.imageCache[imagePath];
        this.deathAnimationIndex++;
    }

    /**
     * Finishes the dead animation.
     */
    finishDeathAnimation() {
        this.deathAnimationFinished = true;
        this.isDeadEnemy = true;
        this.keepLastDeathImage();
    }

    /**
     * Keeps the boss on the final dead image.
     */
    keepLastDeathImage() {
        const lastImage = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
        this.img = this.imageCache[lastImage];
    }
}