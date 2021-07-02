export function clickOutside(node, handler) {
    const clickHandler = (event) => {
        if (!node.contains(event.target)) {
            handler(event);
        }
    };
    window.addEventListener('click', clickHandler);

    return {
        destroy() {
            window.removeEventListener('click', clickHandler);
        }
    }
}
