class GameController {
    world;
    endbossBottleDamage = 25;

    constructor(world) {
        this.world = world;
    }

    /**
     * Updates endboss behavior.
     */
    updateEndboss() {
        if (this.world.isGameOver || this.world.isGameWon) return;
        const endboss = this.getEndboss();
        if (!endboss) return;
        endboss.updateBehavior(this.world.character);
        if (endboss.isActivated) this.world.isEndbossActive = true;
    }

    /**
     * Returns the endboss object.
     * @returns {Endboss}
     */
    getEndboss() {
        return this.world.level.enemies.find((enemy) => enemy instanceof Endboss);
    }

    /**
     * Checks collisions between character and enemies.
     */
    checkCollisions() {
        if (this.world.isGameOver || this.world.isGameWon) return;
        this.world.level.enemies.forEach((enemy) => this.handleEnemyCollision(enemy));
    }

    /**
     * Handles one enemy collision.
     * @param {MovableObject} enemy enemy object
     */
    handleEnemyCollision(enemy) {
        if (!this.canCollideWithEnemy(enemy)) return;
        if (this.canStompEnemy(enemy)) this.killEnemy(enemy);
        else this.damageCharacter(enemy);
    }

    /**
     * Checks if enemy collision is relevant.
     * @param {MovableObject} enemy enemy object
     * @returns {boolean}
     */
    canCollideWithEnemy(enemy) {
        return !enemy.isDeadEnemy && this.world.character.isColliding(enemy);
    }

    /**
     * Checks if the character jumps onto an enemy.
     * @param {MovableObject} enemy enemy object
     * @returns {boolean}
     */
    canStompEnemy(enemy) {
        if (enemy instanceof Endboss) return false;
        return this.isCharacterFalling() && this.hasEnoughHorizontalStompOverlap(enemy) && this.isInStompZone(enemy);
    }

    /**
     * Checks if Pepe is falling down.
     * @returns {boolean}
     */
    isCharacterFalling() {
        return this.world.character.speedY < 0;
    }

    /**
     * Checks whether Pepe overlaps enough with the enemy on the x-axis.
     * @param {MovableObject} enemy enemy object
     * @returns {boolean}
     */
    hasEnoughHorizontalStompOverlap(enemy) {
        const characterBox = this.world.character.getCollisionBox();
        const enemyBox = enemy.getCollisionBox();
        const overlap = this.getHorizontalOverlap(characterBox, enemyBox);
        const enemyWidth = enemyBox.right - enemyBox.left;
        const requiredOverlap = Math.min(14, enemyWidth * 0.35);
        return overlap >= requiredOverlap;
    }

    /**
     * Calculates horizontal overlap between two boxes.
     * @param {{left: number, right: number}} firstBox first box
     * @param {{left: number, right: number}} secondBox second box
     * @returns {number}
     */
    getHorizontalOverlap(firstBox, secondBox) {
        return Math.max(0, Math.min(firstBox.right, secondBox.right) - Math.max(firstBox.left, secondBox.left));
    }

    /**
     * Checks if Pepe's feet are in the enemy's upper hit area.
     * @param {MovableObject} enemy enemy object
     * @returns {boolean}
     */
    isInStompZone(enemy) {
        const characterBox = this.world.character.getCollisionBox();
        const previousBox = this.world.character.getPreviousCollisionBox();
        const enemyBox = enemy.getCollisionBox();
        return this.wasAboveEnemy(previousBox, enemyBox) || this.isInUpperEnemyArea(characterBox, enemyBox);
    }

    /**
     * Checks if Pepe was above the enemy in the previous frame.
     * @param {{bottom: number}} previousBox previous character box
     * @param {{top: number}} enemyBox enemy box
     * @returns {boolean}
     */
    wasAboveEnemy(previousBox, enemyBox) {
        return previousBox.bottom <= enemyBox.top + 18;
    }

    /**
     * Checks if Pepe's feet are still in the upper part of the enemy.
     * @param {{bottom: number}} characterBox current character box
     * @param {{top: number, bottom: number}} enemyBox enemy box
     * @returns {boolean}
     */
    isInUpperEnemyArea(characterBox, enemyBox) {
        const enemyHeight = enemyBox.bottom - enemyBox.top;
        return characterBox.bottom <= enemyBox.top + enemyHeight * 0.95;
    }

