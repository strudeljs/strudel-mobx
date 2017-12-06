import { element } from 'strudel';
import { autorun } from 'mobx';
import { render } from 'lit-html';

const reactiveMixin = {
    init() {
        this._mobx = autorun(() => this._react());
    },
    
    beforeDestroy() {
        this._mobx.$mobx.dispose();
    },

    _react() {
        if (this.render) {
            element(document).trigger('contentunload', this.$element);
            render(this.render(this), this.$element.first());
            element(document).trigger('contentloaded', this.$element);
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
    ['init', 'beforeDestroy', '_react'].forEach((funcName) => {
        patch(target, funcName);
    });
}

export const observer = (arg) => {
    const componentClass = arg;
    const target = componentClass.prototype;

    if (!target || !target.isStrudelClass) {
        throw new Error('Please pass a valid component to "observer"');
    }

    mixin(target);
    return target;
};