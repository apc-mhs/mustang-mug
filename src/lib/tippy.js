import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default function(node, props) {
    if (props) tippy(node, props);

    return {
        update(newProps) {
            if (node._tippy) {
                if (newProps) node._tippy.setProps(newProps);
                else node._tippy.destroy();
            } else {
                if (newProps) tippy(node, newProps);
            }
        },
        destroy() {
            if (node._tippy) node._tippy.destroy();
        }
    };
}