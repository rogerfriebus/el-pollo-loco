class Bottle extends MovableObject {
    width = 65;
    height = 75;
    offset = {
        top: 10,
        right: 10,
        bottom: 5,
        left: 10
    };

    IMAGES_BOTTLE = [
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage(this.IMAGES_BOTTLE[0]);
        this.loadImages(this.IMAGES_BOTTLE);
        this.animate();
    }

    /**
     * Starts bottle idle animation.
     */
    animate() {
        setGameInterval(() => this.playAnimation(this.IMAGES_BOTTLE), 450);
    }
}