export const create = gameContainerId => {
    var brimHolder = document.getElementById(gameContainerId);
    var landscapeHeight = window.screen.width;

    window.addEventListener("resize", onResize);

    var brimElement = document.createElement("div");
    brimElement.id = "brim";

    var brimText = document.createElement("p");
    brimText.className = "brim_text";
    brimText.appendChild(document.createTextNode("Scroll up for full screen"));
    brimText.appendChild(document.createElement("br"));
    brimText.appendChild(document.createTextNode("Or rotate to portrait mode and back again"));
    brimElement.appendChild(brimText);

    var arrow = document.createElement("a");
    arrow.className = "brim-arrow";
    brimElement.appendChild(arrow);

    brimHolder.appendChild(brimElement);
    brimHolder.className += "brim-disabled";

    onResize();

    function showBrim() {
        brimHolder.className = brimHolder.className.replace("brim-disabled", "brim-enabled");
        brimElement.style.visibility = "visible";
        brimElement.style.height = "9999999px";
        brimElement.style.pointerEvents = "all";
    }

    function showGame() {
        brimHolder.className = brimHolder.className.replace("brim-enabled", "brim-disabled");
        brimElement.style.visibility = "hidden";
        brimElement.style.height = landscapeHeight + 1 + "px";
        brimElement.style.pointerEvents = "none";
    }

    function onResize() {
        if (window.innerHeight > window.innerWidth || window.innerHeight === landscapeHeight) {
            showGame();
            window.scrollTo(0, 0);
        } else {
            showBrim();
            window.scrollTo(0, 0);
        }
    }

    return brimElement;
};