    /**
     * Kills a normal enemy.
     * @param {Chicken} enemy enemy object
     */
    killEnemy(enemy) {
        enemy.kill();
        this.world.audioManager.playStomp();
        this.world.character.speedY = 18;
        setTimeout(() => this.removeEnemy(enemy), 450);
    }

    /**
     * Removes enemy from level.
     * @param {MovableObject} enemy enemy object
     */
    removeEnemy(enemy) {
        this.world.level.enemies = this.world.level.enemies.filter((item) => item !== enemy);
    }

    /**
     * Damages the character and updates the health bar.
     * @param {MovableObject} enemy enemy object
     */
    damageCharacter(enemy) {
        const oldEnergy = this.world.character.energy;
        const damage = enemy instanceof Endboss ? 30 : 20;
        this.world.character.hit(damage);
        this.playHurtSoundIfNeeded(oldEnergy);
        this.world.healthBar.setPercentage(this.world.character.energy);
        this.checkGameOverAfterDamage();
    }

    /**
     * Plays hurt sound only when energy changed.
     * @param {number} oldEnergy previous energy value
     */
    playHurtSoundIfNeeded(oldEnergy) {
        if (this.world.character.energy < oldEnergy) this.world.audioManager.playHurt();
    }

    /**
     * Starts game over if character has no energy left.
     */
    checkGameOverAfterDamage() {
        if (!this.world.character.isDead()) return;
        this.world.isGameOver = true;
        this.world.clearKeyboard();
    }

    /**
     * Checks coin and bottle collection.
     */
    checkCollectables() {
        if (this.world.isGameOver || this.world.isGameWon) return;
        this.checkCoinCollection();
        this.checkBottleCollection();
    }

    /**
     * Checks if coins are collected.
     */
    checkCoinCollection() {
        this.world.level.coins.forEach((coin) => this.handleCoinCollision(coin));
    }

    /**
     * Checks if bottles are collected.
     */
    checkBottleCollection() {
        this.world.level.bottles.forEach((bottle) => this.handleBottleCollision(bottle));
    }

    /**
     * Handles one coin collision.
     * @param {Coin} coin collectable coin
     */
    handleCoinCollision(coin) {
        if (!this.world.character.isColliding(coin)) return;
        this.collectCoin(coin);
    }

    /**
     * Handles one bottle collision.
     * @param {Bottle} bottle collectable bottle
     */
    handleBottleCollision(bottle) {
        if (!this.world.character.isColliding(bottle)) return;
        this.collectBottle(bottle);
    }

    /**
     * Collects one coin.
     * @param {Coin} coin collected coin
     */
    collectCoin(coin) {
        this.world.level.coins = this.world.level.coins.filter((item) => item !== coin);
        this.world.collectedCoins++;
        this.world.audioManager.playCoin();
        this.world.coinBar.setPercentage(this.getCoinPercentage());
    }

    /**
     * Collects one bottle.
     * @param {Bottle} bottle collected bottle
     */
    collectBottle(bottle) {
        this.world.level.bottles = this.world.level.bottles.filter((item) => item !== bottle);
        this.world.collectedBottles++;
        this.world.audioManager.playBottle();
        this.world.bottleBar.setPercentage(this.getBottlePercentage());
    }

    /**
     * Checks if bottles should be thrown.
     */
    checkThrowObjects() {
        if (!this.canThrowBottle()) return;
        this.throwBottle();
    }

    /**
     * Checks whether Pepe can throw a bottle.
     * @returns {boolean}
     */
    canThrowBottle() {
        const hasBottle = this.world.collectedBottles > 0;
        const cooldownReady = Date.now() - this.world.lastThrowTime > this.world.throwCooldown;
        return this.world.keyboard.d && hasBottle && cooldownReady && this.world.isPlayable();
    }

    /**
     * Throws one collected bottle.
     */
    throwBottle() {
        const bottle = this.createThrowableBottle();
        this.world.throwableObjects.push(bottle);
        this.reduceBottleInventory();
        this.world.audioManager.playThrow();
        this.world.lastThrowTime = Date.now();
        this.world.keyboard.d = false;
    }

