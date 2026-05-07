class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    y = 0;

    constructor(imagePath, x) {
        super();
        this.x = x;
        this.loadImage(imagePath);
    }
}