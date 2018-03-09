export function accessibleDomElement(options) {
    const el = document.createElement("div");

    init();

    return {
        el,
        hide,
        show,
        visible,
        position,
        remove,
    };

    function init() {
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-label", options.ariaLabel);
        el.setAttribute("role", "button");
        el.style.position = "absolute";
        el.addEventListener("keyup", keyUp);
        el.addEventListener("click", options.onClick);
        options.parent.appendChild(el);
    }

    function hide() {
        el.setAttribute("tabindex", "-1");
        el.style.visibility = "hidden";
    }

    function show() {
        el.setAttribute("tabindex", "0");
        el.style.visibility = "visible";
    }

    function visible() {
        return el.style.visibility === "visible";
    }

    function position(positionOptions: { x; y; width; height }) {
        el.style.left = positionOptions.x.toString() + "px";
        el.style.top = positionOptions.y.toString() + "px";
        el.style.width = positionOptions.width.toString() + "px";
        el.style.height = positionOptions.height.toString() + "px";
    }

    function keyUp(event: KeyboardEvent) {
        const enterKey = event.key === "Enter";
        const spaceKey = event.key === " ";

        if (enterKey || spaceKey) {
            options.onClick();
        }
    }

    function remove() {
        el.remove();
    }
}