    /**
     * Creates a throwable bottle from Pepe's position.
     * @returns {ThrowableObject}
     */
    createThrowableBottle() {
        const x = this.world.character.otherDirection ? this.world.character.x : this.world.character.x + 80;
        const y = this.world.character.y + 90;
        return new ThrowableObject(x, y, this.world.character.otherDirection);
    }

    /**
     * Reduces collected bottle count after throwing.
     */
    reduceBottleInventory() {
        this.world.collectedBottles--;
        this.world.bottleBar.setPercentage(this.getBottlePercentage());
    }

    /**
     * Checks if thrown bottles hit enemies.
     */
    checkBottleHits() {
        if (this.world.isGameOver || this.world.isGameWon) return;
        this.world.throwableObjects.forEach((bottle) => this.checkBottleAgainstEnemies(bottle));
        this.removeFinishedThrowableObjects();
    }

    /**
     * Checks one bottle against all enemies.
     * @param {ThrowableObject} bottle thrown bottle
     */
    checkBottleAgainstEnemies(bottle) {
        this.world.level.enemies.forEach((enemy) => this.handleBottleEnemyCollision(bottle, enemy));
    }

    /**
     * Handles bottle collision with one enemy.
     * @param {ThrowableObject} bottle thrown bottle
     * @param {MovableObject} enemy enemy object
     */
    handleBottleEnemyCollision(bottle, enemy) {
        if (!this.canBottleHitEnemy(bottle, enemy)) return;

        if (enemy instanceof Endboss) {
            this.handleBottleEndbossCollision(bottle, enemy);
            return;
        }

        bottle.hitTarget();
        this.killEnemy(enemy);
    }

    /**
     * Handles bottle collision with the endboss.
     * @param {ThrowableObject} bottle thrown bottle
     * @param {Endboss} endboss endboss object
     */
    handleBottleEndbossCollision(bottle, endboss) {
        const damageApplied = this.damageEndboss(endboss);
        if (damageApplied) bottle.hitTarget();
    }

    /**
     * Checks whether bottle can hit enemy.
     * @param {ThrowableObject} bottle thrown bottle
     * @param {MovableObject} enemy enemy object
     * @returns {boolean}
     */
    canBottleHitEnemy(bottle, enemy) {
        if (bottle.hasHit || bottle.isSplashing || enemy.isDeadEnemy) return false;
        return bottle.isColliding(enemy);
    }

    /**
     * Damages the endboss.
     * @param {Endboss} endboss endboss object
     * @returns {boolean}
     */
    damageEndboss(endboss) {
        this.world.isEndbossActive = true;
        endboss.isActivated = true;

        const damageApplied = endboss.hit(this.endbossBottleDamage);
        if (!damageApplied) return false;

        this.world.endbossBar.setPercentage(endboss.energy);
        this.world.audioManager.playBossHit();

        if (endboss.isDead()) this.startWinSequence();
        return true;
    }

    /**
     * Starts win sequence.
     */
    startWinSequence() {
        if (this.world.isGameWon) return;
        this.world.isGameWon = true;
        this.world.clearKeyboard();
        setTimeout(() => this.world.finishGameWon(), 1200);
    }

    /**
     * Removes finished thrown bottles.
     */
    removeFinishedThrowableObjects() {
        this.world.throwableObjects = this.world.throwableObjects.filter((bottle) => !bottle.isReadyForRemoval());
    }

    /**
     * Calculates coin status percentage.
     * @returns {number}
     */
    getCoinPercentage() {
        return this.getProgressPercentage(this.world.collectedCoins, this.world.maxCoins);
    }

    /**
     * Calculates bottle status percentage.
     * @returns {number}
     */
    getBottlePercentage() {
        return this.getProgressPercentage(this.world.collectedBottles, this.world.maxBottles);
    }

    /**
     * Calculates a status bar percentage.
     * @param {number} current current amount
     * @param {number} max maximum amount
     * @returns {number}
     */
    getProgressPercentage(current, max) {
        if (max <= 0) return 0;
        return (current / max) * 100;
    }
}