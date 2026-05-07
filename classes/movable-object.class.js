class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    groundY = 180;
    energy = 100;
    lastHit = 0;
    previousY = 280;
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Applies simple gravity to the object.
     */
    applyGravity() {
        setGameInterval(() => this.handleGravityTick(), 1000 / 25);
    }

    /**
     * Starts a vertical jump.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Plays the next image of an animation sequence.
     * @param {string[]} images animation image paths
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        this.img = this.imageCache[images[index]];
        this.currentImage++;
    }

    /**
     * Checks whether this object collides with another object.
     * @param {MovableObject} object other movable object
     * @returns {boolean}
     */
    isColliding(object) {
        const a = this.getCollisionBox();
        const b = object.getCollisionBox();
        return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
    }

    /**
     * Returns the adjusted collision box.
     * @returns {{left: number, right: number, top: number, bottom: number}}
     */
    getCollisionBox() {
        return {
            left: this.x + this.offset.left,
            right: this.x + this.width - this.offset.right,
            top: this.y + this.offset.top,
            bottom: this.y + this.height - this.offset.bottom
        };
    }

    /**
     * Returns the previous adjusted collision box.
     * @returns {{left: number, right: number, top: number, bottom: number}}
     */
    getPreviousCollisionBox() {
        return {
            left: this.x + this.offset.left,
            right: this.x + this.width - this.offset.right,
            top: this.previousY + this.offset.top,
            bottom: this.previousY + this.height - this.offset.bottom
        };
    }

    /**
     * Reduces object energy.
     * @param {number} damage damage amount
     * @returns {boolean}
     */
    hit(damage = 20) {
        if (this.isHurt() || this.isDead()) return false;
        this.energy = Math.max(0, this.energy - damage);
        this.lastHit = Date.now();
        return true;
    }

    /**
     * Checks whether the object is currently hurt.
     * @returns {boolean}
     */
    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 0.8;
    }

    /**
     * Checks whether the object has no energy left.
     * @returns {boolean}
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Checks whether the object is above its ground line.
     * @returns {boolean}
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Handles one gravity interval tick.
     */
    handleGravityTick() {
        this.previousY = this.y;

        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.stopAtGround();
        }
    }

    /**
     * Prevents falling through the ground line.
     */
    stopAtGround() {
        if (this.y > this.groundY) {
            this.y = this.groundY;
            this.speedY = 0;
        }
    }
}