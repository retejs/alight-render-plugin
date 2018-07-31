import './index.sass';
import * as alight from 'alight';
import defaultTemplate from './node.pug';

function toClassName(str) {
    return str.toLowerCase().replace(/ /g, '-')
}

function install(editor, params) {

    const nodeAl = alight.makeInstance();
    const controlAl = alight.makeInstance();

    nodeAl.directives.al.socket = (scope, el, expression, env) => {
        const { locals } = env.changeDetector;
        const type = expression;

        scope.bindSocket(el, type, locals[type]);
    }

    nodeAl.directives.al.control = (scope, el, expression, env) => {
        const { locals } = env.changeDetector;
        const control = locals.input ? locals.input.control : locals.control;

        scope.bindControl(el, control);
    }

    function isSelected(node) {
        return editor.selected.contains(node);
    }

    editor.on('rendernode', ({ el, node, component, bindSocket, bindControl }) => {
        if (component.render && component.render !== 'alight') return;
        
        el.innerHTML = component.template || params.template || defaultTemplate();

        node._alight = nodeAl.bootstrap(el, { node, isSelected, bindSocket, bindControl, toClassName, Array });
    });

    editor.on('rendercontrol', ({ el, control }) => {
        if (control.render && control.render !== 'alight') return;

        const child = document.createElement('div');
        const html = control.template || '';
        const scope = control.scope || {};
        const mounted = control.mounted || function () { };
        
        el.appendChild(child);
        child.innerHTML = html;

        control.render = 'alight';
        control._alight = controlAl.bootstrap(child, scope);
        mounted.call(control);
    });

    editor.on('connectioncreated connectionremoved', connection => {
        connection.input.node._alight.scan();
    });

    editor.on('nodeselected', node => {
        editor.nodes.map(n => n._alight.scan());
        node._alight.scan();
    });
}

export default {
    install
}
