class StatusBar extends DrawableObject {
  percentage = 0;
  type = "health";

  constructor(type, x, y) {
    super();
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 60;
    this.loadImages(this.getImages());
    this.setPercentage(this.getInitialPercentage());
  }

  /**
   * Updates the visible status bar.
   * @param {number} percentage current percentage
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    this.img = this.imageCache[this.getImagePath()];
  }

  /**
   * Returns the initial value for this status bar.
   * @returns {number}
   */
  getInitialPercentage() {
    if (this.type === "health") return 100;
    if (this.type === "endboss") return 100;
    return 0;
  }

  /**
   * Returns the matching image collection.
   * @returns {string[]}
   */
  getImages() {
    if (this.type === "coin") return this.getCoinImages();
    if (this.type === "bottle") return this.getBottleImages();
    if (this.type === "endboss") return this.getEndbossImages();
    return this.getHealthImages();
  }

  /**
   * Returns health status bar images.
   * @returns {string[]}
   */
  getHealthImages() {
    return [
      "img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png",
    ];
  }

  /**
   * Returns coin status bar images.
   * @returns {string[]}
   */
  getCoinImages() {
    return [
      "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png",
    ];
  }

  /**
   * Returns bottle status bar images.
   * @returns {string[]}
   */
  getBottleImages() {
    return [
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
    ];
  }

  /**
   * Returns endboss status bar images.
   * @returns {string[]}
   */
  getEndbossImages() {
    return [
      "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
      "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
      "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
      "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
      "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
      "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
    ];
  }

  /**
   * Returns the matching image path for the current percentage.
   * @returns {string}
   */
  getImagePath() {
    return this.getImages()[this.resolveImageIndex()];
  }

  /**
   * Resolves the image index.
   * @returns {number}
   */
  resolveImageIndex() {
    if (this.percentage <= 0) return 0;
    if (this.percentage <= 20) return 1;
    if (this.percentage <= 40) return 2;
    if (this.percentage <= 60) return 3;
    if (this.percentage <= 80) return 4;
    return 5;
  }
}
