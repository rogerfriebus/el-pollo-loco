class World {
    character = new Character();
    healthBar = new StatusBar("health", 20, 20);
    coinBar = new StatusBar("coin", 20, 60);
    bottleBar = new StatusBar("bottle", 20, 100);
    endbossBar = new StatusBar("endboss", 500, 20);
    throwableObjects = [];
    canvas;
    ctx;
    keyboard;
    audioManager;
    gameController;
    level;
    camera_x = 0;
    isRunning = true;
    isGameOver = false;
    isGameOverFinished = false;
    isGameWon = false;
    isWinFinished = false;
    isEndbossActive = false;
    debugHitboxes = false;
    debugToggleLocked = false;
    collectedCoins = 0;
    collectedBottles = 0;
    maxCoins = 0;
    maxBottles = 0;
    lastThrowTime = 0;
    throwCooldown = 900;
    animationFrameId;

    constructor(canvas, keyboard, audioManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.audioManager = audioManager;
        this.level = createLevel1();
        this.setLevelCounters();
        this.character.world = this;
        this.gameController = new GameController(this);
        this.run();
        this.draw();
    }

    /**
     * Stores level totals for status bars.
     */
    setLevelCounters() {
        this.maxCoins = this.level.coins.length;
        this.maxBottles = this.level.bottles.length;
    }

    /**
     * Starts the central game checks.
     */
    run() {
        setGameInterval(() => this.gameController.checkCollisions(), 1000 / 20);
        setGameInterval(() => this.gameController.checkCollectables(), 1000 / 20);
        setGameInterval(() => this.gameController.checkThrowObjects(), 1000 / 20);
        setGameInterval(() => this.gameController.checkBottleHits(), 1000 / 30);
        setGameInterval(() => this.gameController.updateEndboss(), 1000 / 20);
        setGameInterval(() => this.handleDebugToggle(), 1000 / 10);
    }

    /**
     * Toggles debug hitboxes with the H key.
     */
    handleDebugToggle() {
        if (this.keyboard.h && !this.debugToggleLocked) {
            this.debugHitboxes = !this.debugHitboxes;
            this.debugToggleLocked = true;
        }

        if (!this.keyboard.h) this.debugToggleLocked = false;
    }

    /**
     * Checks whether active gameplay is allowed.
     * @returns {boolean}
     */
    isPlayable() {
        return !this.isGameOver && !this.isGameWon;
    }

    /**
     * Clears all active controls.
     */
    clearKeyboard() {
        this.keyboard.left = false;
        this.keyboard.right = false;
        this.keyboard.up = false;
        this.keyboard.space = false;
        this.keyboard.d = false;
        this.keyboard.h = false;
    }

    /**
     * Finishes the game over process.
     */
    finishGameOver() {
        if (!this.canFinishGameOver()) return;
        this.isGameOverFinished = true;
        this.audioManager.stopBackground();
        this.audioManager.playGameOver();
        showGameOverScreen();
        clearGameIntervals();
    }

    /**
     * Checks if this world instance may finish game over.
     * @returns {boolean}
     */
    canFinishGameOver() {
        return this.isRunning && this.isGameOver && !this.isGameOverFinished;
    }

    /**
     * Finishes win state.
     */
    finishGameWon() {
        if (!this.canFinishWin()) return;
        this.isWinFinished = true;
        this.audioManager.stopBackground();
        this.audioManager.playWin();
        showWinScreen();
        clearGameIntervals();
    }

    /**
     * Checks if win state can finish.
     * @returns {boolean}
     */
    canFinishWin() {
        return this.isRunning && this.isGameWon && !this.isWinFinished;
    }

    /**
     * Updates the camera position for side scrolling.
     */
    updateCamera() {
        const rawCamera = -this.character.x + 100;
        const maxCameraLeft = -this.level.levelEndX + this.canvas.width - 100;
        this.camera_x = Math.min(0, Math.max(rawCamera, maxCameraLeft));
    }

    /**
     * Draws the current frame.
     */
    draw() {
        if (!this.isRunning) return;
        this.clearCanvas();
        this.drawWorldLayer();
        this.drawFixedLayer();
        this.scheduleNextFrame();
    }

    /**
     * Clears the canvas before the next frame.
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws moving game objects with camera offset.
     */
    drawWorldLayer() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        if (this.debugHitboxes) this.drawDebugHitboxes();
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws fixed UI elements.
     */
    drawFixedLayer() {
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        if (this.isEndbossActive) this.addToMap(this.endbossBar);
    }

    /**
     * Draws all debug collision boxes.
     */
    drawDebugHitboxes() {
        this.drawDebugObject(this.character, "#0088ff");
        this.drawPreviousDebugObject(this.character, "#9b5cff");
        this.level.enemies.forEach((enemy) => this.drawDebugObject(enemy, "#ff3030"));
        this.level.coins.forEach((coin) => this.drawDebugObject(coin, "#ffd500"));
        this.level.bottles.forEach((bottle) => this.drawDebugObject(bottle, "#ff9900"));
        this.throwableObjects.forEach((bottle) => this.drawDebugObject(bottle, "#00cc66"));
    }

    /**
     * Draws one object's current collision box.
     * @param {MovableObject} object object with collision box
     * @param {string} color stroke color
     */
    drawDebugObject(object, color) {
        const box = object.getCollisionBox();
        this.drawDebugBox(box, color);
    }

    /**
     * Draws one object's previous collision box.
     * @param {MovableObject} object object with previous collision box
     * @param {string} color stroke color
     */
    drawPreviousDebugObject(object, color) {
        const box = object.getPreviousCollisionBox();
        this.drawDebugBox(box, color);
    }

    /**
     * Draws a collision box.
     * @param {{left: number, top: number, right: number, bottom: number}} box collision box
     * @param {string} color stroke color
     */
    drawDebugBox(box, color) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top);
        this.ctx.restore();
    }

    /**
     * Requests the next animation frame.
     */
    scheduleNextFrame() {
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws multiple objects.
     * @param {DrawableObject[]} objects drawable objects
     */
    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }

    /**
     * Draws one object and handles mirroring.
     * @param {DrawableObject} object drawable object
     */
    addToMap(object) {
        if (object.otherDirection) this.flipImage(object);
        object.draw(this.ctx);
        if (object.otherDirection) this.flipImageBack(object);
    }

    /**
     * Mirrors an object horizontally.
     * @param {DrawableObject} object drawable object
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    /**
     * Restores an object after mirroring.
     * @param {DrawableObject} object drawable object
     */
    flipImageBack(object) {
        object.x = object.x * -1;
        this.ctx.restore();
    }

    /**
     * Stops the draw loop.
     */
    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
    }
}