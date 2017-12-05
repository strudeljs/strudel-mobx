import { autorun } from 'mobx';
import { render } from 'lit-html';

const reactiveMixin = {
    init() {
        this.$mobx = autorun(() => this.render());
    },
    
    beforeDestroy() {
        this.$mobx.dispose();
    },

    render() {
        if (this.template) {
            render(this.template(this), this.$element.first());
        }
    }
};

const patch = (target, funcName) => {
    const base = target[funcName];
    const mixinFunc = reactiveMixin[funcName];

    const f = !base ? mixinFunc : function() {
        base.apply(this, arguments);
        mixinFunc.apply(this, arguments);
    }

    target[funcName] = f;
}

const mixin = (target) =>  {
    ['init', 'beforeDestroy', 'render'].forEach((funcName) => {
        patch(target, funcName);
    });
}

export const observer = (arg) => {
    const componentClass = arg1;
    const target = componentClass.prototype || componentClass;
    mixin(target)
    return target;
};