class Coin extends MovableObject {
    width = 80;
    height = 80;
    offset = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };

    IMAGES_COIN = [
        "img/8_coin/coin_1.png",
        "img/8_coin/coin_2.png"
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.animate();
    }

    /**
     * Starts coin animation.
     */
    animate() {
        setGameInterval(() => this.playAnimation(this.IMAGES_COIN), 300);
    }
}