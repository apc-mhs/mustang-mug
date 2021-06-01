import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away-subtle.css';

const defaultProps = {
    placement: 'top',
    arrow: true,
    duration: [100, 100],
    animation: 'shift-away-subtle',
    touch: ['hold', 450],
    trigger: 'mouseenter',
    maxWidth: 150,
};

function mergeProps(props) {
    if (typeof props === 'string') {
        props = { content: props };
    }

    return { ...defaultProps, ...props };
}

export default function (node, props) {
    if (props) tippy(node, mergeProps(props));

    return {
        update(newProps) {
            if (node._tippy) {
                if (newProps) node._tippy.setProps(mergeProps(newProps));
                else node._tippy.destroy();
            } else {
                if (newProps) tippy(node, mergeProps(newProps));
            }
        },
        destroy() {
            if (node._tippy) node._tippy.destroy();
        },
    };
}
