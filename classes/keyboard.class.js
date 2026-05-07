class Keyboard {
    left = false;
    right = false;
    up = false;
    space = false;
    d = false;
    h = false;

    /**
     * Updates the stored keyboard state.
     * @param {KeyboardEvent} event pressed or released key event
     * @param {boolean} isPressed current key state
     */
    setKey(event, isPressed) {
        this.setDirectionKey(event.code, isPressed);
        this.setActionKey(event.code, isPressed);
    }

    /**
     * Stores left and right movement keys.
     * @param {string} code keyboard event code
     * @param {boolean} isPressed current key state
     */
    setDirectionKey(code, isPressed) {
        if (code === "ArrowLeft") this.left = isPressed;
        if (code === "ArrowRight") this.right = isPressed;
    }

    /**
     * Stores jump, throw and debug keys.
     * @param {string} code keyboard event code
     * @param {boolean} isPressed current key state
     */
    setActionKey(code, isPressed) {
        if (code === "ArrowUp") this.up = isPressed;
        if (code === "Space") this.space = isPressed;
        if (code === "KeyD") this.d = isPressed;
        if (code === "KeyH") this.h = isPressed;
    }
}