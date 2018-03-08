declare interface AccessibleDomElement {
    el: HTMLDivElement;
    hide: () => void;
    show: () => void;
    visible: () => boolean;
    remove: () => void;
    position: (positionOptions: { x; y; width; height }) => void;
}
