(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('strudel'), require('mobx'), require('lit-html')) :
	typeof define === 'function' && define.amd ? define(['exports', 'strudel', 'mobx', 'lit-html'], factory) :
	(factory((global.strudelMobx = {}),global.strudel,global.mobx,global['lit-html']));
}(this, (function (exports,strudel,mobx,litHtml) { 'use strict';

var reactiveMixin = {
    init: function init() {
        var _this = this;

        this._mobx = mobx.autorun(function () {
            return _this._react();
        });
    },
    beforeDestroy: function beforeDestroy() {
        this._mobx.$mobx.dispose();
    },
    _react: function _react() {
        if (this.render) {
            strudel.element(document).trigger('contentunload', this.$element);
            litHtml.render(this.render(this), this.$element.first());
            strudel.element(document).trigger('contentloaded', this.$element);
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
    ['init', 'beforeDestroy', '_react'].forEach(function (funcName) {
        patch(target, funcName);
    });
};

var observer = function observer(arg) {
    var componentClass = arg;
    var target = componentClass.prototype;

    if (!target || !target.isStrudelClass) {
        throw new Error('Please pass a valid component to "observer"');
    }

    mixin(target);
    return target;
};

exports.Observer = observer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
