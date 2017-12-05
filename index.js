(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mobx'), require('lit-html')) :
	typeof define === 'function' && define.amd ? define(['exports', 'mobx', 'lit-html'], factory) :
	(factory((global.strudelMobx = {}),global.mobx,global['lit-html']));
}(this, (function (exports,mobx,litHtml) { 'use strict';

var reactiveMixin = {
    init: function init() {
        var _this = this;

        this.$mobx = mobx.autorun(function () {
            return _this.render();
        });
    },
    beforeDestroy: function beforeDestroy() {
        this.$mobx.dispose();
    },
    render: function render$$1() {
        if (this.template) {
            litHtml.render(this.template(this), this.$element.first());
        }
    }
};

var patch = function patch(target, funcName) {
    var base = target[funcName];
    var mixinFunc = reactiveMixin[funcName];

    var f = !base ? mixinFunc : function () {
        base.apply(this, arguments);
        mixinFunc.apply(this, arguments);
    };

    target[funcName] = f;
};

var mixin = function mixin(target) {
    ['init', 'beforeDestroy', 'render'].forEach(function (funcName) {
        patch(target, funcName);
    });
};

var observer = function observer(arg) {
    var componentClass = arg;
    var target = componentClass.prototype || componentClass;
    mixin(target);
    return target;
};

exports.Observer = observer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
