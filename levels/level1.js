/**
 * Creates the first level.
 * @returns {Level}
 */
function createLevel1() {
    return new Level(
        createEnemies(),
        createClouds(),
        createBackgroundObjects(),
        createCoins(),
        createBottles(),
        2600
    );
}

/**
 * Creates all enemies for level one.
 * @returns {MovableObject[]}
 */
function createEnemies() {
    return [
        new Chicken(520),
        new SmallChicken(820),
        new Chicken(1150),
        new SmallChicken(1450),
        new Chicken(1780),
        new Endboss(2380)
    ];
}

/**
 * Creates decorative moving clouds.
 * @returns {Cloud[]}
 */
function createClouds() {
    return [
        new Cloud("img/5_background/layers/4_clouds/1.png", 100),
        new Cloud("img/5_background/layers/4_clouds/2.png", 780),
        new Cloud("img/5_background/layers/4_clouds/1.png", 1480)
    ];
}

/**
 * Creates collectable coins.
 * @returns {Coin[]}
 */
function createCoins() {
    return [
        new Coin(420, 250),
        new Coin(620, 190),
        new Coin(860, 235),
        new Coin(1120, 180),
        new Coin(1380, 240),
        new Coin(1640, 190),
        new Coin(1980, 240),
        new Coin(2220, 190)
    ];
}

/**
 * Creates collectable bottles.
 * @returns {Bottle[]}
 */
function createBottles() {
    return [
        new Bottle(360, 345),
        new Bottle(650, 345),
        new Bottle(910, 345),
        new Bottle(1160, 345),
        new Bottle(1410, 345),
        new Bottle(1660, 345),
        new Bottle(1940, 345),
        new Bottle(2180, 345)
    ];
}

/**
 * Creates repeated background layers.
 * @returns {BackgroundObject[]}
 */
function createBackgroundObjects() {
    return [
        ...createBackgroundSet(-719, "1"),
        ...createBackgroundSet(0, "2"),
        ...createBackgroundSet(719, "1"),
        ...createBackgroundSet(1438, "2"),
        ...createBackgroundSet(2157, "1"),
        ...createBackgroundSet(2876, "2")
    ];
}

/**
 * Creates one full background stack.
 * @param {number} x horizontal position
 * @param {string} variant image variant
 * @returns {BackgroundObject[]}
 */
function createBackgroundSet(x, variant) {
    return [
        new BackgroundObject("img/5_background/layers/air.png", x),
        new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.png`, x),
        new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.png`, x),
        new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.png`, x)
    ];
}