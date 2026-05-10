class DrawableObject {
  x = 120;
  y = 280;
  width = 100;
  height = 100;
  img;
  imageCache = {};
  currentImage = 0;

  /**
   * Loads one image and stores it as active image.
   * @param {string} path relative image path
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads all images into the object cache.
   * @param {string[]} paths relative image paths
   */
  loadImages(paths) {
    paths.forEach((path) => this.cacheImage(path));
  }

  /**
   * Draws the object on canvas.
   * @param {CanvasRenderingContext2D} ctx canvas context
   */
  draw(ctx) {
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Caches one image path.
   * @param {string} path relative image path
   */
  cacheImage(path) {
    const image = new Image();
    image.src = path;
    this.imageCache[path] = image;
  }
}
