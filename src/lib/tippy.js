import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default function(node, props) {
    if (props) tippy(node, props);

    return {
        update(newProps) {
            if (newProps) node._tippy.setProps(newProps);
        },
        destroy() {
            node._tippy.destroy();
        }
    };
}