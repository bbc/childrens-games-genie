import { accessibleDomElement } from "./accessible-dom-element.js";

export function accessibilify(button, config, gameButton = true) {
    config = Object.assign(
        {
            id: button.name,
            ariaLabel: button.name,
        },
        config,
    );

    const game = button.game;
    const accessibleElement = newAccessibleElement();

    if (gameButton) {
        game.accessibleButtons.push(button);
    }

    assignEvents();
    setElementSizeAndPosition();

    button.accessibleElement = accessibleElement.el;

    return button;

    function newAccessibleElement() {
        return accessibleDomElement({
            id: config.id,
            ariaLabel: config.ariaLabel,
            parent: game.canvas.parentElement,
            onClick: buttonAction,
            onMouseOver: mouseOver,
            onMouseOut: mouseOut,
        });
    }

    function getHitAreaBounds() {
        let bounds = button.getBounds();
        if (button.hitArea) {
            bounds = button.hitArea.clone();
            bounds.topLeft = button.toGlobal(bounds.topLeft);
            bounds.scale(button.worldScale.x, button.worldScale.y);
        }
        bounds.topLeft = bounds.topLeft
            .multiply(game.scale.scaleFactorInversed.x, game.scale.scaleFactorInversed.y)
            .add(game.scale.margin.left, game.scale.margin.top);
        bounds.scale(game.scale.scaleFactorInversed.x, game.scale.scaleFactorInversed.y);
        return bounds;
    }

    function setElementSizeAndPosition() {
        if (button.alive) {
            const bounds = getHitAreaBounds();

            accessibleElement.position(bounds);
        }
    }

    function assignEvents() {
        const _destroy = button.destroy;
        button.destroy = () => {
            teardown();
            return _destroy.apply(button, arguments);
        };
        button.update = update;
    }

    function teardown() {
        accessibleElement.remove();
    }

    function update() {
        if (!button.worldPosition.equals(button.previousPosition)) {
            setElementSizeAndPosition();
        }

        if (!button.input.enabled) {
            if (accessibleElement.visible()) {
                accessibleElement.hide();
            }
            return;
        }

        if (!accessibleElement.visible()) {
            accessibleElement.show();
        }
    }

    function buttonAction() {
        if (game.sound.touchLocked) {
            game.sound.unlock();
        }
        button.events.onInputUp.dispatch(button, game.input.activePointer, false);
    }

    function mouseOver() {
        button.events.onInputOver.dispatch(button, game.input.activePointer, false);
    }

    function mouseOut() {
        button.events.onInputOut.dispatch(button, game.input.activePointer, false);
    }
}
