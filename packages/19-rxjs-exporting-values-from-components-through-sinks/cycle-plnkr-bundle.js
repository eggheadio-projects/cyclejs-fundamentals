System.registerDynamic("npm:@cycle/dom@18.1.0/lib/thunk.js", ["snabbdom/h"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var h_1 = $__require("snabbdom/h");
    function copyToThunk(vnode, thunkVNode) {
        thunkVNode.elm = vnode.elm;
        vnode.data.fn = thunkVNode.data.fn;
        vnode.data.args = thunkVNode.data.args;
        vnode.data.isolate = thunkVNode.data.isolate;
        thunkVNode.data = vnode.data;
        thunkVNode.children = vnode.children;
        thunkVNode.text = vnode.text;
        thunkVNode.elm = vnode.elm;
    }
    function init(thunkVNode) {
        var cur = thunkVNode.data;
        var vnode = cur.fn.apply(undefined, cur.args);
        copyToThunk(vnode, thunkVNode);
    }
    function prepatch(oldVnode, thunkVNode) {
        var old = oldVnode.data,
            cur = thunkVNode.data;
        var i;
        var oldArgs = old.args,
            args = cur.args;
        if (old.fn !== cur.fn || oldArgs.length !== args.length) {
            copyToThunk(cur.fn.apply(undefined, args), thunkVNode);
        }
        for (i = 0; i < args.length; ++i) {
            if (oldArgs[i] !== args[i]) {
                copyToThunk(cur.fn.apply(undefined, args), thunkVNode);
                return;
            }
        }
        copyToThunk(oldVnode, thunkVNode);
    }
    function thunk(sel, key, fn, args) {
        if (args === undefined) {
            args = fn;
            fn = key;
            key = undefined;
        }
        return h_1.h(sel, {
            key: key,
            hook: { init: init, prepatch: prepatch },
            fn: fn,
            args: args
        });
    }
    exports.thunk = thunk;
    exports.default = thunk;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/thunk.js", ["./h"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var h_1 = $__require("./h");
    function copyToThunk(vnode, thunk) {
        thunk.elm = vnode.elm;
        vnode.data.fn = thunk.data.fn;
        vnode.data.args = thunk.data.args;
        thunk.data = vnode.data;
        thunk.children = vnode.children;
        thunk.text = vnode.text;
        thunk.elm = vnode.elm;
    }
    function init(thunk) {
        var cur = thunk.data;
        var vnode = cur.fn.apply(undefined, cur.args);
        copyToThunk(vnode, thunk);
    }
    function prepatch(oldVnode, thunk) {
        var i,
            old = oldVnode.data,
            cur = thunk.data;
        var oldArgs = old.args,
            args = cur.args;
        if (old.fn !== cur.fn || oldArgs.length !== args.length) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
        for (i = 0; i < args.length; ++i) {
            if (oldArgs[i] !== args[i]) {
                copyToThunk(cur.fn.apply(undefined, args), thunk);
                return;
            }
        }
        copyToThunk(oldVnode, thunk);
    }
    exports.thunk = function thunk(sel, key, fn, args) {
        if (args === undefined) {
            args = fn;
            fn = key;
            key = undefined;
        }
        return h_1.h(sel, {
            key: key,
            hook: { init: init, prepatch: prepatch },
            fn: fn,
            args: args
        });
    };
    exports.default = exports.thunk;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/snabbdom.js", ["./vnode", "./is", "./htmldomapi", "./h", "./thunk"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var vnode_1 = $__require("./vnode");
    var is = $__require("./is");
    var htmldomapi_1 = $__require("./htmldomapi");
    function isUndef(s) {
        return s === undefined;
    }
    function isDef(s) {
        return s !== undefined;
    }
    var emptyNode = vnode_1.default('', {}, [], undefined, undefined);
    function sameVnode(vnode1, vnode2) {
        return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
    }
    function isVnode(vnode) {
        return vnode.sel !== undefined;
    }
    function createKeyToOldIdx(children, beginIdx, endIdx) {
        var i,
            map = {},
            key,
            ch;
        for (i = beginIdx; i <= endIdx; ++i) {
            ch = children[i];
            if (ch != null) {
                key = ch.key;
                if (key !== undefined) map[key] = i;
            }
        }
        return map;
    }
    var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
    var h_1 = $__require("./h");
    exports.h = h_1.h;
    var thunk_1 = $__require("./thunk");
    exports.thunk = thunk_1.thunk;
    function init(modules, domApi) {
        var i,
            j,
            cbs = {};
        var api = domApi !== undefined ? domApi : htmldomapi_1.default;
        for (i = 0; i < hooks.length; ++i) {
            cbs[hooks[i]] = [];
            for (j = 0; j < modules.length; ++j) {
                var hook = modules[j][hooks[i]];
                if (hook !== undefined) {
                    cbs[hooks[i]].push(hook);
                }
            }
        }
        function emptyNodeAt(elm) {
            var id = elm.id ? '#' + elm.id : '';
            var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
            return vnode_1.default(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
        }
        function createRmCb(childElm, listeners) {
            return function rmCb() {
                if (--listeners === 0) {
                    var parent_1 = api.parentNode(childElm);
                    api.removeChild(parent_1, childElm);
                }
            };
        }
        function createElm(vnode, insertedVnodeQueue) {
            var i,
                data = vnode.data;
            if (data !== undefined) {
                if (isDef(i = data.hook) && isDef(i = i.init)) {
                    i(vnode);
                    data = vnode.data;
                }
            }
            var children = vnode.children,
                sel = vnode.sel;
            if (sel === '!') {
                if (isUndef(vnode.text)) {
                    vnode.text = '';
                }
                vnode.elm = api.createComment(vnode.text);
            } else if (sel !== undefined) {
                // Parse selector
                var hashIdx = sel.indexOf('#');
                var dotIdx = sel.indexOf('.', hashIdx);
                var hash = hashIdx > 0 ? hashIdx : sel.length;
                var dot = dotIdx > 0 ? dotIdx : sel.length;
                var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
                var elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) : api.createElement(tag);
                if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot));
                if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
                for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
                if (is.array(children)) {
                    for (i = 0; i < children.length; ++i) {
                        var ch = children[i];
                        if (ch != null) {
                            api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                        }
                    }
                } else if (is.primitive(vnode.text)) {
                    api.appendChild(elm, api.createTextNode(vnode.text));
                }
                i = vnode.data.hook; // Reuse variable
                if (isDef(i)) {
                    if (i.create) i.create(emptyNode, vnode);
                    if (i.insert) insertedVnodeQueue.push(vnode);
                }
            } else {
                vnode.elm = api.createTextNode(vnode.text);
            }
            return vnode.elm;
        }
        function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for (; startIdx <= endIdx; ++startIdx) {
                var ch = vnodes[startIdx];
                if (ch != null) {
                    api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
                }
            }
        }
        function invokeDestroyHook(vnode) {
            var i,
                j,
                data = vnode.data;
            if (data !== undefined) {
                if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
                for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
                if (vnode.children !== undefined) {
                    for (j = 0; j < vnode.children.length; ++j) {
                        i = vnode.children[j];
                        if (i != null && typeof i !== "string") {
                            invokeDestroyHook(i);
                        }
                    }
                }
            }
        }
        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var i_1 = void 0,
                    listeners = void 0,
                    rm = void 0,
                    ch = vnodes[startIdx];
                if (ch != null) {
                    if (isDef(ch.sel)) {
                        invokeDestroyHook(ch);
                        listeners = cbs.remove.length + 1;
                        rm = createRmCb(ch.elm, listeners);
                        for (i_1 = 0; i_1 < cbs.remove.length; ++i_1) cbs.remove[i_1](ch, rm);
                        if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                            i_1(ch, rm);
                        } else {
                            rm();
                        }
                    } else {
                        api.removeChild(parentElm, ch.elm);
                    }
                }
            }
        }
        function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
            var oldStartIdx = 0,
                newStartIdx = 0;
            var oldEndIdx = oldCh.length - 1;
            var oldStartVnode = oldCh[0];
            var oldEndVnode = oldCh[oldEndIdx];
            var newEndIdx = newCh.length - 1;
            var newStartVnode = newCh[0];
            var newEndVnode = newCh[newEndIdx];
            var oldKeyToIdx;
            var idxInOld;
            var elmToMove;
            var before;
            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (oldStartVnode == null) {
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
                } else if (oldEndVnode == null) {
                    oldEndVnode = oldCh[--oldEndIdx];
                } else if (newStartVnode == null) {
                    newStartVnode = newCh[++newStartIdx];
                } else if (newEndVnode == null) {
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldStartVnode, newEndVnode)) {
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                    api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (sameVnode(oldEndVnode, newStartVnode)) {
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                    api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    if (oldKeyToIdx === undefined) {
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                    }
                    idxInOld = oldKeyToIdx[newStartVnode.key];
                    if (isUndef(idxInOld)) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                        newStartVnode = newCh[++newStartIdx];
                    } else {
                        elmToMove = oldCh[idxInOld];
                        if (elmToMove.sel !== newStartVnode.sel) {
                            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                        } else {
                            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                            oldCh[idxInOld] = undefined;
                            api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                        }
                        newStartVnode = newCh[++newStartIdx];
                    }
                }
            }
            if (oldStartIdx > oldEndIdx) {
                before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            } else if (newStartIdx > newEndIdx) {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
        function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
            var i, hook;
            if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
                i(oldVnode, vnode);
            }
            var elm = vnode.elm = oldVnode.elm;
            var oldCh = oldVnode.children;
            var ch = vnode.children;
            if (oldVnode === vnode) return;
            if (vnode.data !== undefined) {
                for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
                i = vnode.data.hook;
                if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
            }
            if (isUndef(vnode.text)) {
                if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
                } else if (isDef(ch)) {
                    if (isDef(oldVnode.text)) api.setTextContent(elm, '');
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                } else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                } else if (isDef(oldVnode.text)) {
                    api.setTextContent(elm, '');
                }
            } else if (oldVnode.text !== vnode.text) {
                api.setTextContent(elm, vnode.text);
            }
            if (isDef(hook) && isDef(i = hook.postpatch)) {
                i(oldVnode, vnode);
            }
        }
        return function patch(oldVnode, vnode) {
            var i, elm, parent;
            var insertedVnodeQueue = [];
            for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
            if (!isVnode(oldVnode)) {
                oldVnode = emptyNodeAt(oldVnode);
            }
            if (sameVnode(oldVnode, vnode)) {
                patchVnode(oldVnode, vnode, insertedVnodeQueue);
            } else {
                elm = oldVnode.elm;
                parent = api.parentNode(elm);
                createElm(vnode, insertedVnodeQueue);
                if (parent !== null) {
                    api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                    removeVnodes(parent, [oldVnode], 0, 0);
                }
            }
            for (i = 0; i < insertedVnodeQueue.length; ++i) {
                insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
            }
            for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
            return vnode;
        };
    }
    exports.init = init;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/DocumentDOMSource.js", ["xstream", "@cycle/run/lib/adapt", "./fromEvent"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var xstream_1 = $__require("xstream");
    var adapt_1 = $__require("@cycle/run/lib/adapt");
    var fromEvent_1 = $__require("./fromEvent");
    var DocumentDOMSource = function () {
        function DocumentDOMSource(_name) {
            this._name = _name;
        }
        DocumentDOMSource.prototype.select = function (selector) {
            // This functionality is still undefined/undecided.
            return this;
        };
        DocumentDOMSource.prototype.elements = function () {
            var out = adapt_1.adapt(xstream_1.default.of(document));
            out._isCycleSource = this._name;
            return out;
        };
        DocumentDOMSource.prototype.events = function (eventType, options) {
            if (options === void 0) {
                options = {};
            }
            var stream;
            stream = fromEvent_1.fromEvent(document, eventType, options.useCapture, options.preventDefault);
            var out = adapt_1.adapt(stream);
            out._isCycleSource = this._name;
            return out;
        };
        return DocumentDOMSource;
    }();
    exports.DocumentDOMSource = DocumentDOMSource;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/BodyDOMSource.js", ["xstream", "@cycle/run/lib/adapt", "./fromEvent"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var xstream_1 = $__require("xstream");
    var adapt_1 = $__require("@cycle/run/lib/adapt");
    var fromEvent_1 = $__require("./fromEvent");
    var BodyDOMSource = function () {
        function BodyDOMSource(_name) {
            this._name = _name;
        }
        BodyDOMSource.prototype.select = function (selector) {
            // This functionality is still undefined/undecided.
            return this;
        };
        BodyDOMSource.prototype.elements = function () {
            var out = adapt_1.adapt(xstream_1.default.of(document.body));
            out._isCycleSource = this._name;
            return out;
        };
        BodyDOMSource.prototype.events = function (eventType, options) {
            if (options === void 0) {
                options = {};
            }
            var stream;
            stream = fromEvent_1.fromEvent(document.body, eventType, options.useCapture, options.preventDefault);
            var out = adapt_1.adapt(stream);
            out._isCycleSource = this._name;
            return out;
        };
        return BodyDOMSource;
    }();
    exports.BodyDOMSource = BodyDOMSource;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/ElementFinder.js", ["./ScopeChecker", "./utils", "./matchesSelector"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScopeChecker_1 = $__require("./ScopeChecker");
    var utils_1 = $__require("./utils");
    var matchesSelector_1 = $__require("./matchesSelector");
    function toElArray(input) {
        return Array.prototype.slice.call(input);
    }
    var ElementFinder = function () {
        function ElementFinder(namespace, isolateModule) {
            this.namespace = namespace;
            this.isolateModule = isolateModule;
        }
        ElementFinder.prototype.call = function (rootElement) {
            var namespace = this.namespace;
            var selector = utils_1.getSelectors(namespace);
            if (!selector) {
                return rootElement;
            }
            var fullScope = utils_1.getFullScope(namespace);
            var scopeChecker = new ScopeChecker_1.ScopeChecker(fullScope, this.isolateModule);
            var topNode = fullScope ? this.isolateModule.getElement(fullScope) || rootElement : rootElement;
            var topNodeMatchesSelector = !!fullScope && !!selector && matchesSelector_1.matchesSelector(topNode, selector);
            return toElArray(topNode.querySelectorAll(selector)).filter(scopeChecker.isDirectlyInScope, scopeChecker).concat(topNodeMatchesSelector ? [topNode] : []);
        };
        return ElementFinder;
    }();
    exports.ElementFinder = ElementFinder;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/fromEvent.js", ["xstream"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var xstream_1 = $__require("xstream");
    function fromEvent(element, eventName, useCapture, preventDefault) {
        if (useCapture === void 0) {
            useCapture = false;
        }
        if (preventDefault === void 0) {
            preventDefault = false;
        }
        return xstream_1.Stream.create({
            element: element,
            next: null,
            start: function start(listener) {
                if (preventDefault) {
                    this.next = function next(event) {
                        event.preventDefault();
                        listener.next(event);
                    };
                } else {
                    this.next = function next(event) {
                        listener.next(event);
                    };
                }
                this.element.addEventListener(eventName, this.next, useCapture);
            },
            stop: function stop() {
                this.element.removeEventListener(eventName, this.next, useCapture);
            }
        });
    }
    exports.fromEvent = fromEvent;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/isolate.js", ["snabbdom/vnode", "./utils"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var vnode_1 = $__require("snabbdom/vnode");
    var utils_1 = $__require("./utils");
    function totalIsolateSource(source, scope) {
        return source.select(utils_1.SCOPE_PREFIX + scope);
    }
    function siblingIsolateSource(source, scope) {
        return source.select(scope);
    }
    function isolateSource(source, scope) {
        if (scope === ':root') {
            return source;
        } else if (utils_1.isClassOrId(scope)) {
            return siblingIsolateSource(source, scope);
        } else {
            return totalIsolateSource(source, scope);
        }
    }
    exports.isolateSource = isolateSource;
    function siblingIsolateSink(sink, scope) {
        return sink.map(function (node) {
            return node ? vnode_1.vnode(node.sel + scope, node.data, node.children, node.text, node.elm) : node;
        });
    }
    exports.siblingIsolateSink = siblingIsolateSink;
    function totalIsolateSink(sink, fullScope) {
        return sink.map(function (node) {
            if (!node) {
                return node;
            }
            // Ignore if already had up-to-date full scope in vnode.data.isolate
            if (node.data && node.data.isolate) {
                var isolateData = node.data.isolate;
                var prevFullScopeNum = isolateData.replace(/(cycle|\-)/g, '');
                var fullScopeNum = fullScope.replace(/(cycle|\-)/g, '');
                if (isNaN(parseInt(prevFullScopeNum)) || isNaN(parseInt(fullScopeNum)) || prevFullScopeNum > fullScopeNum) {
                    // > is lexicographic string comparison
                    return node;
                }
            }
            // Insert up-to-date full scope in vnode.data.isolate, and also a key if needed
            node.data = node.data || {};
            node.data.isolate = fullScope;
            if (typeof node.key === 'undefined') {
                node.key = utils_1.SCOPE_PREFIX + fullScope;
            }
            return node;
        });
    }
    exports.totalIsolateSink = totalIsolateSink;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/ScopeChecker.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScopeChecker = function () {
        function ScopeChecker(fullScope, isolateModule) {
            this.fullScope = fullScope;
            this.isolateModule = isolateModule;
        }
        /**
         * Checks whether the given element is *directly* in the scope of this
         * scope checker. Being contained *indirectly* through other scopes
         * is not valid. This is crucial for implementing parent-child isolation,
         * so that the parent selectors don't search inside a child scope.
         */
        ScopeChecker.prototype.isDirectlyInScope = function (leaf) {
            for (var el = leaf; el; el = el.parentElement) {
                var fullScope = this.isolateModule.getFullScope(el);
                if (fullScope && fullScope !== this.fullScope) {
                    return false;
                }
                if (fullScope) {
                    return true;
                }
            }
            return true;
        };
        return ScopeChecker;
    }();
    exports.ScopeChecker = ScopeChecker;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/matchesSelector.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    function createMatchesSelector() {
        var vendor;
        try {
            var proto = Element.prototype;
            vendor = proto.matches || proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;
        } catch (err) {
            vendor = null;
        }
        return function match(elem, selector) {
            if (selector.length === 0) {
                return true;
            }
            if (vendor) {
                return vendor.call(elem, selector);
            }
            var nodes = elem.parentNode.querySelectorAll(selector);
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i] === elem) {
                    return true;
                }
            }
            return false;
        };
    }
    exports.matchesSelector = createMatchesSelector();
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/EventDelegator.js", ["xstream", "./ScopeChecker", "./utils", "./matchesSelector"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var xstream_1 = $__require("xstream");
    var ScopeChecker_1 = $__require("./ScopeChecker");
    var utils_1 = $__require("./utils");
    var matchesSelector_1 = $__require("./matchesSelector");
    /**
     * Finds (with binary search) index of the destination that id equal to searchId
     * among the destinations in the given array.
     */
    function indexOf(arr, searchId) {
        var minIndex = 0;
        var maxIndex = arr.length - 1;
        var currentIndex;
        var current;
        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0; // tslint:disable-line:no-bitwise
            current = arr[currentIndex];
            var currentId = current.id;
            if (currentId < searchId) {
                minIndex = currentIndex + 1;
            } else if (currentId > searchId) {
                maxIndex = currentIndex - 1;
            } else {
                return currentIndex;
            }
        }
        return -1;
    }
    /**
     * Manages "Event delegation", by connecting an origin with multiple
     * destinations.
     *
     * Attaches a DOM event listener to the DOM element called the "origin",
     * and delegates events to "destinations", which are subjects as outputs
     * for the DOMSource. Simulates bubbling or capturing, with regards to
     * isolation boundaries too.
     */
    var EventDelegator = function () {
        function EventDelegator(origin, eventType, useCapture, isolateModule, preventDefault) {
            if (preventDefault === void 0) {
                preventDefault = false;
            }
            var _this = this;
            this.origin = origin;
            this.eventType = eventType;
            this.useCapture = useCapture;
            this.isolateModule = isolateModule;
            this.preventDefault = preventDefault;
            this.destinations = [];
            this._lastId = 0;
            if (preventDefault) {
                if (useCapture) {
                    this.listener = function (ev) {
                        ev.preventDefault();
                        _this.capture(ev);
                    };
                } else {
                    this.listener = function (ev) {
                        ev.preventDefault();
                        _this.bubble(ev);
                    };
                }
            } else {
                if (useCapture) {
                    this.listener = function (ev) {
                        return _this.capture(ev);
                    };
                } else {
                    this.listener = function (ev) {
                        return _this.bubble(ev);
                    };
                }
            }
            origin.addEventListener(eventType, this.listener, useCapture);
        }
        EventDelegator.prototype.updateOrigin = function (newOrigin) {
            this.origin.removeEventListener(this.eventType, this.listener, this.useCapture);
            newOrigin.addEventListener(this.eventType, this.listener, this.useCapture);
            this.origin = newOrigin;
        };
        /**
         * Creates a *new* destination given the namespace and returns the subject
         * representing the destination of events. Is not referentially transparent,
         * will always return a different output for the same input.
         */
        EventDelegator.prototype.createDestination = function (namespace) {
            var _this = this;
            var id = this._lastId++;
            var selector = utils_1.getSelectors(namespace);
            var scopeChecker = new ScopeChecker_1.ScopeChecker(utils_1.getFullScope(namespace), this.isolateModule);
            var subject = xstream_1.default.create({
                start: function () {},
                stop: function () {
                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(function () {
                            _this.removeDestination(id);
                        });
                    } else {
                        _this.removeDestination(id);
                    }
                }
            });
            var destination = { id: id, selector: selector, scopeChecker: scopeChecker, subject: subject };
            this.destinations.push(destination);
            return subject;
        };
        /**
         * Removes the destination that has the given id.
         */
        EventDelegator.prototype.removeDestination = function (id) {
            var i = indexOf(this.destinations, id);
            i >= 0 && this.destinations.splice(i, 1); // tslint:disable-line:no-unused-expression
        };
        EventDelegator.prototype.capture = function (ev) {
            var n = this.destinations.length;
            for (var i = 0; i < n; i++) {
                var dest = this.destinations[i];
                if (matchesSelector_1.matchesSelector(ev.target, dest.selector)) {
                    dest.subject._n(ev);
                }
            }
        };
        EventDelegator.prototype.bubble = function (rawEvent) {
            var origin = this.origin;
            if (!origin.contains(rawEvent.currentTarget)) {
                return;
            }
            var roof = origin.parentElement;
            var ev = this.patchEvent(rawEvent);
            for (var el = ev.target; el && el !== roof; el = el.parentElement) {
                if (!origin.contains(el)) {
                    ev.stopPropagation();
                }
                if (ev.propagationHasBeenStopped) {
                    return;
                }
                this.matchEventAgainstDestinations(el, ev);
            }
        };
        EventDelegator.prototype.patchEvent = function (event) {
            var pEvent = event;
            pEvent.propagationHasBeenStopped = false;
            var oldStopPropagation = pEvent.stopPropagation;
            pEvent.stopPropagation = function stopPropagation() {
                oldStopPropagation.call(this);
                this.propagationHasBeenStopped = true;
            };
            return pEvent;
        };
        EventDelegator.prototype.matchEventAgainstDestinations = function (el, ev) {
            var n = this.destinations.length;
            for (var i = 0; i < n; i++) {
                var dest = this.destinations[i];
                if (!dest.scopeChecker.isDirectlyInScope(el)) {
                    continue;
                }
                if (matchesSelector_1.matchesSelector(el, dest.selector)) {
                    this.mutateEventCurrentTarget(ev, el);
                    dest.subject._n(ev);
                }
            }
        };
        EventDelegator.prototype.mutateEventCurrentTarget = function (event, currentTargetElement) {
            try {
                Object.defineProperty(event, "currentTarget", {
                    value: currentTargetElement,
                    configurable: true
                });
            } catch (err) {
                console.log("please use event.ownerTarget");
            }
            event.ownerTarget = currentTargetElement;
        };
        return EventDelegator;
    }();
    exports.EventDelegator = EventDelegator;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/MainDOMSource.js", ["@cycle/run/lib/adapt", "./DocumentDOMSource", "./BodyDOMSource", "./ElementFinder", "./fromEvent", "./isolate", "./EventDelegator", "./utils"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var adapt_1 = $__require("@cycle/run/lib/adapt");
    var DocumentDOMSource_1 = $__require("./DocumentDOMSource");
    var BodyDOMSource_1 = $__require("./BodyDOMSource");
    var ElementFinder_1 = $__require("./ElementFinder");
    var fromEvent_1 = $__require("./fromEvent");
    var isolate_1 = $__require("./isolate");
    var EventDelegator_1 = $__require("./EventDelegator");
    var utils_1 = $__require("./utils");
    var eventTypesThatDontBubble = ["blur", "canplay", "canplaythrough", "change", "durationchange", "emptied", "ended", "focus", "load", "loadeddata", "loadedmetadata", "mouseenter", "mouseleave", "pause", "play", "playing", "ratechange", "reset", "scroll", "seeked", "seeking", "stalled", "submit", "suspend", "timeupdate", "unload", "volumechange", "waiting"];
    function determineUseCapture(eventType, options) {
        var result = false;
        if (typeof options.useCapture === 'boolean') {
            result = options.useCapture;
        }
        if (eventTypesThatDontBubble.indexOf(eventType) !== -1) {
            result = true;
        }
        return result;
    }
    function filterBasedOnIsolation(domSource, fullScope) {
        return function filterBasedOnIsolationOperator(rootElement$) {
            var initialState = {
                wasIsolated: false,
                shouldPass: false,
                element: null
            };
            return rootElement$.fold(function checkIfShouldPass(state, element) {
                var isIsolated = !!domSource._isolateModule.getElement(fullScope);
                state.shouldPass = isIsolated && !state.wasIsolated;
                state.wasIsolated = isIsolated;
                state.element = element;
                return state;
            }, initialState).drop(1).filter(function (s) {
                return s.shouldPass;
            }).map(function (s) {
                return s.element;
            });
        };
    }
    var MainDOMSource = function () {
        function MainDOMSource(_rootElement$, _sanitation$, _namespace, _isolateModule, _delegators, _name) {
            if (_namespace === void 0) {
                _namespace = [];
            }
            var _this = this;
            this._rootElement$ = _rootElement$;
            this._sanitation$ = _sanitation$;
            this._namespace = _namespace;
            this._isolateModule = _isolateModule;
            this._delegators = _delegators;
            this._name = _name;
            this.isolateSource = isolate_1.isolateSource;
            this.isolateSink = function (sink, scope) {
                if (scope === ':root') {
                    return sink;
                } else if (utils_1.isClassOrId(scope)) {
                    return isolate_1.siblingIsolateSink(sink, scope);
                } else {
                    var prevFullScope = utils_1.getFullScope(_this._namespace);
                    var nextFullScope = [prevFullScope, scope].filter(function (x) {
                        return !!x;
                    }).join('-');
                    return isolate_1.totalIsolateSink(sink, nextFullScope);
                }
            };
        }
        MainDOMSource.prototype.elements = function () {
            var output$;
            if (this._namespace.length === 0) {
                output$ = this._rootElement$;
            } else {
                var elementFinder_1 = new ElementFinder_1.ElementFinder(this._namespace, this._isolateModule);
                output$ = this._rootElement$.map(function (el) {
                    return elementFinder_1.call(el);
                });
            }
            var out = adapt_1.adapt(output$.remember());
            out._isCycleSource = this._name;
            return out;
        };
        Object.defineProperty(MainDOMSource.prototype, "namespace", {
            get: function () {
                return this._namespace;
            },
            enumerable: true,
            configurable: true
        });
        MainDOMSource.prototype.select = function (selector) {
            if (typeof selector !== 'string') {
                throw new Error("DOM driver's select() expects the argument to be a " + "string as a CSS selector");
            }
            if (selector === 'document') {
                return new DocumentDOMSource_1.DocumentDOMSource(this._name);
            }
            if (selector === 'body') {
                return new BodyDOMSource_1.BodyDOMSource(this._name);
            }
            var trimmedSelector = selector.trim();
            var childNamespace = trimmedSelector === ":root" ? this._namespace : this._namespace.concat(trimmedSelector);
            return new MainDOMSource(this._rootElement$, this._sanitation$, childNamespace, this._isolateModule, this._delegators, this._name);
        };
        MainDOMSource.prototype.events = function (eventType, options) {
            if (options === void 0) {
                options = {};
            }
            if (typeof eventType !== "string") {
                throw new Error("DOM driver's events() expects argument to be a " + "string representing the event type to listen for.");
            }
            var useCapture = determineUseCapture(eventType, options);
            var namespace = this._namespace;
            var fullScope = utils_1.getFullScope(namespace);
            var keyParts = [eventType, useCapture];
            if (fullScope) {
                keyParts.push(fullScope);
            }
            var key = keyParts.join('~');
            var domSource = this;
            var rootElement$;
            if (fullScope) {
                rootElement$ = this._rootElement$.compose(filterBasedOnIsolation(domSource, fullScope));
            } else {
                rootElement$ = this._rootElement$.take(2);
            }
            var event$ = rootElement$.map(function setupEventDelegatorOnTopElement(rootElement) {
                // Event listener just for the root element
                if (!namespace || namespace.length === 0) {
                    return fromEvent_1.fromEvent(rootElement, eventType, useCapture, options.preventDefault);
                }
                // Event listener on the origin element as an EventDelegator
                var delegators = domSource._delegators;
                var origin = domSource._isolateModule.getElement(fullScope) || rootElement;
                var delegator;
                if (delegators.has(key)) {
                    delegator = delegators.get(key);
                    delegator.updateOrigin(origin);
                } else {
                    delegator = new EventDelegator_1.EventDelegator(origin, eventType, useCapture, domSource._isolateModule, options.preventDefault);
                    delegators.set(key, delegator);
                }
                if (fullScope) {
                    domSource._isolateModule.addEventDelegator(fullScope, delegator);
                }
                var subject = delegator.createDestination(namespace);
                return subject;
            }).flatten();
            var out = adapt_1.adapt(event$);
            out._isCycleSource = domSource._name;
            return out;
        };
        MainDOMSource.prototype.dispose = function () {
            this._sanitation$.shamefullySendNext(null);
            this._isolateModule.reset();
        };
        return MainDOMSource;
    }();
    exports.MainDOMSource = MainDOMSource;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/htmldomapi.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    function createElement(tagName) {
        return document.createElement(tagName);
    }
    function createElementNS(namespaceURI, qualifiedName) {
        return document.createElementNS(namespaceURI, qualifiedName);
    }
    function createTextNode(text) {
        return document.createTextNode(text);
    }
    function createComment(text) {
        return document.createComment(text);
    }
    function insertBefore(parentNode, newNode, referenceNode) {
        parentNode.insertBefore(newNode, referenceNode);
    }
    function removeChild(node, child) {
        node.removeChild(child);
    }
    function appendChild(node, child) {
        node.appendChild(child);
    }
    function parentNode(node) {
        return node.parentNode;
    }
    function nextSibling(node) {
        return node.nextSibling;
    }
    function tagName(elm) {
        return elm.tagName;
    }
    function setTextContent(node, text) {
        node.textContent = text;
    }
    function getTextContent(node) {
        return node.textContent;
    }
    function isElement(node) {
        return node.nodeType === 1;
    }
    function isText(node) {
        return node.nodeType === 3;
    }
    function isComment(node) {
        return node.nodeType === 8;
    }
    exports.htmlDomApi = {
        createElement: createElement,
        createElementNS: createElementNS,
        createTextNode: createTextNode,
        createComment: createComment,
        insertBefore: insertBefore,
        removeChild: removeChild,
        appendChild: appendChild,
        parentNode: parentNode,
        nextSibling: nextSibling,
        tagName: tagName,
        setTextContent: setTextContent,
        getTextContent: getTextContent,
        isElement: isElement,
        isText: isText,
        isComment: isComment
    };
    exports.default = exports.htmlDomApi;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/tovnode.js", ["./vnode", "./htmldomapi"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var vnode_1 = $__require("./vnode");
    var htmldomapi_1 = $__require("./htmldomapi");
    function toVNode(node, domApi) {
        var api = domApi !== undefined ? domApi : htmldomapi_1.default;
        var text;
        if (api.isElement(node)) {
            var id = node.id ? '#' + node.id : '';
            var cn = node.getAttribute('class');
            var c = cn ? '.' + cn.split(' ').join('.') : '';
            var sel = api.tagName(node).toLowerCase() + id + c;
            var attrs = {};
            var children = [];
            var name_1;
            var i = void 0,
                n = void 0;
            var elmAttrs = node.attributes;
            var elmChildren = node.childNodes;
            for (i = 0, n = elmAttrs.length; i < n; i++) {
                name_1 = elmAttrs[i].nodeName;
                if (name_1 !== 'id' && name_1 !== 'class') {
                    attrs[name_1] = elmAttrs[i].nodeValue;
                }
            }
            for (i = 0, n = elmChildren.length; i < n; i++) {
                children.push(toVNode(elmChildren[i]));
            }
            return vnode_1.default(sel, { attrs: attrs }, children, undefined, node);
        } else if (api.isText(node)) {
            text = api.getTextContent(node);
            return vnode_1.default(undefined, undefined, undefined, text, node);
        } else if (api.isComment(node)) {
            text = api.getTextContent(node);
            return vnode_1.default('!', {}, [], text, node);
        } else {
            return vnode_1.default('', {}, [], undefined, node);
        }
    }
    exports.toVNode = toVNode;
    exports.default = toVNode;
    
});
System.registerDynamic('npm:snabbdom-selector@1.2.1/lib/commonjs/classNameFromVNode.js', ['./selectorParser'], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    var selectorParser_1 = $__require('./selectorParser');
    function classNameFromVNode(vNode) {
        var _a = selectorParser_1.selectorParser(vNode).className,
            cn = _a === void 0 ? '' : _a;
        if (!vNode.data) {
            return cn;
        }
        var _b = vNode.data,
            dataClass = _b.class,
            props = _b.props;
        if (dataClass) {
            var c = Object.keys(dataClass).filter(function (cl) {
                return dataClass[cl];
            });
            cn += " " + c.join(" ");
        }
        if (props && props.className) {
            cn += " " + props.className;
        }
        return cn && cn.trim();
    }
    exports.classNameFromVNode = classNameFromVNode;
    
});
System.registerDynamic("npm:snabbdom-selector@1.2.1.json", [], true, function() {
  return {
    "main": "lib/commonjs/index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      },
      "lib/es2015/classNameFromVNode.js": {
        "format": "esm"
      },
      "lib/es2015/curry2.js": {
        "format": "esm"
      },
      "lib/es2015/findMatches.js": {
        "format": "esm"
      },
      "lib/es2015/index.js": {
        "format": "esm"
      },
      "lib/es2015/language.js": {
        "format": "esm"
      },
      "lib/es2015/selectorParser.js": {
        "format": "esm"
      }
    },
    "map": {
      "./lib/commonjs": "./lib/commonjs/index.js"
    }
  };
});

System.registerDynamic('npm:snabbdom-selector@1.2.1/lib/commonjs/selectorParser.js', [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    function selectorParser(node) {
        if (!node.sel) {
            return {
                tagName: '',
                id: '',
                className: ''
            };
        }
        var sel = node.sel;
        var hashIdx = sel.indexOf('#');
        var dotIdx = sel.indexOf('.', hashIdx);
        var hash = hashIdx > 0 ? hashIdx : sel.length;
        var dot = dotIdx > 0 ? dotIdx : sel.length;
        var tagName = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
        var id = hash < dot ? sel.slice(hash + 1, dot) : void 0;
        var className = dotIdx > 0 ? sel.slice(dot + 1).replace(/\./g, ' ') : void 0;
        return {
            tagName: tagName,
            id: id,
            className: className
        };
    }
    exports.selectorParser = selectorParser;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/VNodeWrapper.js", ["snabbdom/vnode", "snabbdom/h", "snabbdom-selector/lib/commonjs/classNameFromVNode", "snabbdom-selector/lib/commonjs/selectorParser", "./utils"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var vnode_1 = $__require("snabbdom/vnode");
    var h_1 = $__require("snabbdom/h");
    var classNameFromVNode_1 = $__require("snabbdom-selector/lib/commonjs/classNameFromVNode");
    var selectorParser_1 = $__require("snabbdom-selector/lib/commonjs/selectorParser");
    var utils_1 = $__require("./utils");
    var VNodeWrapper = function () {
        function VNodeWrapper(rootElement) {
            this.rootElement = rootElement;
        }
        VNodeWrapper.prototype.call = function (vnode) {
            if (utils_1.isDocFrag(this.rootElement)) {
                return this.wrapDocFrag(vnode === null ? [] : [vnode]);
            }
            if (vnode === null) {
                return this.wrap([]);
            }
            var _a = selectorParser_1.selectorParser(vnode),
                selTagName = _a.tagName,
                selId = _a.id;
            var vNodeClassName = classNameFromVNode_1.classNameFromVNode(vnode);
            var vNodeData = vnode.data || {};
            var vNodeDataProps = vNodeData.props || {};
            var _b = vNodeDataProps.id,
                vNodeId = _b === void 0 ? selId : _b;
            var isVNodeAndRootElementIdentical = typeof vNodeId === 'string' && vNodeId.toUpperCase() === this.rootElement.id.toUpperCase() && selTagName.toUpperCase() === this.rootElement.tagName.toUpperCase() && vNodeClassName.toUpperCase() === this.rootElement.className.toUpperCase();
            if (isVNodeAndRootElementIdentical) {
                return vnode;
            }
            return this.wrap([vnode]);
        };
        VNodeWrapper.prototype.wrapDocFrag = function (children) {
            return vnode_1.vnode('', {}, children, undefined, this.rootElement);
        };
        VNodeWrapper.prototype.wrap = function (children) {
            var _a = this.rootElement,
                tagName = _a.tagName,
                id = _a.id,
                className = _a.className;
            var selId = id ? "#" + id : '';
            var selClass = className ? "." + className.split(" ").join(".") : '';
            return h_1.h("" + tagName.toLowerCase() + selId + selClass, {}, children);
        };
        return VNodeWrapper;
    }();
    exports.VNodeWrapper = VNodeWrapper;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/utils.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    function isValidNode(obj) {
        var ELEM_TYPE = 1;
        var FRAG_TYPE = 11;
        return typeof HTMLElement === 'object' ? obj instanceof HTMLElement || obj instanceof DocumentFragment : obj && typeof obj === 'object' && obj !== null && (obj.nodeType === ELEM_TYPE || obj.nodeType === FRAG_TYPE) && typeof obj.nodeName === 'string';
    }
    function isClassOrId(str) {
        return str.length > 1 && (str[0] === '.' || str[0] === '#');
    }
    exports.isClassOrId = isClassOrId;
    function isDocFrag(el) {
        return el.nodeType === 11;
    }
    exports.isDocFrag = isDocFrag;
    exports.SCOPE_PREFIX = '$$CYCLEDOM$$-';
    function getValidNode(selectors) {
        var domElement = typeof selectors === 'string' ? document.querySelector(selectors) : selectors;
        if (typeof selectors === 'string' && domElement === null) {
            throw new Error("Cannot render into unknown element `" + selectors + "`");
        } else if (!isValidNode(domElement)) {
            throw new Error('Given container is not a DOM element neither a ' + 'selector string.');
        }
        return domElement;
    }
    exports.getValidNode = getValidNode;
    /**
     * The full scope of a namespace is the "absolute path" of scopes from
     * parent to child. This is extracted from the namespace, filter only for
     * scopes in the namespace.
     */
    function getFullScope(namespace) {
        return namespace.filter(function (c) {
            return c.indexOf(exports.SCOPE_PREFIX) > -1;
        }).map(function (c) {
            return c.replace(exports.SCOPE_PREFIX, '');
        }).join('-');
    }
    exports.getFullScope = getFullScope;
    function getSelectors(namespace) {
        return namespace.filter(function (c) {
            return c.indexOf(exports.SCOPE_PREFIX) === -1;
        }).join(' ');
    }
    exports.getSelectors = getSelectors;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/modules/class.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    function updateClass(oldVnode, vnode) {
        var cur,
            name,
            elm = vnode.elm,
            oldClass = oldVnode.data.class,
            klass = vnode.data.class;
        if (!oldClass && !klass) return;
        if (oldClass === klass) return;
        oldClass = oldClass || {};
        klass = klass || {};
        for (name in oldClass) {
            if (!klass[name]) {
                elm.classList.remove(name);
            }
        }
        for (name in klass) {
            cur = klass[name];
            if (cur !== oldClass[name]) {
                elm.classList[cur ? 'add' : 'remove'](name);
            }
        }
    }
    exports.classModule = { create: updateClass, update: updateClass };
    exports.default = exports.classModule;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/modules/props.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    function updateProps(oldVnode, vnode) {
        var key,
            cur,
            old,
            elm = vnode.elm,
            oldProps = oldVnode.data.props,
            props = vnode.data.props;
        if (!oldProps && !props) return;
        if (oldProps === props) return;
        oldProps = oldProps || {};
        props = props || {};
        for (key in oldProps) {
            if (!props[key]) {
                delete elm[key];
            }
        }
        for (key in props) {
            cur = props[key];
            old = oldProps[key];
            if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
                elm[key] = cur;
            }
        }
    }
    exports.propsModule = { create: updateProps, update: updateProps };
    exports.default = exports.propsModule;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/modules/attributes.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var xlinkNS = 'http://www.w3.org/1999/xlink';
    var xmlNS = 'http://www.w3.org/XML/1998/namespace';
    var colonChar = 58;
    var xChar = 120;
    function updateAttrs(oldVnode, vnode) {
        var key,
            elm = vnode.elm,
            oldAttrs = oldVnode.data.attrs,
            attrs = vnode.data.attrs;
        if (!oldAttrs && !attrs) return;
        if (oldAttrs === attrs) return;
        oldAttrs = oldAttrs || {};
        attrs = attrs || {};
        // update modified attributes, add new attributes
        for (key in attrs) {
            var cur = attrs[key];
            var old = oldAttrs[key];
            if (old !== cur) {
                if (cur === true) {
                    elm.setAttribute(key, "");
                } else if (cur === false) {
                    elm.removeAttribute(key);
                } else {
                    if (key.charCodeAt(0) !== xChar) {
                        elm.setAttribute(key, cur);
                    } else if (key.charCodeAt(3) === colonChar) {
                        // Assume xml namespace
                        elm.setAttributeNS(xmlNS, key, cur);
                    } else if (key.charCodeAt(5) === colonChar) {
                        // Assume xlink namespace
                        elm.setAttributeNS(xlinkNS, key, cur);
                    } else {
                        elm.setAttribute(key, cur);
                    }
                }
            }
        }
        // remove removed attributes
        // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
        // the other option is to remove all attributes with value == undefined
        for (key in oldAttrs) {
            if (!(key in attrs)) {
                elm.removeAttribute(key);
            }
        }
    }
    exports.attributesModule = { create: updateAttrs, update: updateAttrs };
    exports.default = exports.attributesModule;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/modules/style.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var raf = typeof window !== 'undefined' && window.requestAnimationFrame || setTimeout;
    var nextFrame = function (fn) {
        raf(function () {
            raf(fn);
        });
    };
    function setNextFrame(obj, prop, val) {
        nextFrame(function () {
            obj[prop] = val;
        });
    }
    function updateStyle(oldVnode, vnode) {
        var cur,
            name,
            elm = vnode.elm,
            oldStyle = oldVnode.data.style,
            style = vnode.data.style;
        if (!oldStyle && !style) return;
        if (oldStyle === style) return;
        oldStyle = oldStyle || {};
        style = style || {};
        var oldHasDel = 'delayed' in oldStyle;
        for (name in oldStyle) {
            if (!style[name]) {
                if (name[0] === '-' && name[1] === '-') {
                    elm.style.removeProperty(name);
                } else {
                    elm.style[name] = '';
                }
            }
        }
        for (name in style) {
            cur = style[name];
            if (name === 'delayed' && style.delayed) {
                for (var name2 in style.delayed) {
                    cur = style.delayed[name2];
                    if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                        setNextFrame(elm.style, name2, cur);
                    }
                }
            } else if (name !== 'remove' && cur !== oldStyle[name]) {
                if (name[0] === '-' && name[1] === '-') {
                    elm.style.setProperty(name, cur);
                } else {
                    elm.style[name] = cur;
                }
            }
        }
    }
    function applyDestroyStyle(vnode) {
        var style,
            name,
            elm = vnode.elm,
            s = vnode.data.style;
        if (!s || !(style = s.destroy)) return;
        for (name in style) {
            elm.style[name] = style[name];
        }
    }
    function applyRemoveStyle(vnode, rm) {
        var s = vnode.data.style;
        if (!s || !s.remove) {
            rm();
            return;
        }
        var name,
            elm = vnode.elm,
            i = 0,
            compStyle,
            style = s.remove,
            amount = 0,
            applied = [];
        for (name in style) {
            applied.push(name);
            elm.style[name] = style[name];
        }
        compStyle = getComputedStyle(elm);
        var props = compStyle['transition-property'].split(', ');
        for (; i < props.length; ++i) {
            if (applied.indexOf(props[i]) !== -1) amount++;
        }
        elm.addEventListener('transitionend', function (ev) {
            if (ev.target === elm) --amount;
            if (amount === 0) rm();
        });
    }
    exports.styleModule = {
        create: updateStyle,
        update: updateStyle,
        destroy: applyDestroyStyle,
        remove: applyRemoveStyle
    };
    exports.default = exports.styleModule;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/modules/dataset.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var CAPS_REGEX = /[A-Z]/g;
    function updateDataset(oldVnode, vnode) {
        var elm = vnode.elm,
            oldDataset = oldVnode.data.dataset,
            dataset = vnode.data.dataset,
            key;
        if (!oldDataset && !dataset) return;
        if (oldDataset === dataset) return;
        oldDataset = oldDataset || {};
        dataset = dataset || {};
        var d = elm.dataset;
        for (key in oldDataset) {
            if (!dataset[key]) {
                if (d) {
                    if (key in d) {
                        delete d[key];
                    }
                } else {
                    elm.removeAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
                }
            }
        }
        for (key in dataset) {
            if (oldDataset[key] !== dataset[key]) {
                if (d) {
                    d[key] = dataset[key];
                } else {
                    elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key]);
                }
            }
        }
    }
    exports.datasetModule = { create: updateDataset, update: updateDataset };
    exports.default = exports.datasetModule;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/modules.js", ["snabbdom/modules/class", "snabbdom/modules/props", "snabbdom/modules/attributes", "snabbdom/modules/style", "snabbdom/modules/dataset"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var class_1 = $__require("snabbdom/modules/class");
    exports.ClassModule = class_1.default;
    var props_1 = $__require("snabbdom/modules/props");
    exports.PropsModule = props_1.default;
    var attributes_1 = $__require("snabbdom/modules/attributes");
    exports.AttrsModule = attributes_1.default;
    var style_1 = $__require("snabbdom/modules/style");
    exports.StyleModule = style_1.default;
    var dataset_1 = $__require("snabbdom/modules/dataset");
    exports.DatasetModule = dataset_1.default;
    var modules = [style_1.default, class_1.default, props_1.default, attributes_1.default, dataset_1.default];
    exports.default = modules;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/IsolateModule.js", ["es6-map"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapPolyfill = $__require('es6-map');
    var IsolateModule = function () {
        function IsolateModule() {
            this.elementsByFullScope = new MapPolyfill();
            this.delegatorsByFullScope = new MapPolyfill();
            this.fullScopesBeingUpdated = [];
        }
        IsolateModule.prototype.cleanupVNode = function (_a) {
            var data = _a.data,
                elm = _a.elm;
            var fullScope = (data || {}).isolate || '';
            var isCurrentElm = this.elementsByFullScope.get(fullScope) === elm;
            var isScopeBeingUpdated = this.fullScopesBeingUpdated.indexOf(fullScope) >= 0;
            if (fullScope && isCurrentElm && !isScopeBeingUpdated) {
                this.elementsByFullScope.delete(fullScope);
                this.delegatorsByFullScope.delete(fullScope);
            }
        };
        IsolateModule.prototype.getElement = function (fullScope) {
            return this.elementsByFullScope.get(fullScope);
        };
        IsolateModule.prototype.getFullScope = function (elm) {
            var iterator = this.elementsByFullScope.entries();
            for (var result = iterator.next(); !!result.value; result = iterator.next()) {
                var _a = result.value,
                    fullScope = _a[0],
                    element = _a[1];
                if (elm === element) {
                    return fullScope;
                }
            }
            return '';
        };
        IsolateModule.prototype.addEventDelegator = function (fullScope, eventDelegator) {
            var delegators = this.delegatorsByFullScope.get(fullScope);
            if (!delegators) {
                delegators = [];
                this.delegatorsByFullScope.set(fullScope, delegators);
            }
            delegators[delegators.length] = eventDelegator;
        };
        IsolateModule.prototype.reset = function () {
            this.elementsByFullScope.clear();
            this.delegatorsByFullScope.clear();
            this.fullScopesBeingUpdated = [];
        };
        IsolateModule.prototype.createModule = function () {
            var self = this;
            return {
                create: function (oldVNode, vNode) {
                    var _a = oldVNode.data,
                        oldData = _a === void 0 ? {} : _a;
                    var elm = vNode.elm,
                        _b = vNode.data,
                        data = _b === void 0 ? {} : _b;
                    var oldFullScope = oldData.isolate || '';
                    var fullScope = data.isolate || '';
                    // Update data structures with the newly-created element
                    if (fullScope) {
                        self.fullScopesBeingUpdated.push(fullScope);
                        if (oldFullScope) {
                            self.elementsByFullScope.delete(oldFullScope);
                        }
                        self.elementsByFullScope.set(fullScope, elm);
                        // Update delegators for this scope
                        var delegators = self.delegatorsByFullScope.get(fullScope);
                        if (delegators) {
                            var len = delegators.length;
                            for (var i = 0; i < len; ++i) {
                                delegators[i].updateOrigin(elm);
                            }
                        }
                    }
                    if (oldFullScope && !fullScope) {
                        self.elementsByFullScope.delete(fullScope);
                    }
                },
                update: function (oldVNode, vNode) {
                    var _a = oldVNode.data,
                        oldData = _a === void 0 ? {} : _a;
                    var elm = vNode.elm,
                        _b = vNode.data,
                        data = _b === void 0 ? {} : _b;
                    var oldFullScope = oldData.isolate || '';
                    var fullScope = data.isolate || '';
                    // Same element, but different scope, so update the data structures
                    if (fullScope && fullScope !== oldFullScope) {
                        if (oldFullScope) {
                            self.elementsByFullScope.delete(oldFullScope);
                        }
                        self.elementsByFullScope.set(fullScope, elm);
                        var delegators = self.delegatorsByFullScope.get(oldFullScope);
                        if (delegators) {
                            self.delegatorsByFullScope.delete(oldFullScope);
                            self.delegatorsByFullScope.set(fullScope, delegators);
                        }
                    }
                    // Same element, but lost the scope, so update the data structures
                    if (oldFullScope && !fullScope) {
                        self.elementsByFullScope.delete(oldFullScope);
                        self.delegatorsByFullScope.delete(oldFullScope);
                    }
                },
                destroy: function (vNode) {
                    self.cleanupVNode(vNode);
                },
                remove: function (vNode, cb) {
                    self.cleanupVNode(vNode);
                    cb();
                },
                post: function () {
                    self.fullScopesBeingUpdated = [];
                }
            };
        };
        return IsolateModule;
    }();
    exports.IsolateModule = IsolateModule;
    
});
System.registerDynamic('npm:es6-map@0.1.5/is-implemented.js', [], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	module.exports = function () {
		var map, iterator, result;
		if (typeof Map !== 'function') return false;
		try {
			// WebKit doesn't support arguments and crashes
			map = new Map([['raz', 'one'], ['dwa', 'two'], ['trzy', 'three']]);
		} catch (e) {
			return false;
		}
		if (String(map) !== '[object Map]') return false;
		if (map.size !== 3) return false;
		if (typeof map.clear !== 'function') return false;
		if (typeof map.delete !== 'function') return false;
		if (typeof map.entries !== 'function') return false;
		if (typeof map.forEach !== 'function') return false;
		if (typeof map.get !== 'function') return false;
		if (typeof map.has !== 'function') return false;
		if (typeof map.keys !== 'function') return false;
		if (typeof map.set !== 'function') return false;
		if (typeof map.values !== 'function') return false;

		iterator = map.entries();
		result = iterator.next();
		if (result.done !== false) return false;
		if (!result.value) return false;
		if (result.value[0] !== 'raz') return false;
		if (result.value[1] !== 'one') return false;

		return true;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/number/is-nan/is-implemented.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = function () {
		var numberIsNaN = Number.isNaN;
		if (typeof numberIsNaN !== "function") return false;
		return !numberIsNaN({}) && numberIsNaN(NaN) && !numberIsNaN(34);
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/number/is-nan/shim.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = function (value) {
		// eslint-disable-next-line no-self-compare
		return value !== value;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/number/is-nan/index.js", ["./is-implemented", "./shim", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = $__require("./is-implemented")() ? Number.isNaN : $__require("./shim");
});
System.registerDynamic("npm:es5-ext@0.10.29/array/#/e-index-of.js", ["../../number/is-nan", "../../number/to-pos-integer", "../../object/valid-value", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var numberIsNaN = $__require("../../number/is-nan"),
	    toPosInt = $__require("../../number/to-pos-integer"),
	    value = $__require("../../object/valid-value"),
	    indexOf = Array.prototype.indexOf,
	    objHasOwnProperty = Object.prototype.hasOwnProperty,
	    abs = Math.abs,
	    floor = Math.floor;

	module.exports = function (searchElement /*, fromIndex*/) {
		var i, length, fromIndex, val;
		if (!numberIsNaN(searchElement)) return indexOf.apply(this, arguments);

		length = toPosInt(value(this).length);
		fromIndex = arguments[1];
		if (isNaN(fromIndex)) fromIndex = 0;else if (fromIndex >= 0) fromIndex = floor(fromIndex);else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

		for (i = fromIndex; i < length; ++i) {
			if (objHasOwnProperty.call(this, i)) {
				val = this[i];
				if (numberIsNaN(val)) return i; // Jslint: ignore
			}
		}
		return -1;
	};
});
System.registerDynamic("npm:event-emitter@0.3.5.json", [], true, function() {
  return {
    "main": "index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      }
    },
    "map": {
      "./test": "./test/index.js"
    }
  };
});

System.registerDynamic('npm:event-emitter@0.3.5/index.js', ['d', 'es5-ext/object/valid-callable'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var d = $__require('d'),
	    callable = $__require('es5-ext/object/valid-callable'),
	    apply = Function.prototype.apply,
	    call = Function.prototype.call,
	    create = Object.create,
	    defineProperty = Object.defineProperty,
	    defineProperties = Object.defineProperties,
	    hasOwnProperty = Object.prototype.hasOwnProperty,
	    descriptor = { configurable: true, enumerable: false, writable: true },
	    on,
	    once,
	    off,
	    emit,
	    methods,
	    descriptors,
	    base;

	on = function (type, listener) {
		var data;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) data[type] = listener;else if (typeof data[type] === 'object') data[type].push(listener);else data[type] = [data[type], listener];

		return this;
	};

	once = function (type, listener) {
		var once, self;

		callable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});

		once.__eeOnceListener__ = listener;
		return this;
	};

	off = function (type, listener) {
		var data, listeners, candidate, i;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];

		if (typeof listeners === 'object') {
			for (i = 0; candidate = listeners[i]; ++i) {
				if (candidate === listener || candidate.__eeOnceListener__ === listener) {
					if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];else listeners.splice(i, 1);
				}
			}
		} else {
			if (listeners === listener || listeners.__eeOnceListener__ === listener) {
				delete data[type];
			}
		}

		return this;
	};

	emit = function (type) {
		var i, l, listener, listeners, args;

		if (!hasOwnProperty.call(this, '__ee__')) return;
		listeners = this.__ee__[type];
		if (!listeners) return;

		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

			listeners = listeners.slice();
			for (i = 0; listener = listeners[i]; ++i) {
				apply.call(listener, this, args);
			}
		} else {
			switch (arguments.length) {
				case 1:
					call.call(listeners, this);
					break;
				case 2:
					call.call(listeners, this, arguments[1]);
					break;
				case 3:
					call.call(listeners, this, arguments[1], arguments[2]);
					break;
				default:
					l = arguments.length;
					args = new Array(l - 1);
					for (i = 1; i < l; ++i) {
						args[i - 1] = arguments[i];
					}
					apply.call(listeners, this, args);
			}
		}
	};

	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};

	descriptors = {
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return o == null ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;
});
System.registerDynamic('npm:es6-iterator@2.0.1/array.js', ['es5-ext/object/set-prototype-of', 'es5-ext/string/#/contains', 'd', '.'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var setPrototypeOf = $__require('es5-ext/object/set-prototype-of'),
	    contains = $__require('es5-ext/string/#/contains'),
	    d = $__require('d'),
	    Iterator = $__require('.'),
	    defineProperty = Object.defineProperty,
	    ArrayIterator;

	ArrayIterator = module.exports = function (arr, kind) {
		if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
		Iterator.call(this, arr);
		if (!kind) kind = 'value';else if (contains.call(kind, 'key+value')) kind = 'key+value';else if (contains.call(kind, 'key')) kind = 'key';else kind = 'value';
		defineProperty(this, '__kind__', d('', kind));
	};
	if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

	ArrayIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(ArrayIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__list__[i];
			if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
			return i;
		}),
		toString: d(function () {
			return '[object Array Iterator]';
		})
	});
});
System.registerDynamic('npm:es6-iterator@2.0.1/string.js', ['es5-ext/object/set-prototype-of', 'd', '.'], true, function ($__require, exports, module) {
	// Thanks @mathiasbynens
	// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var setPrototypeOf = $__require('es5-ext/object/set-prototype-of'),
	    d = $__require('d'),
	    Iterator = $__require('.'),
	    defineProperty = Object.defineProperty,
	    StringIterator;

	StringIterator = module.exports = function (str) {
		if (!(this instanceof StringIterator)) return new StringIterator(str);
		str = String(str);
		Iterator.call(this, str);
		defineProperty(this, '__length__', d('', str.length));
	};
	if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

	StringIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(StringIterator),
		_next: d(function () {
			if (!this.__list__) return;
			if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
			this._unBind();
		}),
		_resolve: d(function (i) {
			var char = this.__list__[i],
			    code;
			if (this.__nextIndex__ === this.__length__) return char;
			code = char.charCodeAt(0);
			if (code >= 0xD800 && code <= 0xDBFF) return char + this.__list__[this.__nextIndex__++];
			return char;
		}),
		toString: d(function () {
			return '[object String Iterator]';
		})
	});
});
System.registerDynamic('npm:es6-iterator@2.0.1/is-iterable.js', ['es5-ext/function/is-arguments', 'es5-ext/string/is-string', 'es6-symbol'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var isArguments = $__require('es5-ext/function/is-arguments'),
	    isString = $__require('es5-ext/string/is-string'),
	    iteratorSymbol = $__require('es6-symbol').iterator,
	    isArray = Array.isArray;

	module.exports = function (value) {
		if (value == null) return false;
		if (isArray(value)) return true;
		if (isString(value)) return true;
		if (isArguments(value)) return true;
		return typeof value[iteratorSymbol] === 'function';
	};
});
System.registerDynamic('npm:es6-iterator@2.0.1/valid-iterable.js', ['./is-iterable'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var isIterable = $__require('./is-iterable');

	module.exports = function (value) {
		if (!isIterable(value)) throw new TypeError(value + " is not iterable");
		return value;
	};
});
System.registerDynamic('npm:es6-iterator@2.0.1/get.js', ['es5-ext/function/is-arguments', 'es5-ext/string/is-string', './array', './string', './valid-iterable', 'es6-symbol'], true, function ($__require, exports, module) {
  'use strict';

  var global = this || self,
      GLOBAL = global;
  var isArguments = $__require('es5-ext/function/is-arguments'),
      isString = $__require('es5-ext/string/is-string'),
      ArrayIterator = $__require('./array'),
      StringIterator = $__require('./string'),
      iterable = $__require('./valid-iterable'),
      iteratorSymbol = $__require('es6-symbol').iterator;

  module.exports = function (obj) {
    if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
    if (isArguments(obj)) return new ArrayIterator(obj);
    if (isString(obj)) return new StringIterator(obj);
    return new ArrayIterator(obj);
  };
});
System.registerDynamic('npm:es6-iterator@2.0.1/for-of.js', ['es5-ext/function/is-arguments', 'es5-ext/object/valid-callable', 'es5-ext/string/is-string', './get'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var isArguments = $__require('es5-ext/function/is-arguments'),
	    callable = $__require('es5-ext/object/valid-callable'),
	    isString = $__require('es5-ext/string/is-string'),
	    get = $__require('./get'),
	    isArray = Array.isArray,
	    call = Function.prototype.call,
	    some = Array.prototype.some;

	module.exports = function (iterable, cb /*, thisArg*/) {
		var mode,
		    thisArg = arguments[2],
		    result,
		    doBreak,
		    broken,
		    i,
		    l,
		    char,
		    code;
		if (isArray(iterable) || isArguments(iterable)) mode = 'array';else if (isString(iterable)) mode = 'string';else iterable = get(iterable);

		callable(cb);
		doBreak = function () {
			broken = true;
		};
		if (mode === 'array') {
			some.call(iterable, function (value) {
				call.call(cb, thisArg, value, doBreak);
				if (broken) return true;
			});
			return;
		}
		if (mode === 'string') {
			l = iterable.length;
			for (i = 0; i < l; ++i) {
				char = iterable[i];
				if (i + 1 < l) {
					code = char.charCodeAt(0);
					if (code >= 0xD800 && code <= 0xDBFF) char += iterable[++i];
				}
				call.call(cb, thisArg, char, doBreak);
				if (broken) break;
			}
			return;
		}
		result = iterable.next();

		while (!result.done) {
			call.call(cb, thisArg, result.value, doBreak);
			if (broken) return;
			result = iterable.next();
		}
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/is-object.js", ["./is-value", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var isValue = $__require("./is-value");

	var map = { function: true, object: true };

	module.exports = function (value) {
		return isValue(value) && map[typeof value] || false;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/set-prototype-of/is-implemented.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var create = Object.create,
	    getPrototypeOf = Object.getPrototypeOf,
	    plainObject = {};

	module.exports = function () /* CustomCreate*/{
		var setPrototypeOf = Object.setPrototypeOf,
		    customCreate = arguments[0] || create;
		if (typeof setPrototypeOf !== "function") return false;
		return getPrototypeOf(setPrototypeOf(customCreate(null), plainObject)) === plainObject;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/create.js", ["./set-prototype-of/is-implemented", "./set-prototype-of/shim", "process"], true, function ($__require, exports, module) {
	// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var create = Object.create,
	    shim;

	if (!$__require("./set-prototype-of/is-implemented")()) {
		shim = $__require("./set-prototype-of/shim");
	}

	module.exports = function () {
		var nullObject, polyProps, desc;
		if (!shim) return create;
		if (shim.level !== 1) return create;

		nullObject = {};
		polyProps = {};
		desc = {
			configurable: false,
			enumerable: false,
			writable: true,
			value: undefined
		};
		Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
			if (name === "__proto__") {
				polyProps[name] = {
					configurable: true,
					enumerable: false,
					writable: true,
					value: undefined
				};
				return;
			}
			polyProps[name] = desc;
		});
		Object.defineProperties(nullObject, polyProps);

		Object.defineProperty(shim, "nullPolyfill", {
			configurable: false,
			enumerable: false,
			writable: false,
			value: nullObject
		});

		return function (prototype, props) {
			return create(prototype === null ? nullObject : prototype, props);
		};
	}();
});
System.registerDynamic("npm:es5-ext@0.10.29/object/set-prototype-of/shim.js", ["../is-object", "../valid-value", "../create", "process"], true, function ($__require, exports, module) {
	/* eslint no-proto: "off" */

	// Big thanks to @WebReflection for sorting this out
	// https://gist.github.com/WebReflection/5593554

	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var isObject = $__require("../is-object"),
	    value = $__require("../valid-value"),
	    objIsPrototypOf = Object.prototype.isPrototypeOf,
	    defineProperty = Object.defineProperty,
	    nullDesc = {
		configurable: true,
		enumerable: false,
		writable: true,
		value: undefined
	},
	    validate;

	validate = function (obj, prototype) {
		value(obj);
		if (prototype === null || isObject(prototype)) return obj;
		throw new TypeError("Prototype must be null or an object");
	};

	module.exports = function (status) {
		var fn, set;
		if (!status) return null;
		if (status.level === 2) {
			if (status.set) {
				set = status.set;
				fn = function (obj, prototype) {
					set.call(validate(obj, prototype), prototype);
					return obj;
				};
			} else {
				fn = function (obj, prototype) {
					validate(obj, prototype).__proto__ = prototype;
					return obj;
				};
			}
		} else {
			fn = function self(obj, prototype) {
				var isNullBase;
				validate(obj, prototype);
				isNullBase = objIsPrototypOf.call(self.nullPolyfill, obj);
				if (isNullBase) delete self.nullPolyfill.__proto__;
				if (prototype === null) prototype = self.nullPolyfill;
				obj.__proto__ = prototype;
				if (isNullBase) defineProperty(self.nullPolyfill, "__proto__", nullDesc);
				return obj;
			};
		}
		return Object.defineProperty(fn, "level", {
			configurable: false,
			enumerable: false,
			writable: false,
			value: status.level
		});
	}(function () {
		var tmpObj1 = Object.create(null),
		    tmpObj2 = {},
		    set,
		    desc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(tmpObj1, tmpObj2);
			} catch (ignore) {}
			if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { set: set, level: 2 };
		}

		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 2 };

		tmpObj1 = {};
		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 1 };

		return false;
	}());

	$__require("../create");
});
System.registerDynamic("npm:es5-ext@0.10.29/object/set-prototype-of/index.js", ["./is-implemented", "./shim", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = $__require("./is-implemented")() ? Object.setPrototypeOf : $__require("./shim");
});
System.registerDynamic("npm:es5-ext@0.10.29/array/#/clear.js", ["../../object/valid-value", "process"], true, function ($__require, exports, module) {
	// Inspired by Google Closure:
	// http://closure-library.googlecode.com/svn/docs/
	// closure_goog_array_array.js.html#goog.array.clear

	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var value = $__require("../../object/valid-value");

	module.exports = function () {
		value(this).length = 0;
		return this;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/array/from/is-implemented.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = function () {
		var from = Array.from,
		    arr,
		    result;
		if (typeof from !== "function") return false;
		arr = ["raz", "dwa"];
		result = from(arr);
		return Boolean(result && result !== arr && result[1] === "dwa");
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/function/is-arguments.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var objToString = Object.prototype.toString,
	    id = objToString.call(function () {
		return arguments;
	}());

	module.exports = function (value) {
		return objToString.call(value) === id;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/function/is-function.js", ["./noop", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var objToString = Object.prototype.toString,
	    id = objToString.call($__require("./noop"));

	module.exports = function (value) {
		return typeof value === "function" && objToString.call(value) === id;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/math/sign/is-implemented.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = function () {
		var sign = Math.sign;
		if (typeof sign !== "function") return false;
		return sign(10) === 1 && sign(-20) === -1;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/math/sign/shim.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = function (value) {
		value = Number(value);
		if (isNaN(value) || value === 0) return value;
		return value > 0 ? 1 : -1;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/math/sign/index.js", ["./is-implemented", "./shim", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = $__require("./is-implemented")() ? Math.sign : $__require("./shim");
});
System.registerDynamic("npm:es5-ext@0.10.29/number/to-integer.js", ["../math/sign", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var sign = $__require("../math/sign"),
	    abs = Math.abs,
	    floor = Math.floor;

	module.exports = function (value) {
		if (isNaN(value)) return 0;
		value = Number(value);
		if (value === 0 || !isFinite(value)) return value;
		return sign(value) * floor(abs(value));
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/number/to-pos-integer.js", ["./to-integer", "process"], true, function ($__require, exports, module) {
  "use strict";

  var process = $__require("process");
  var global = this || self,
      GLOBAL = global;
  var toInteger = $__require("./to-integer"),
      max = Math.max;

  module.exports = function (value) {
    return max(0, toInteger(value));
  };
});
System.registerDynamic("npm:es5-ext@0.10.29/string/is-string.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var objToString = Object.prototype.toString,
	    id = objToString.call("");

	module.exports = function (value) {
		return typeof value === "string" || value && typeof value === "object" && (value instanceof String || objToString.call(value) === id) || false;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/array/from/shim.js", ["es6-symbol", "../../function/is-arguments", "../../function/is-function", "../../number/to-pos-integer", "../../object/valid-callable", "../../object/valid-value", "../../object/is-value", "../../string/is-string", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var iteratorSymbol = $__require("es6-symbol").iterator,
	    isArguments = $__require("../../function/is-arguments"),
	    isFunction = $__require("../../function/is-function"),
	    toPosInt = $__require("../../number/to-pos-integer"),
	    callable = $__require("../../object/valid-callable"),
	    validValue = $__require("../../object/valid-value"),
	    isValue = $__require("../../object/is-value"),
	    isString = $__require("../../string/is-string"),
	    isArray = Array.isArray,
	    call = Function.prototype.call,
	    desc = { configurable: true, enumerable: true, writable: true, value: null },
	    defineProperty = Object.defineProperty;

	// eslint-disable-next-line complexity
	module.exports = function (arrayLike /*, mapFn, thisArg*/) {
		var mapFn = arguments[1],
		    thisArg = arguments[2],
		    Context,
		    i,
		    j,
		    arr,
		    length,
		    code,
		    iterator,
		    result,
		    getIterator,
		    value;

		arrayLike = Object(validValue(arrayLike));

		if (isValue(mapFn)) callable(mapFn);
		if (!this || this === Array || !isFunction(this)) {
			// Result: Plain array
			if (!mapFn) {
				if (isArguments(arrayLike)) {
					// Source: Arguments
					length = arrayLike.length;
					if (length !== 1) return Array.apply(null, arrayLike);
					arr = new Array(1);
					arr[0] = arrayLike[0];
					return arr;
				}
				if (isArray(arrayLike)) {
					// Source: Array
					arr = new Array(length = arrayLike.length);
					for (i = 0; i < length; ++i) arr[i] = arrayLike[i];
					return arr;
				}
			}
			arr = [];
		} else {
			// Result: Non plain array
			Context = this;
		}

		if (!isArray(arrayLike)) {
			if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
				// Source: Iterator
				iterator = callable(getIterator).call(arrayLike);
				if (Context) arr = new Context();
				result = iterator.next();
				i = 0;
				while (!result.done) {
					value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
					if (Context) {
						desc.value = value;
						defineProperty(arr, i, desc);
					} else {
						arr[i] = value;
					}
					result = iterator.next();
					++i;
				}
				length = i;
			} else if (isString(arrayLike)) {
				// Source: String
				length = arrayLike.length;
				if (Context) arr = new Context();
				for (i = 0, j = 0; i < length; ++i) {
					value = arrayLike[i];
					if (i + 1 < length) {
						code = value.charCodeAt(0);
						// eslint-disable-next-line max-depth
						if (code >= 0xd800 && code <= 0xdbff) value += arrayLike[++i];
					}
					value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
					if (Context) {
						desc.value = value;
						defineProperty(arr, j, desc);
					} else {
						arr[j] = value;
					}
					++j;
				}
				length = j;
			}
		}
		if (length === undefined) {
			// Source: array or array-like
			length = toPosInt(arrayLike.length);
			if (Context) arr = new Context(length);
			for (i = 0; i < length; ++i) {
				value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
				if (Context) {
					desc.value = value;
					defineProperty(arr, i, desc);
				} else {
					arr[i] = value;
				}
			}
		}
		if (Context) {
			desc.value = null;
			arr.length = length;
		}
		return arr;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/array/from/index.js", ["./is-implemented", "./shim", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = $__require("./is-implemented")() ? Array.from : $__require("./shim");
});
System.registerDynamic("npm:es5-ext@0.10.29/object/copy.js", ["../array/from", "./assign", "./valid-value", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var aFrom = $__require("../array/from"),
	    assign = $__require("./assign"),
	    value = $__require("./valid-value");

	module.exports = function (obj /*, propertyNames, options*/) {
		var copy = Object(value(obj)),
		    propertyNames = arguments[1],
		    options = Object(arguments[2]);
		if (copy !== obj && !propertyNames) return copy;
		var result = {};
		if (propertyNames) {
			aFrom(propertyNames, function (propertyName) {
				if (options.ensure || propertyName in obj) result[propertyName] = obj[propertyName];
			});
		} else {
			assign(result, obj);
		}
		return result;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/valid-callable.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = function (fn) {
		if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
		return fn;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/_iterate.js", ["./valid-callable", "./valid-value", "process"], true, function ($__require, exports, module) {
	// Internal method, used by iteration functions.
	// Calls a function for each key-value pair found in object
	// Optionally takes compareFn to iterate object in specific order

	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var callable = $__require("./valid-callable"),
	    value = $__require("./valid-value"),
	    bind = Function.prototype.bind,
	    call = Function.prototype.call,
	    keys = Object.keys,
	    objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

	module.exports = function (method, defVal) {
		return function (obj, cb /*, thisArg, compareFn*/) {
			var list,
			    thisArg = arguments[2],
			    compareFn = arguments[3];
			obj = Object(value(obj));
			callable(cb);

			list = keys(obj);
			if (compareFn) {
				list.sort(typeof compareFn === "function" ? bind.call(compareFn, obj) : undefined);
			}
			if (typeof method !== "function") method = list[method];
			return call.call(method, list, function (key, index) {
				if (!objPropertyIsEnumerable.call(obj, key)) return defVal;
				return call.call(cb, thisArg, obj[key], key, obj, index);
			});
		};
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/for-each.js", ["./_iterate", "process"], true, function ($__require, exports, module) {
  "use strict";

  var process = $__require("process");
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require("./_iterate")("forEach");
});
System.registerDynamic("npm:es5-ext@0.10.29/object/map.js", ["./valid-callable", "./for-each", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var callable = $__require("./valid-callable"),
	    forEach = $__require("./for-each"),
	    call = Function.prototype.call;

	module.exports = function (obj, cb /*, thisArg*/) {
		var result = {},
		    thisArg = arguments[2];
		callable(cb);
		forEach(obj, function (value, key, targetObj, index) {
			result[key] = call.call(cb, thisArg, value, key, targetObj, index);
		});
		return result;
	};
});
System.registerDynamic('npm:d@1.0.0/auto-bind.js', ['es5-ext/object/copy', 'es5-ext/object/normalize-options', 'es5-ext/object/valid-callable', 'es5-ext/object/map', 'es5-ext/object/valid-value'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var copy = $__require('es5-ext/object/copy'),
	    normalizeOptions = $__require('es5-ext/object/normalize-options'),
	    ensureCallable = $__require('es5-ext/object/valid-callable'),
	    map = $__require('es5-ext/object/map'),
	    callable = $__require('es5-ext/object/valid-callable'),
	    validValue = $__require('es5-ext/object/valid-value'),
	    bind = Function.prototype.bind,
	    defineProperty = Object.defineProperty,
	    hasOwnProperty = Object.prototype.hasOwnProperty,
	    define;

	define = function (name, desc, options) {
		var value = validValue(desc) && callable(desc.value),
		    dgs;
		dgs = copy(desc);
		delete dgs.writable;
		delete dgs.value;
		dgs.get = function () {
			if (!options.overwriteDefinition && hasOwnProperty.call(this, name)) return value;
			desc.value = bind.call(value, options.resolveContext ? options.resolveContext(this) : this);
			defineProperty(this, name, desc);
			return this[name];
		};
		return dgs;
	};

	module.exports = function (props /*, options*/) {
		var options = normalizeOptions(arguments[1]);
		if (options.resolveContext != null) ensureCallable(options.resolveContext);
		return map(props, function (desc, name) {
			return define(name, desc, options);
		});
	};
});
System.registerDynamic("npm:es6-iterator@2.0.1.json", [], true, function() {
  return {
    "main": "index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      }
    },
    "map": {
      "./test": "./test/index.js"
    }
  };
});

System.registerDynamic('npm:es6-iterator@2.0.1/index.js', ['es5-ext/array/#/clear', 'es5-ext/object/assign', 'es5-ext/object/valid-callable', 'es5-ext/object/valid-value', 'd', 'd/auto-bind', 'es6-symbol'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var clear = $__require('es5-ext/array/#/clear'),
	    assign = $__require('es5-ext/object/assign'),
	    callable = $__require('es5-ext/object/valid-callable'),
	    value = $__require('es5-ext/object/valid-value'),
	    d = $__require('d'),
	    autoBind = $__require('d/auto-bind'),
	    Symbol = $__require('es6-symbol'),
	    defineProperty = Object.defineProperty,
	    defineProperties = Object.defineProperties,
	    Iterator;

	module.exports = Iterator = function (list, context) {
		if (!(this instanceof Iterator)) return new Iterator(list, context);
		defineProperties(this, {
			__list__: d('w', value(list)),
			__context__: d('w', context),
			__nextIndex__: d('w', 0)
		});
		if (!context) return;
		callable(context.on);
		context.on('_add', this._onAdd);
		context.on('_delete', this._onDelete);
		context.on('_clear', this._onClear);
	};

	defineProperties(Iterator.prototype, assign({
		constructor: d(Iterator),
		_next: d(function () {
			var i;
			if (!this.__list__) return;
			if (this.__redo__) {
				i = this.__redo__.shift();
				if (i !== undefined) return i;
			}
			if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
			this._unBind();
		}),
		next: d(function () {
			return this._createResult(this._next());
		}),
		_createResult: d(function (i) {
			if (i === undefined) return { done: true, value: undefined };
			return { done: false, value: this._resolve(i) };
		}),
		_resolve: d(function (i) {
			return this.__list__[i];
		}),
		_unBind: d(function () {
			this.__list__ = null;
			delete this.__redo__;
			if (!this.__context__) return;
			this.__context__.off('_add', this._onAdd);
			this.__context__.off('_delete', this._onDelete);
			this.__context__.off('_clear', this._onClear);
			this.__context__ = null;
		}),
		toString: d(function () {
			return '[object Iterator]';
		})
	}, autoBind({
		_onAdd: d(function (index) {
			if (index >= this.__nextIndex__) return;
			++this.__nextIndex__;
			if (!this.__redo__) {
				defineProperty(this, '__redo__', d('c', [index]));
				return;
			}
			this.__redo__.forEach(function (redo, i) {
				if (redo >= index) this.__redo__[i] = ++redo;
			}, this);
			this.__redo__.push(index);
		}),
		_onDelete: d(function (index) {
			var i;
			if (index >= this.__nextIndex__) return;
			--this.__nextIndex__;
			if (!this.__redo__) return;
			i = this.__redo__.indexOf(index);
			if (i !== -1) this.__redo__.splice(i, 1);
			this.__redo__.forEach(function (redo, i) {
				if (redo > index) this.__redo__[i] = --redo;
			}, this);
		}),
		_onClear: d(function () {
			if (this.__redo__) clear.call(this.__redo__);
			this.__nextIndex__ = 0;
		})
	})));

	defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
		return this;
	}));
	defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));
});
System.registerDynamic('npm:es6-symbol@3.1.1/is-implemented.js', [], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var validTypes = { object: true, symbol: true };

	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try {
			String(symbol);
		} catch (e) {
			return false;
		}

		// Return 'true' also for polyfills
		if (!validTypes[typeof Symbol.iterator]) return false;
		if (!validTypes[typeof Symbol.toPrimitive]) return false;
		if (!validTypes[typeof Symbol.toStringTag]) return false;

		return true;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/assign/is-implemented.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = function () {
		var assign = Object.assign,
		    obj;
		if (typeof assign !== "function") return false;
		obj = { foo: "raz" };
		assign(obj, { bar: "dwa" }, { trzy: "trzy" });
		return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/keys/is-implemented.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = function () {
		try {
			Object.keys("primitive");
			return true;
		} catch (e) {
			return false;
		}
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/keys/shim.js", ["../is-value", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var isValue = $__require("../is-value");

	var keys = Object.keys;

	module.exports = function (object) {
		return keys(isValue(object) ? Object(object) : object);
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/keys/index.js", ["./is-implemented", "./shim", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = $__require("./is-implemented")() ? Object.keys : $__require("./shim");
});
System.registerDynamic("npm:es5-ext@0.10.29/object/valid-value.js", ["./is-value", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var isValue = $__require("./is-value");

	module.exports = function (value) {
		if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
		return value;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/assign/shim.js", ["../keys", "../valid-value", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var keys = $__require("../keys"),
	    value = $__require("../valid-value"),
	    max = Math.max;

	module.exports = function (dest, src /*, …srcn*/) {
		var error,
		    i,
		    length = max(arguments.length, 2),
		    assign;
		dest = Object(value(dest));
		assign = function (key) {
			try {
				dest[key] = src[key];
			} catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < length; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/assign/index.js", ["./is-implemented", "./shim", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = $__require("./is-implemented")() ? Object.assign : $__require("./shim");
});
System.registerDynamic("npm:es5-ext@0.10.29/function/noop.js", ["process"], true, function ($__require, exports, module) {
  "use strict";

  // eslint-disable-next-line no-empty-function

  var process = $__require("process");
  var global = this || self,
      GLOBAL = global;
  module.exports = function () {};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/is-value.js", ["../function/noop", "process"], true, function ($__require, exports, module) {
  "use strict";

  var process = $__require("process");
  var global = this || self,
      GLOBAL = global;
  var _undefined = $__require("../function/noop")(); // Support ES3 engines

  module.exports = function (val) {
    return val !== _undefined && val !== null;
  };
});
System.registerDynamic("npm:es5-ext@0.10.29/object/normalize-options.js", ["./is-value", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var isValue = $__require("./is-value");

	var forEach = Array.prototype.forEach,
	    create = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	// eslint-disable-next-line no-unused-vars
	module.exports = function (opts1 /*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (!isValue(options)) return;
			process(Object(options), result);
		});
		return result;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/object/is-callable.js", ["process"], true, function ($__require, exports, module) {
  // Deprecated

  "use strict";

  var process = $__require("process");
  var global = this || self,
      GLOBAL = global;
  module.exports = function (obj) {
    return typeof obj === "function";
  };
});
System.registerDynamic("npm:es5-ext@0.10.29/string/#/contains/is-implemented.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var str = "razdwatrzy";

	module.exports = function () {
		if (typeof str.contains !== "function") return false;
		return str.contains("dwa") === true && str.contains("foo") === false;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/string/#/contains/shim.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var indexOf = String.prototype.indexOf;

	module.exports = function (searchString /*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};
});
System.registerDynamic("npm:es5-ext@0.10.29/string/#/contains/index.js", ["./is-implemented", "./shim", "process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	module.exports = $__require("./is-implemented")() ? String.prototype.contains : $__require("./shim");
});
System.registerDynamic("npm:d@1.0.0.json", [], true, function() {
  return {
    "main": "index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      }
    },
    "map": {
      "./test": "./test/index.js"
    }
  };
});

System.registerDynamic('npm:d@1.0.0/index.js', ['es5-ext/object/assign', 'es5-ext/object/normalize-options', 'es5-ext/object/is-callable', 'es5-ext/string/#/contains'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var assign = $__require('es5-ext/object/assign'),
	    normalizeOpts = $__require('es5-ext/object/normalize-options'),
	    isCallable = $__require('es5-ext/object/is-callable'),
	    contains = $__require('es5-ext/string/#/contains'),
	    d;

	d = module.exports = function (dscr, value /*, options*/) {
		var c, e, w, options, desc;
		if (arguments.length < 2 || typeof dscr !== 'string') {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set /*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};
});
System.registerDynamic('npm:es6-symbol@3.1.1/is-symbol.js', [], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	module.exports = function (x) {
		if (!x) return false;
		if (typeof x === 'symbol') return true;
		if (!x.constructor) return false;
		if (x.constructor.name !== 'Symbol') return false;
		return x[x.constructor.toStringTag] === 'Symbol';
	};
});
System.registerDynamic('npm:es6-symbol@3.1.1/validate-symbol.js', ['./is-symbol'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var isSymbol = $__require('./is-symbol');

	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};
});
System.registerDynamic('npm:es6-symbol@3.1.1/polyfill.js', ['d', './validate-symbol'], true, function ($__require, exports, module) {
	// ES2015 Symbol polyfill for environments that do not (or partially) support it

	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var d = $__require('d'),
	    validateSymbol = $__require('./validate-symbol'),
	    create = Object.create,
	    defineProperties = Object.defineProperties,
	    defineProperty = Object.defineProperty,
	    objPrototype = Object.prototype,
	    NativeSymbol,
	    SymbolPolyfill,
	    HiddenSymbol,
	    globalSymbols = create(null),
	    isNativeSafe;

	if (typeof Symbol === 'function') {
		NativeSymbol = Symbol;
		try {
			String(NativeSymbol());
			isNativeSafe = true;
		} catch (ignore) {}
	}

	var generateName = function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0,
			    name,
			    ie11BugWorkaround;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += postfix || '';
			created[desc] = true;
			name = '@@' + desc;
			defineProperty(objPrototype, name, d.gs(null, function (value) {
				// For IE11 issue see:
				// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
				//    ie11-broken-getters-on-dom-objects
				// https://github.com/medikoo/es6-symbol/issues/12
				if (ie11BugWorkaround) return;
				ie11BugWorkaround = true;
				defineProperty(this, name, d(value));
				ie11BugWorkaround = false;
			}));
			return name;
		};
	}();

	// Internal constructor (not one exposed) for creating Symbol instances.
	// This one is used to ensure that `someSymbol instanceof Symbol` always return false
	HiddenSymbol = function Symbol(description) {
		if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
		return SymbolPolyfill(description);
	};

	// Exposed `Symbol` constructor
	// (returns instances of HiddenSymbol)
	module.exports = SymbolPolyfill = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
		if (isNativeSafe) return NativeSymbol(description);
		symbol = create(HiddenSymbol.prototype);
		description = description === undefined ? '' : String(description);
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (globalSymbols[key]) return globalSymbols[key];
			return globalSymbols[key] = SymbolPolyfill(String(key));
		}),
		keyFor: d(function (s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols) if (globalSymbols[key] === s) return key;
		}),

		// To ensure proper interoperability with other native functions (e.g. Array.from)
		// fallback to eventual native implementation of given symbol
		hasInstance: d('', NativeSymbol && NativeSymbol.hasInstance || SymbolPolyfill('hasInstance')),
		isConcatSpreadable: d('', NativeSymbol && NativeSymbol.isConcatSpreadable || SymbolPolyfill('isConcatSpreadable')),
		iterator: d('', NativeSymbol && NativeSymbol.iterator || SymbolPolyfill('iterator')),
		match: d('', NativeSymbol && NativeSymbol.match || SymbolPolyfill('match')),
		replace: d('', NativeSymbol && NativeSymbol.replace || SymbolPolyfill('replace')),
		search: d('', NativeSymbol && NativeSymbol.search || SymbolPolyfill('search')),
		species: d('', NativeSymbol && NativeSymbol.species || SymbolPolyfill('species')),
		split: d('', NativeSymbol && NativeSymbol.split || SymbolPolyfill('split')),
		toPrimitive: d('', NativeSymbol && NativeSymbol.toPrimitive || SymbolPolyfill('toPrimitive')),
		toStringTag: d('', NativeSymbol && NativeSymbol.toStringTag || SymbolPolyfill('toStringTag')),
		unscopables: d('', NativeSymbol && NativeSymbol.unscopables || SymbolPolyfill('unscopables'))
	});

	// Internal tweaks for real symbol producer
	defineProperties(HiddenSymbol.prototype, {
		constructor: d(SymbolPolyfill),
		toString: d('', function () {
			return this.__name__;
		})
	});

	// Proper implementation of methods exposed on Symbol.prototype
	// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
	defineProperties(SymbolPolyfill.prototype, {
		toString: d(function () {
			return 'Symbol (' + validateSymbol(this).__description__ + ')';
		}),
		valueOf: d(function () {
			return validateSymbol(this);
		})
	});
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
		var symbol = validateSymbol(this);
		if (typeof symbol === 'symbol') return symbol;
		return symbol.toString();
	}));
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

	// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag, d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

	// Note: It's important to define `toPrimitive` as last one, as some implementations
	// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
	// And that may invoke error in definition flow:
	// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive, d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));
});
System.registerDynamic("npm:es6-symbol@3.1.1.json", [], true, function() {
  return {
    "main": "index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      }
    },
    "map": {
      "./test": "./test/index.js"
    }
  };
});

System.registerDynamic('npm:es6-symbol@3.1.1/index.js', ['./is-implemented', './polyfill'], true, function ($__require, exports, module) {
  'use strict';

  var global = this || self,
      GLOBAL = global;
  module.exports = $__require('./is-implemented')() ? Symbol : $__require('./polyfill');
});
System.registerDynamic("npm:jspm-nodelibs-process@0.2.1.json", [], true, function() {
  return {
    "main": "./process.js"
  };
});

System.registerDynamic('npm:jspm-nodelibs-process@0.2.1/process.js', ['@system-env'], true, function ($__require, exports, module) {
    var global = this || self,
        GLOBAL = global;
    // From https://github.com/defunctzombie/node-process/blob/master/browser.js
    // shim for using process in browser

    var productionEnv = $__require('@system-env').production;

    var process = module.exports = {};
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }

    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = setTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        clearTimeout(timeout);
    }

    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            setTimeout(drainQueue, 0);
        }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {
        NODE_ENV: productionEnv ? 'production' : 'development'
    };
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;

    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };

    process.cwd = function () {
        return '/';
    };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function () {
        return 0;
    };
});
System.registerDynamic("npm:es5-ext@0.10.29.json", [], true, function() {
  return {
    "main": "index.js",
    "format": "cjs",
    "meta": {
      "*": {
        "globals": {
          "process": "process"
        }
      },
      "*.json": {
        "format": "json"
      }
    },
    "map": {
      "./array": "./array/index.js",
      "./array/#": "./array/#/index.js",
      "./array/#/@@iterator": "./array/#/@@iterator/index.js",
      "./array/#/concat": "./array/#/concat/index.js",
      "./array/#/copy-within": "./array/#/copy-within/index.js",
      "./array/#/entries": "./array/#/entries/index.js",
      "./array/#/fill": "./array/#/fill/index.js",
      "./array/#/filter": "./array/#/filter/index.js",
      "./array/#/find": "./array/#/find/index.js",
      "./array/#/find-index": "./array/#/find-index/index.js",
      "./array/#/keys": "./array/#/keys/index.js",
      "./array/#/map": "./array/#/map/index.js",
      "./array/#/slice": "./array/#/slice/index.js",
      "./array/#/splice": "./array/#/splice/index.js",
      "./array/#/values": "./array/#/values/index.js",
      "./array/from": "./array/from/index.js",
      "./array/of": "./array/of/index.js",
      "./boolean": "./boolean/index.js",
      "./date": "./date/index.js",
      "./date/#": "./date/#/index.js",
      "./error": "./error/index.js",
      "./error/#": "./error/#/index.js",
      "./function": "./function/index.js",
      "./function/#": "./function/#/index.js",
      "./iterable": "./iterable/index.js",
      "./json": "./json/index.js",
      "./math": "./math/index.js",
      "./math/acosh": "./math/acosh/index.js",
      "./math/asinh": "./math/asinh/index.js",
      "./math/atanh": "./math/atanh/index.js",
      "./math/cbrt": "./math/cbrt/index.js",
      "./math/clz32": "./math/clz32/index.js",
      "./math/cosh": "./math/cosh/index.js",
      "./math/expm1": "./math/expm1/index.js",
      "./math/fround": "./math/fround/index.js",
      "./math/hypot": "./math/hypot/index.js",
      "./math/imul": "./math/imul/index.js",
      "./math/log10": "./math/log10/index.js",
      "./math/log1p": "./math/log1p/index.js",
      "./math/log2": "./math/log2/index.js",
      "./math/sign": "./math/sign/index.js",
      "./math/sinh": "./math/sinh/index.js",
      "./math/tanh": "./math/tanh/index.js",
      "./math/trunc": "./math/trunc/index.js",
      "./number": "./number/index.js",
      "./number/#": "./number/#/index.js",
      "./number/epsilon": "./number/epsilon/index.js",
      "./number/is-finite": "./number/is-finite/index.js",
      "./number/is-integer": "./number/is-integer/index.js",
      "./number/is-nan": "./number/is-nan/index.js",
      "./number/is-safe-integer": "./number/is-safe-integer/index.js",
      "./number/max-safe-integer": "./number/max-safe-integer/index.js",
      "./number/min-safe-integer": "./number/min-safe-integer/index.js",
      "./object": "./object/index.js",
      "./object/assign": "./object/assign/index.js",
      "./object/keys": "./object/keys/index.js",
      "./object/set-prototype-of": "./object/set-prototype-of/index.js",
      "./reg-exp": "./reg-exp/index.js",
      "./reg-exp/#": "./reg-exp/#/index.js",
      "./reg-exp/#/match": "./reg-exp/#/match/index.js",
      "./reg-exp/#/replace": "./reg-exp/#/replace/index.js",
      "./reg-exp/#/search": "./reg-exp/#/search/index.js",
      "./reg-exp/#/split": "./reg-exp/#/split/index.js",
      "./string": "./string/index.js",
      "./string/#": "./string/#/index.js",
      "./string/#/@@iterator": "./string/#/@@iterator/index.js",
      "./string/#/code-point-at": "./string/#/code-point-at/index.js",
      "./string/#/contains": "./string/#/contains/index.js",
      "./string/#/ends-with": "./string/#/ends-with/index.js",
      "./string/#/normalize": "./string/#/normalize/index.js",
      "./string/#/repeat": "./string/#/repeat/index.js",
      "./string/#/starts-with": "./string/#/starts-with/index.js",
      "./string/from-code-point": "./string/from-code-point/index.js",
      "./string/raw": "./string/raw/index.js",
      "./test/array/#/@@iterator": "./test/array/#/@@iterator/index.js",
      "./test/array/#/concat": "./test/array/#/concat/index.js",
      "./test/array/#/copy-within": "./test/array/#/copy-within/index.js",
      "./test/array/#/entries": "./test/array/#/entries/index.js",
      "./test/array/#/fill": "./test/array/#/fill/index.js",
      "./test/array/#/filter": "./test/array/#/filter/index.js",
      "./test/array/#/find": "./test/array/#/find/index.js",
      "./test/array/#/find-index": "./test/array/#/find-index/index.js",
      "./test/array/#/keys": "./test/array/#/keys/index.js",
      "./test/array/#/map": "./test/array/#/map/index.js",
      "./test/array/#/slice": "./test/array/#/slice/index.js",
      "./test/array/#/splice": "./test/array/#/splice/index.js",
      "./test/array/#/values": "./test/array/#/values/index.js",
      "./test/array/from": "./test/array/from/index.js",
      "./test/array/of": "./test/array/of/index.js",
      "./test/math/acosh": "./test/math/acosh/index.js",
      "./test/math/asinh": "./test/math/asinh/index.js",
      "./test/math/atanh": "./test/math/atanh/index.js",
      "./test/math/cbrt": "./test/math/cbrt/index.js",
      "./test/math/clz32": "./test/math/clz32/index.js",
      "./test/math/cosh": "./test/math/cosh/index.js",
      "./test/math/expm1": "./test/math/expm1/index.js",
      "./test/math/fround": "./test/math/fround/index.js",
      "./test/math/hypot": "./test/math/hypot/index.js",
      "./test/math/imul": "./test/math/imul/index.js",
      "./test/math/log10": "./test/math/log10/index.js",
      "./test/math/log1p": "./test/math/log1p/index.js",
      "./test/math/log2": "./test/math/log2/index.js",
      "./test/math/sign": "./test/math/sign/index.js",
      "./test/math/sinh": "./test/math/sinh/index.js",
      "./test/math/tanh": "./test/math/tanh/index.js",
      "./test/math/trunc": "./test/math/trunc/index.js",
      "./test/number/epsilon": "./test/number/epsilon/index.js",
      "./test/number/is-finite": "./test/number/is-finite/index.js",
      "./test/number/is-integer": "./test/number/is-integer/index.js",
      "./test/number/is-nan": "./test/number/is-nan/index.js",
      "./test/number/is-safe-integer": "./test/number/is-safe-integer/index.js",
      "./test/number/max-safe-integer": "./test/number/max-safe-integer/index.js",
      "./test/number/min-safe-integer": "./test/number/min-safe-integer/index.js",
      "./test/object/assign": "./test/object/assign/index.js",
      "./test/object/keys": "./test/object/keys/index.js",
      "./test/object/set-prototype-of": "./test/object/set-prototype-of/index.js",
      "./test/reg-exp/#": "./test/reg-exp/#/index.js",
      "./test/reg-exp/#/match": "./test/reg-exp/#/match/index.js",
      "./test/reg-exp/#/replace": "./test/reg-exp/#/replace/index.js",
      "./test/reg-exp/#/search": "./test/reg-exp/#/search/index.js",
      "./test/reg-exp/#/split": "./test/reg-exp/#/split/index.js",
      "./test/string/#/@@iterator": "./test/string/#/@@iterator/index.js",
      "./test/string/#/code-point-at": "./test/string/#/code-point-at/index.js",
      "./test/string/#/contains": "./test/string/#/contains/index.js",
      "./test/string/#/ends-with": "./test/string/#/ends-with/index.js",
      "./test/string/#/normalize": "./test/string/#/normalize/index.js",
      "./test/string/#/repeat": "./test/string/#/repeat/index.js",
      "./test/string/#/starts-with": "./test/string/#/starts-with/index.js",
      "./test/string/from-code-point": "./test/string/from-code-point/index.js",
      "./test/string/raw": "./test/string/raw/index.js"
    }
  };
});

System.registerDynamic("npm:es5-ext@0.10.29/object/primitive-set.js", ["process"], true, function ($__require, exports, module) {
	"use strict";

	var process = $__require("process");
	var global = this || self,
	    GLOBAL = global;
	var forEach = Array.prototype.forEach,
	    create = Object.create;

	// eslint-disable-next-line no-unused-vars
	module.exports = function (arg /*, …args*/) {
		var set = create(null);
		forEach.call(arguments, function (name) {
			set[name] = true;
		});
		return set;
	};
});
System.registerDynamic('npm:es6-map@0.1.5/lib/iterator-kinds.js', ['es5-ext/object/primitive-set'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	module.exports = $__require('es5-ext/object/primitive-set')('key', 'value', 'key+value');
});
System.registerDynamic('npm:es6-map@0.1.5/lib/iterator.js', ['es5-ext/object/set-prototype-of', 'd', 'es6-iterator', 'es6-symbol', './iterator-kinds'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var setPrototypeOf = $__require('es5-ext/object/set-prototype-of'),
	    d = $__require('d'),
	    Iterator = $__require('es6-iterator'),
	    toStringTagSymbol = $__require('es6-symbol').toStringTag,
	    kinds = $__require('./iterator-kinds'),
	    defineProperties = Object.defineProperties,
	    unBind = Iterator.prototype._unBind,
	    MapIterator;

	MapIterator = module.exports = function (map, kind) {
		if (!(this instanceof MapIterator)) return new MapIterator(map, kind);
		Iterator.call(this, map.__mapKeysData__, map);
		if (!kind || !kinds[kind]) kind = 'key+value';
		defineProperties(this, {
			__kind__: d('', kind),
			__values__: d('w', map.__mapValuesData__)
		});
	};
	if (setPrototypeOf) setPrototypeOf(MapIterator, Iterator);

	MapIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(MapIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__values__[i];
			if (this.__kind__ === 'key') return this.__list__[i];
			return [this.__list__[i], this.__values__[i]];
		}),
		_unBind: d(function () {
			this.__values__ = null;
			unBind.call(this);
		}),
		toString: d(function () {
			return '[object Map Iterator]';
		})
	});
	Object.defineProperty(MapIterator.prototype, toStringTagSymbol, d('c', 'Map Iterator'));
});
System.registerDynamic('npm:es6-map@0.1.5/is-native-implemented.js', [], true, function ($__require, exports, module) {
	// Exports true if environment provides native `Map` implementation,
	// whatever that is.

	'use strict';

	var global = this || self,
	    GLOBAL = global;
	module.exports = function () {
		if (typeof Map === 'undefined') return false;
		return Object.prototype.toString.call(new Map()) === '[object Map]';
	}();
});
System.registerDynamic('npm:es6-map@0.1.5/polyfill.js', ['es5-ext/array/#/clear', 'es5-ext/array/#/e-index-of', 'es5-ext/object/set-prototype-of', 'es5-ext/object/valid-callable', 'es5-ext/object/valid-value', 'd', 'event-emitter', 'es6-symbol', 'es6-iterator/valid-iterable', 'es6-iterator/for-of', './lib/iterator', './is-native-implemented'], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	var clear = $__require('es5-ext/array/#/clear'),
	    eIndexOf = $__require('es5-ext/array/#/e-index-of'),
	    setPrototypeOf = $__require('es5-ext/object/set-prototype-of'),
	    callable = $__require('es5-ext/object/valid-callable'),
	    validValue = $__require('es5-ext/object/valid-value'),
	    d = $__require('d'),
	    ee = $__require('event-emitter'),
	    Symbol = $__require('es6-symbol'),
	    iterator = $__require('es6-iterator/valid-iterable'),
	    forOf = $__require('es6-iterator/for-of'),
	    Iterator = $__require('./lib/iterator'),
	    isNative = $__require('./is-native-implemented'),
	    call = Function.prototype.call,
	    defineProperties = Object.defineProperties,
	    getPrototypeOf = Object.getPrototypeOf,
	    MapPoly;

	module.exports = MapPoly = function () /*iterable*/{
		var iterable = arguments[0],
		    keys,
		    values,
		    self;
		if (!(this instanceof MapPoly)) throw new TypeError('Constructor requires \'new\'');
		if (isNative && setPrototypeOf && Map !== MapPoly) {
			self = setPrototypeOf(new Map(), getPrototypeOf(this));
		} else {
			self = this;
		}
		if (iterable != null) iterator(iterable);
		defineProperties(self, {
			__mapKeysData__: d('c', keys = []),
			__mapValuesData__: d('c', values = [])
		});
		if (!iterable) return self;
		forOf(iterable, function (value) {
			var key = validValue(value)[0];
			value = value[1];
			if (eIndexOf.call(keys, key) !== -1) return;
			keys.push(key);
			values.push(value);
		}, self);
		return self;
	};

	if (isNative) {
		if (setPrototypeOf) setPrototypeOf(MapPoly, Map);
		MapPoly.prototype = Object.create(Map.prototype, {
			constructor: d(MapPoly)
		});
	}

	ee(defineProperties(MapPoly.prototype, {
		clear: d(function () {
			if (!this.__mapKeysData__.length) return;
			clear.call(this.__mapKeysData__);
			clear.call(this.__mapValuesData__);
			this.emit('_clear');
		}),
		delete: d(function (key) {
			var index = eIndexOf.call(this.__mapKeysData__, key);
			if (index === -1) return false;
			this.__mapKeysData__.splice(index, 1);
			this.__mapValuesData__.splice(index, 1);
			this.emit('_delete', index, key);
			return true;
		}),
		entries: d(function () {
			return new Iterator(this, 'key+value');
		}),
		forEach: d(function (cb /*, thisArg*/) {
			var thisArg = arguments[1],
			    iterator,
			    result;
			callable(cb);
			iterator = this.entries();
			result = iterator._next();
			while (result !== undefined) {
				call.call(cb, thisArg, this.__mapValuesData__[result], this.__mapKeysData__[result], this);
				result = iterator._next();
			}
		}),
		get: d(function (key) {
			var index = eIndexOf.call(this.__mapKeysData__, key);
			if (index === -1) return;
			return this.__mapValuesData__[index];
		}),
		has: d(function (key) {
			return eIndexOf.call(this.__mapKeysData__, key) !== -1;
		}),
		keys: d(function () {
			return new Iterator(this, 'key');
		}),
		set: d(function (key, value) {
			var index = eIndexOf.call(this.__mapKeysData__, key),
			    emit;
			if (index === -1) {
				index = this.__mapKeysData__.push(key) - 1;
				emit = true;
			}
			this.__mapValuesData__[index] = value;
			if (emit) this.emit('_add', index, key);
			return this;
		}),
		size: d.gs(function () {
			return this.__mapKeysData__.length;
		}),
		values: d(function () {
			return new Iterator(this, 'value');
		}),
		toString: d(function () {
			return '[object Map]';
		})
	}));
	Object.defineProperty(MapPoly.prototype, Symbol.iterator, d(function () {
		return this.entries();
	}));
	Object.defineProperty(MapPoly.prototype, Symbol.toStringTag, d('c', 'Map'));
});
System.registerDynamic("npm:es6-map@0.1.5.json", [], true, function() {
  return {
    "main": "index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      }
    },
    "map": {
      "./primitive": "./primitive/index.js",
      "./test": "./test/index.js",
      "./test/primitive": "./test/primitive/index.js"
    }
  };
});

System.registerDynamic('npm:es6-map@0.1.5/index.js', ['./is-implemented', './polyfill'], true, function ($__require, exports, module) {
  'use strict';

  var global = this || self,
      GLOBAL = global;
  module.exports = $__require('./is-implemented')() ? Map : $__require('./polyfill');
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/makeDOMDriver.js", ["snabbdom", "xstream", "./MainDOMSource", "snabbdom/tovnode", "./VNodeWrapper", "./utils", "./modules", "./IsolateModule", "es6-map"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var snabbdom_1 = $__require("snabbdom");
    var xstream_1 = $__require("xstream");
    var MainDOMSource_1 = $__require("./MainDOMSource");
    var tovnode_1 = $__require("snabbdom/tovnode");
    var VNodeWrapper_1 = $__require("./VNodeWrapper");
    var utils_1 = $__require("./utils");
    var modules_1 = $__require("./modules");
    var IsolateModule_1 = $__require("./IsolateModule");
    var MapPolyfill = $__require('es6-map');
    function makeDOMDriverInputGuard(modules) {
        if (!Array.isArray(modules)) {
            throw new Error("Optional modules option must be " + "an array for snabbdom modules");
        }
    }
    function domDriverInputGuard(view$) {
        if (!view$ || typeof view$.addListener !== "function" || typeof view$.fold !== "function") {
            throw new Error("The DOM driver function expects as input a Stream of " + "virtual DOM elements");
        }
    }
    function dropCompletion(input) {
        return xstream_1.default.merge(input, xstream_1.default.never());
    }
    function unwrapElementFromVNode(vnode) {
        return vnode.elm;
    }
    function reportSnabbdomError(err) {
        (console.error || console.log)(err);
    }
    function makeDOMDriver(container, options) {
        if (!options) {
            options = {};
        }
        var modules = options.modules || modules_1.default;
        var isolateModule = new IsolateModule_1.IsolateModule();
        var patch = snabbdom_1.init([isolateModule.createModule()].concat(modules));
        var rootElement = utils_1.getValidNode(container) || document.body;
        var vnodeWrapper = new VNodeWrapper_1.VNodeWrapper(rootElement);
        var delegators = new MapPolyfill();
        makeDOMDriverInputGuard(modules);
        function DOMDriver(vnode$, name) {
            if (name === void 0) {
                name = 'DOM';
            }
            domDriverInputGuard(vnode$);
            var sanitation$ = xstream_1.default.create();
            var rootElement$ = xstream_1.default.merge(vnode$.endWhen(sanitation$), sanitation$).map(function (vnode) {
                return vnodeWrapper.call(vnode);
            }).fold(patch, tovnode_1.toVNode(rootElement)).drop(1).map(unwrapElementFromVNode).compose(dropCompletion) // don't complete this stream
            .startWith(rootElement);
            // Start the snabbdom patching, over time
            var listener = { error: reportSnabbdomError };
            if (document.readyState === 'loading') {
                document.addEventListener('readystatechange', function () {
                    if (document.readyState === 'interactive') {
                        rootElement$.addListener(listener);
                    }
                });
            } else {
                rootElement$.addListener(listener);
            }
            return new MainDOMSource_1.MainDOMSource(rootElement$, sanitation$, [], isolateModule, delegators, name);
        }
        return DOMDriver;
    }
    exports.makeDOMDriver = makeDOMDriver;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/mockDOMSource.js", ["xstream", "@cycle/run/lib/adapt"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var xstream_1 = $__require("xstream");
    var adapt_1 = $__require("@cycle/run/lib/adapt");
    var SCOPE_PREFIX = '___';
    var MockedDOMSource = function () {
        function MockedDOMSource(_mockConfig) {
            this._mockConfig = _mockConfig;
            if (_mockConfig['elements']) {
                this._elements = _mockConfig['elements'];
            } else {
                this._elements = adapt_1.adapt(xstream_1.default.empty());
            }
        }
        MockedDOMSource.prototype.elements = function () {
            var out = this._elements;
            out._isCycleSource = 'MockedDOM';
            return out;
        };
        MockedDOMSource.prototype.events = function (eventType, options) {
            var streamForEventType = this._mockConfig[eventType];
            var out = adapt_1.adapt(streamForEventType || xstream_1.default.empty());
            out._isCycleSource = 'MockedDOM';
            return out;
        };
        MockedDOMSource.prototype.select = function (selector) {
            var mockConfigForSelector = this._mockConfig[selector] || {};
            return new MockedDOMSource(mockConfigForSelector);
        };
        MockedDOMSource.prototype.isolateSource = function (source, scope) {
            return source.select('.' + SCOPE_PREFIX + scope);
        };
        MockedDOMSource.prototype.isolateSink = function (sink, scope) {
            return sink.map(function (vnode) {
                if (vnode.sel && vnode.sel.indexOf(SCOPE_PREFIX + scope) !== -1) {
                    return vnode;
                } else {
                    vnode.sel += "." + SCOPE_PREFIX + scope;
                    return vnode;
                }
            });
        };
        return MockedDOMSource;
    }();
    exports.MockedDOMSource = MockedDOMSource;
    function mockDOMSource(mockConfig) {
        return new MockedDOMSource(mockConfig);
    }
    exports.mockDOMSource = mockDOMSource;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/vnode.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    function vnode(sel, data, children, text, elm) {
        var key = data === undefined ? undefined : data.key;
        return { sel: sel, data: data, children: children,
            text: text, elm: elm, key: key };
    }
    exports.vnode = vnode;
    exports.default = vnode;
    
});
System.registerDynamic("npm:snabbdom@0.7.0/is.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.array = Array.isArray;
    function primitive(s) {
        return typeof s === 'string' || typeof s === 'number';
    }
    exports.primitive = primitive;
    
});
System.registerDynamic("npm:snabbdom@0.7.0.json", [], true, function() {
  return {
    "main": "snabbdom.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      },
      "dist/h.js": {
        "cjsRequireDetection": false
      },
      "dist/snabbdom-attributes.js": {
        "cjsRequireDetection": false
      },
      "dist/snabbdom-class.js": {
        "cjsRequireDetection": false
      },
      "dist/snabbdom-eventlisteners.js": {
        "cjsRequireDetection": false
      },
      "dist/snabbdom-patch.js": {
        "cjsRequireDetection": false
      },
      "dist/snabbdom-props.js": {
        "cjsRequireDetection": false
      },
      "dist/snabbdom-style.js": {
        "cjsRequireDetection": false
      },
      "dist/snabbdom.js": {
        "cjsRequireDetection": false
      },
      "dist/tovnode.js": {
        "cjsRequireDetection": false
      },
      "examples/carousel-svg/build.js": {
        "cjsRequireDetection": false
      },
      "examples/hero/build.js": {
        "cjsRequireDetection": false
      },
      "examples/reorder-animation/build.js": {
        "cjsRequireDetection": false
      },
      "examples/svg/build.js": {
        "cjsRequireDetection": false
      }
    }
  };
});

System.registerDynamic("npm:snabbdom@0.7.0/h.js", ["./vnode", "./is"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var vnode_1 = $__require("./vnode");
    var is = $__require("./is");
    function addNS(data, children, sel) {
        data.ns = 'http://www.w3.org/2000/svg';
        if (sel !== 'foreignObject' && children !== undefined) {
            for (var i = 0; i < children.length; ++i) {
                var childData = children[i].data;
                if (childData !== undefined) {
                    addNS(childData, children[i].children, children[i].sel);
                }
            }
        }
    }
    function h(sel, b, c) {
        var data = {},
            children,
            text,
            i;
        if (c !== undefined) {
            data = b;
            if (is.array(c)) {
                children = c;
            } else if (is.primitive(c)) {
                text = c;
            } else if (c && c.sel) {
                children = [c];
            }
        } else if (b !== undefined) {
            if (is.array(b)) {
                children = b;
            } else if (is.primitive(b)) {
                text = b;
            } else if (b && b.sel) {
                children = [b];
            } else {
                data = b;
            }
        }
        if (is.array(children)) {
            for (i = 0; i < children.length; ++i) {
                if (is.primitive(children[i])) children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i]);
            }
        }
        if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
            addNS(data, children, sel);
        }
        return vnode_1.vnode(sel, data, children, text, undefined);
    }
    exports.h = h;
    ;
    exports.default = h;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0/lib/hyperscript-helpers.js", ["snabbdom/h"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    // tslint:disable:max-file-line-count
    var h_1 = $__require("snabbdom/h");
    function isValidString(param) {
        return typeof param === 'string' && param.length > 0;
    }
    function isSelector(param) {
        return isValidString(param) && (param[0] === '.' || param[0] === '#');
    }
    function createTagFunction(tagName) {
        return function hyperscript(a, b, c) {
            var hasA = typeof a !== 'undefined';
            var hasB = typeof b !== 'undefined';
            var hasC = typeof c !== 'undefined';
            if (isSelector(a)) {
                if (hasB && hasC) {
                    return h_1.h(tagName + a, b, c);
                } else if (hasB) {
                    return h_1.h(tagName + a, b);
                } else {
                    return h_1.h(tagName + a, {});
                }
            } else if (hasC) {
                return h_1.h(tagName + a, b, c);
            } else if (hasB) {
                return h_1.h(tagName, a, b);
            } else if (hasA) {
                return h_1.h(tagName, a);
            } else {
                return h_1.h(tagName, {});
            }
        };
    }
    var SVG_TAG_NAMES = ['a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'colorProfile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotlight', 'feTile', 'feTurbulence', 'filter', 'font', 'fontFace', 'fontFaceFormat', 'fontFaceName', 'fontFaceSrc', 'fontFaceUri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missingGlyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'stop', 'style', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'use', 'view', 'vkern'];
    var svg = createTagFunction('svg');
    SVG_TAG_NAMES.forEach(function (tag) {
        svg[tag] = createTagFunction(tag);
    });
    var TAG_NAMES = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'u', 'ul', 'video'];
    var exported = {
        SVG_TAG_NAMES: SVG_TAG_NAMES,
        TAG_NAMES: TAG_NAMES,
        svg: svg,
        isSelector: isSelector,
        createTagFunction: createTagFunction
    };
    TAG_NAMES.forEach(function (n) {
        exported[n] = createTagFunction(n);
    });
    exports.default = exported;
    
});
System.registerDynamic("npm:@cycle/dom@18.1.0.json", [], true, function() {
  return {
    "main": "lib/index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      },
      "dist/cycle-dom.js": {
        "cjsRequireDetection": false
      },
      "lib/es6/BodyDOMSource.js": {
        "format": "esm"
      },
      "lib/es6/DocumentDOMSource.js": {
        "format": "esm"
      },
      "lib/es6/ElementFinder.js": {
        "format": "esm"
      },
      "lib/es6/EventDelegator.js": {
        "format": "esm"
      },
      "lib/es6/IsolateModule.js": {
        "format": "esm"
      },
      "lib/es6/MainDOMSource.js": {
        "format": "esm"
      },
      "lib/es6/ScopeChecker.js": {
        "format": "esm"
      },
      "lib/es6/VNodeWrapper.js": {
        "format": "esm"
      },
      "lib/es6/fromEvent.js": {
        "format": "esm"
      },
      "lib/es6/hyperscript-helpers.js": {
        "format": "esm"
      },
      "lib/es6/index.js": {
        "format": "esm"
      },
      "lib/es6/isolate.js": {
        "format": "esm"
      },
      "lib/es6/makeDOMDriver.js": {
        "format": "esm"
      },
      "lib/es6/matchesSelector.js": {
        "format": "esm"
      },
      "lib/es6/mockDOMSource.js": {
        "format": "esm"
      },
      "lib/es6/modules.js": {
        "format": "esm"
      },
      "lib/es6/thunk.js": {
        "format": "esm"
      },
      "lib/es6/utils.js": {
        "format": "esm"
      },
      "test/browser/perf/index.js": {
        "format": "esm"
      },
      "test/browser/src/index.ts": {
        "format": "esm"
      },
      "test/manual-tests/advanced-list/src/*": {
        "format": "esm"
      }
    },
    "map": {
      "./lib": "./lib/index.js",
      "./test/browser/lib": "./test/browser/lib/index.js"
    }
  };
});

System.registerDynamic("npm:@cycle/dom@18.1.0/lib/index.js", ["./thunk", "./MainDOMSource", "./makeDOMDriver", "./mockDOMSource", "snabbdom/h", "./hyperscript-helpers"], true, function ($__require, exports, module) {
  "use strict";

  var global = this || self,
      GLOBAL = global;
  Object.defineProperty(exports, "__esModule", { value: true });
  var thunk_1 = $__require("./thunk");
  exports.thunk = thunk_1.thunk;
  var MainDOMSource_1 = $__require("./MainDOMSource");
  exports.MainDOMSource = MainDOMSource_1.MainDOMSource;
  /**
   * A factory for the DOM driver function.
   *
   * Takes a `container` to define the target on the existing DOM which this
   * driver will operate on, and an `options` object as the second argument. The
   * input to this driver is a stream of virtual DOM objects, or in other words,
   * Snabbdom "VNode" objects. The output of this driver is a "DOMSource": a
   * collection of Observables queried with the methods `select()` and `events()`.
   *
   * `DOMSource.select(selector)` returns a new DOMSource with scope restricted to
   * the element(s) that matches the CSS `selector` given.
   *
   * `DOMSource.events(eventType, options)` returns a stream of events of
   * `eventType` happening on the elements that match the current DOMSource. The
   * event object contains the `ownerTarget` property that behaves exactly like
   * `currentTarget`. The reason for this is that some browsers doesn't allow
   * `currentTarget` property to be mutated, hence a new property is created. The
   * returned stream is an *xstream* Stream if you use `@cycle/xstream-run` to run
   * your app with this driver, or it is an RxJS Observable if you use
   * `@cycle/rxjs-run`, and so forth. The `options` parameter can have the
   * property `useCapture`, which is by default `false`, except it is `true` for
   * event types that do not bubble. Read more here
   * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * about the `useCapture` and its purpose.
   * The other option is `preventDefault` that is set to false by default.
   * If set to true, the driver will automatically call `preventDefault()` on every event.
   *
   * `DOMSource.elements()` returns a stream of the DOM element(s) matched by the
   * selectors in the DOMSource. Also, `DOMSource.select(':root').elements()`
   * returns a stream of DOM element corresponding to the root (or container) of
   * the app on the DOM.
   *
   * @param {(String|HTMLElement)} container the DOM selector for the element
   * (or the element itself) to contain the rendering of the VTrees.
   * @param {DOMDriverOptions} options an object with two optional properties:
   *
   *   - `modules: array` overrides `@cycle/dom`'s default Snabbdom modules as
   *     as defined in [`src/modules.ts`](./src/modules.ts).
   *   - `transposition: boolean` enables/disables transposition of inner streams
   *     in the virtual DOM tree.
   * @return {Function} the DOM driver function. The function expects a stream of
   * VNode as input, and outputs the DOMSource object.
   * @function makeDOMDriver
   */
  var makeDOMDriver_1 = $__require("./makeDOMDriver");
  exports.makeDOMDriver = makeDOMDriver_1.makeDOMDriver;
  /**
   * A factory function to create mocked DOMSource objects, for testing purposes.
   *
   * Takes a `mockConfig` object as argument, and returns
   * a DOMSource that can be given to any Cycle.js app that expects a DOMSource in
   * the sources, for testing.
   *
   * The `mockConfig` parameter is an object specifying selectors, eventTypes and
   * their streams. Example:
   *
   * ```js
   * const domSource = mockDOMSource({
   *   '.foo': {
   *     'click': xs.of({target: {}}),
   *     'mouseover': xs.of({target: {}}),
   *   },
   *   '.bar': {
   *     'scroll': xs.of({target: {}}),
   *     elements: xs.of({tagName: 'div'}),
   *   }
   * });
   *
   * // Usage
   * const click$ = domSource.select('.foo').events('click');
   * const element$ = domSource.select('.bar').elements();
   * ```
   *
   * The mocked DOM Source supports isolation. It has the functions `isolateSink`
   * and `isolateSource` attached to it, and performs simple isolation using
   * classNames. *isolateSink* with scope `foo` will append the class `___foo` to
   * the stream of virtual DOM nodes, and *isolateSource* with scope `foo` will
   * perform a conventional `mockedDOMSource.select('.__foo')` call.
   *
   * @param {Object} mockConfig an object where keys are selector strings
   * and values are objects. Those nested objects have `eventType` strings as keys
   * and values are streams you created.
   * @return {Object} fake DOM source object, with an API containing `select()`
   * and `events()` and `elements()` which can be used just like the DOM Driver's
   * DOMSource.
   *
   * @function mockDOMSource
   */
  var mockDOMSource_1 = $__require("./mockDOMSource");
  exports.mockDOMSource = mockDOMSource_1.mockDOMSource;
  exports.MockedDOMSource = mockDOMSource_1.MockedDOMSource;
  /**
   * The hyperscript function `h()` is a function to create virtual DOM objects,
   * also known as VNodes. Call
   *
   * ```js
   * h('div.myClass', {style: {color: 'red'}}, [])
   * ```
   *
   * to create a VNode that represents a `DIV` element with className `myClass`,
   * styled with red color, and no children because the `[]` array was passed. The
   * API is `h(tagOrSelector, optionalData, optionalChildrenOrText)`.
   *
   * However, usually you should use "hyperscript helpers", which are shortcut
   * functions based on hyperscript. There is one hyperscript helper function for
   * each DOM tagName, such as `h1()`, `h2()`, `div()`, `span()`, `label()`,
   * `input()`. For instance, the previous example could have been written
   * as:
   *
   * ```js
   * div('.myClass', {style: {color: 'red'}}, [])
   * ```
   *
   * There are also SVG helper functions, which apply the appropriate SVG
   * namespace to the resulting elements. `svg()` function creates the top-most
   * SVG element, and `svg.g`, `svg.polygon`, `svg.circle`, `svg.path` are for
   * SVG-specific child elements. Example:
   *
   * ```js
   * svg({attrs: {width: 150, height: 150}}, [
   *   svg.polygon({
   *     attrs: {
   *       class: 'triangle',
   *       points: '20 0 20 150 150 20'
   *     }
   *   })
   * ])
   * ```
   *
   * @function h
   */
  var h_1 = $__require("snabbdom/h");
  exports.h = h_1.h;
  var hyperscript_helpers_1 = $__require("./hyperscript-helpers");
  exports.svg = hyperscript_helpers_1.default.svg;
  exports.a = hyperscript_helpers_1.default.a;
  exports.abbr = hyperscript_helpers_1.default.abbr;
  exports.address = hyperscript_helpers_1.default.address;
  exports.area = hyperscript_helpers_1.default.area;
  exports.article = hyperscript_helpers_1.default.article;
  exports.aside = hyperscript_helpers_1.default.aside;
  exports.audio = hyperscript_helpers_1.default.audio;
  exports.b = hyperscript_helpers_1.default.b;
  exports.base = hyperscript_helpers_1.default.base;
  exports.bdi = hyperscript_helpers_1.default.bdi;
  exports.bdo = hyperscript_helpers_1.default.bdo;
  exports.blockquote = hyperscript_helpers_1.default.blockquote;
  exports.body = hyperscript_helpers_1.default.body;
  exports.br = hyperscript_helpers_1.default.br;
  exports.button = hyperscript_helpers_1.default.button;
  exports.canvas = hyperscript_helpers_1.default.canvas;
  exports.caption = hyperscript_helpers_1.default.caption;
  exports.cite = hyperscript_helpers_1.default.cite;
  exports.code = hyperscript_helpers_1.default.code;
  exports.col = hyperscript_helpers_1.default.col;
  exports.colgroup = hyperscript_helpers_1.default.colgroup;
  exports.dd = hyperscript_helpers_1.default.dd;
  exports.del = hyperscript_helpers_1.default.del;
  exports.dfn = hyperscript_helpers_1.default.dfn;
  exports.dir = hyperscript_helpers_1.default.dir;
  exports.div = hyperscript_helpers_1.default.div;
  exports.dl = hyperscript_helpers_1.default.dl;
  exports.dt = hyperscript_helpers_1.default.dt;
  exports.em = hyperscript_helpers_1.default.em;
  exports.embed = hyperscript_helpers_1.default.embed;
  exports.fieldset = hyperscript_helpers_1.default.fieldset;
  exports.figcaption = hyperscript_helpers_1.default.figcaption;
  exports.figure = hyperscript_helpers_1.default.figure;
  exports.footer = hyperscript_helpers_1.default.footer;
  exports.form = hyperscript_helpers_1.default.form;
  exports.h1 = hyperscript_helpers_1.default.h1;
  exports.h2 = hyperscript_helpers_1.default.h2;
  exports.h3 = hyperscript_helpers_1.default.h3;
  exports.h4 = hyperscript_helpers_1.default.h4;
  exports.h5 = hyperscript_helpers_1.default.h5;
  exports.h6 = hyperscript_helpers_1.default.h6;
  exports.head = hyperscript_helpers_1.default.head;
  exports.header = hyperscript_helpers_1.default.header;
  exports.hgroup = hyperscript_helpers_1.default.hgroup;
  exports.hr = hyperscript_helpers_1.default.hr;
  exports.html = hyperscript_helpers_1.default.html;
  exports.i = hyperscript_helpers_1.default.i;
  exports.iframe = hyperscript_helpers_1.default.iframe;
  exports.img = hyperscript_helpers_1.default.img;
  exports.input = hyperscript_helpers_1.default.input;
  exports.ins = hyperscript_helpers_1.default.ins;
  exports.kbd = hyperscript_helpers_1.default.kbd;
  exports.keygen = hyperscript_helpers_1.default.keygen;
  exports.label = hyperscript_helpers_1.default.label;
  exports.legend = hyperscript_helpers_1.default.legend;
  exports.li = hyperscript_helpers_1.default.li;
  exports.link = hyperscript_helpers_1.default.link;
  exports.main = hyperscript_helpers_1.default.main;
  exports.map = hyperscript_helpers_1.default.map;
  exports.mark = hyperscript_helpers_1.default.mark;
  exports.menu = hyperscript_helpers_1.default.menu;
  exports.meta = hyperscript_helpers_1.default.meta;
  exports.nav = hyperscript_helpers_1.default.nav;
  exports.noscript = hyperscript_helpers_1.default.noscript;
  exports.object = hyperscript_helpers_1.default.object;
  exports.ol = hyperscript_helpers_1.default.ol;
  exports.optgroup = hyperscript_helpers_1.default.optgroup;
  exports.option = hyperscript_helpers_1.default.option;
  exports.p = hyperscript_helpers_1.default.p;
  exports.param = hyperscript_helpers_1.default.param;
  exports.pre = hyperscript_helpers_1.default.pre;
  exports.progress = hyperscript_helpers_1.default.progress;
  exports.q = hyperscript_helpers_1.default.q;
  exports.rp = hyperscript_helpers_1.default.rp;
  exports.rt = hyperscript_helpers_1.default.rt;
  exports.ruby = hyperscript_helpers_1.default.ruby;
  exports.s = hyperscript_helpers_1.default.s;
  exports.samp = hyperscript_helpers_1.default.samp;
  exports.script = hyperscript_helpers_1.default.script;
  exports.section = hyperscript_helpers_1.default.section;
  exports.select = hyperscript_helpers_1.default.select;
  exports.small = hyperscript_helpers_1.default.small;
  exports.source = hyperscript_helpers_1.default.source;
  exports.span = hyperscript_helpers_1.default.span;
  exports.strong = hyperscript_helpers_1.default.strong;
  exports.style = hyperscript_helpers_1.default.style;
  exports.sub = hyperscript_helpers_1.default.sub;
  exports.sup = hyperscript_helpers_1.default.sup;
  exports.table = hyperscript_helpers_1.default.table;
  exports.tbody = hyperscript_helpers_1.default.tbody;
  exports.td = hyperscript_helpers_1.default.td;
  exports.textarea = hyperscript_helpers_1.default.textarea;
  exports.tfoot = hyperscript_helpers_1.default.tfoot;
  exports.th = hyperscript_helpers_1.default.th;
  exports.thead = hyperscript_helpers_1.default.thead;
  exports.title = hyperscript_helpers_1.default.title;
  exports.tr = hyperscript_helpers_1.default.tr;
  exports.u = hyperscript_helpers_1.default.u;
  exports.ul = hyperscript_helpers_1.default.ul;
  exports.video = hyperscript_helpers_1.default.video;
  
});
System.registerDynamic("npm:@cycle/http@13.3.0/lib/isolate.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    function isolateSource(httpSource, scope) {
        if (scope === null) {
            return httpSource;
        }
        return httpSource.filter(function (request) {
            return Array.isArray(request._namespace) && request._namespace.indexOf(scope) !== -1;
        });
    }
    exports.isolateSource = isolateSource;
    function isolateSink(request$, scope) {
        if (scope === null) {
            return request$;
        }
        return request$.map(function (req) {
            if (typeof req === 'string') {
                return { url: req, _namespace: [scope] };
            }
            req._namespace = req._namespace || [];
            req._namespace.push(scope);
            return req;
        });
    }
    exports.isolateSink = isolateSink;
    
});
System.registerDynamic("npm:@cycle/http@13.3.0/lib/MainHTTPSource.js", ["./isolate", "@cycle/run/lib/adapt"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var isolate_1 = $__require("./isolate");
    var adapt_1 = $__require("@cycle/run/lib/adapt");
    var MainHTTPSource = function () {
        function MainHTTPSource(_res$$, _name, _namespace) {
            if (_namespace === void 0) {
                _namespace = [];
            }
            this._res$$ = _res$$;
            this._name = _name;
            this._namespace = _namespace;
            this.isolateSource = isolate_1.isolateSource;
            this.isolateSink = isolate_1.isolateSink;
        }
        MainHTTPSource.prototype.filter = function (predicate) {
            var filteredResponse$$ = this._res$$.filter(function (r$) {
                return predicate(r$.request);
            });
            return new MainHTTPSource(filteredResponse$$, this._name, this._namespace);
        };
        MainHTTPSource.prototype.select = function (category) {
            var res$$ = category ? this._res$$.filter(function (res$) {
                return res$.request && res$.request.category === category;
            }) : this._res$$;
            var out = adapt_1.adapt(res$$);
            out._isCycleSource = this._name;
            return out;
        };
        return MainHTTPSource;
    }();
    exports.MainHTTPSource = MainHTTPSource;
    
});
System.registerDynamic("npm:component-emitter@1.2.1.json", [], true, function() {
  return {
    "main": "index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      }
    }
  };
});

System.registerDynamic('npm:component-emitter@1.2.1/index.js', [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;

  /**
   * Expose `Emitter`.
   */

  if (typeof module !== 'undefined') {
    module.exports = Emitter;
  }

  /**
   * Initialize a new `Emitter`.
   *
   * @api public
   */

  function Emitter(obj) {
    if (obj) return mixin(obj);
  };

  /**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */

  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {};
    (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.once = function (event, fn) {
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {};

    // all
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }

    // specific event
    var callbacks = this._callbacks['$' + event];
    if (!callbacks) return this;

    // remove all handlers
    if (1 == arguments.length) {
      delete this._callbacks['$' + event];
      return this;
    }

    // remove specific handler
    var cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */

  Emitter.prototype.emit = function (event) {
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1),
        callbacks = this._callbacks['$' + event];

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }

    return this;
  };

  /**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */

  Emitter.prototype.listeners = function (event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  };

  /**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */

  Emitter.prototype.hasListeners = function (event) {
    return !!this.listeners(event).length;
  };
});
System.registerDynamic('npm:superagent@3.5.2/lib/request-base.js', ['./is-object'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /**
   * Module of mixed-in functions shared between node and client code
   */
  var isObject = $__require('./is-object');

  /**
   * Expose `RequestBase`.
   */

  module.exports = RequestBase;

  /**
   * Initialize a new `RequestBase`.
   *
   * @api public
   */

  function RequestBase(obj) {
    if (obj) return mixin(obj);
  }

  /**
   * Mixin the prototype properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */

  function mixin(obj) {
    for (var key in RequestBase.prototype) {
      obj[key] = RequestBase.prototype[key];
    }
    return obj;
  }

  /**
   * Clear previous timeout.
   *
   * @return {Request} for chaining
   * @api public
   */

  RequestBase.prototype.clearTimeout = function _clearTimeout() {
    clearTimeout(this._timer);
    clearTimeout(this._responseTimeoutTimer);
    delete this._timer;
    delete this._responseTimeoutTimer;
    return this;
  };

  /**
   * Override default response body parser
   *
   * This function will be called to convert incoming data into request.body
   *
   * @param {Function}
   * @api public
   */

  RequestBase.prototype.parse = function parse(fn) {
    this._parser = fn;
    return this;
  };

  /**
   * Set format of binary response body.
   * In browser valid formats are 'blob' and 'arraybuffer',
   * which return Blob and ArrayBuffer, respectively.
   *
   * In Node all values result in Buffer.
   *
   * Examples:
   *
   *      req.get('/')
   *        .responseType('blob')
   *        .end(callback);
   *
   * @param {String} val
   * @return {Request} for chaining
   * @api public
   */

  RequestBase.prototype.responseType = function (val) {
    this._responseType = val;
    return this;
  };

  /**
   * Override default request body serializer
   *
   * This function will be called to convert data set via .send or .attach into payload to send
   *
   * @param {Function}
   * @api public
   */

  RequestBase.prototype.serialize = function serialize(fn) {
    this._serializer = fn;
    return this;
  };

  /**
   * Set timeouts.
   *
   * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
   * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
   *
   * Value of 0 or false means no timeout.
   *
   * @param {Number|Object} ms or {response, read, deadline}
   * @return {Request} for chaining
   * @api public
   */

  RequestBase.prototype.timeout = function timeout(options) {
    if (!options || 'object' !== typeof options) {
      this._timeout = options;
      this._responseTimeout = 0;
      return this;
    }

    for (var option in options) {
      switch (option) {
        case 'deadline':
          this._timeout = options.deadline;
          break;
        case 'response':
          this._responseTimeout = options.response;
          break;
        default:
          console.warn("Unknown timeout option", option);
      }
    }
    return this;
  };

  /**
   * Set number of retry attempts on error.
   *
   * Failed requests will be retried 'count' times if timeout or err.code >= 500.
   *
   * @param {Number} count
   * @return {Request} for chaining
   * @api public
   */

  RequestBase.prototype.retry = function retry(count) {
    // Default to 1 if no count passed or true
    if (arguments.length === 0 || count === true) count = 1;
    if (count <= 0) count = 0;
    this._maxRetries = count;
    this._retries = 0;
    return this;
  };

  /**
   * Retry request
   *
   * @return {Request} for chaining
   * @api private
   */

  RequestBase.prototype._retry = function () {
    this.clearTimeout();

    // node
    if (this.req) {
      this.req = null;
      this.req = this.request();
    }

    this._aborted = false;
    this.timedout = false;

    return this._end();
  };

  /**
   * Promise support
   *
   * @param {Function} resolve
   * @param {Function} [reject]
   * @return {Request}
   */

  RequestBase.prototype.then = function then(resolve, reject) {
    if (!this._fullfilledPromise) {
      var self = this;
      if (this._endCalled) {
        console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
      }
      this._fullfilledPromise = new Promise(function (innerResolve, innerReject) {
        self.end(function (err, res) {
          if (err) innerReject(err);else innerResolve(res);
        });
      });
    }
    return this._fullfilledPromise.then(resolve, reject);
  };

  RequestBase.prototype.catch = function (cb) {
    return this.then(undefined, cb);
  };

  /**
   * Allow for extension
   */

  RequestBase.prototype.use = function use(fn) {
    fn(this);
    return this;
  };

  RequestBase.prototype.ok = function (cb) {
    if ('function' !== typeof cb) throw Error("Callback required");
    this._okCallback = cb;
    return this;
  };

  RequestBase.prototype._isResponseOK = function (res) {
    if (!res) {
      return false;
    }

    if (this._okCallback) {
      return this._okCallback(res);
    }

    return res.status >= 200 && res.status < 300;
  };

  /**
   * Get request header `field`.
   * Case-insensitive.
   *
   * @param {String} field
   * @return {String}
   * @api public
   */

  RequestBase.prototype.get = function (field) {
    return this._header[field.toLowerCase()];
  };

  /**
   * Get case-insensitive header `field` value.
   * This is a deprecated internal API. Use `.get(field)` instead.
   *
   * (getHeader is no longer used internally by the superagent code base)
   *
   * @param {String} field
   * @return {String}
   * @api private
   * @deprecated
   */

  RequestBase.prototype.getHeader = RequestBase.prototype.get;

  /**
   * Set header `field` to `val`, or multiple fields with one object.
   * Case-insensitive.
   *
   * Examples:
   *
   *      req.get('/')
   *        .set('Accept', 'application/json')
   *        .set('X-API-Key', 'foobar')
   *        .end(callback);
   *
   *      req.get('/')
   *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
   *        .end(callback);
   *
   * @param {String|Object} field
   * @param {String} val
   * @return {Request} for chaining
   * @api public
   */

  RequestBase.prototype.set = function (field, val) {
    if (isObject(field)) {
      for (var key in field) {
        this.set(key, field[key]);
      }
      return this;
    }
    this._header[field.toLowerCase()] = val;
    this.header[field] = val;
    return this;
  };

  /**
   * Remove header `field`.
   * Case-insensitive.
   *
   * Example:
   *
   *      req.get('/')
   *        .unset('User-Agent')
   *        .end(callback);
   *
   * @param {String} field
   */
  RequestBase.prototype.unset = function (field) {
    delete this._header[field.toLowerCase()];
    delete this.header[field];
    return this;
  };

  /**
   * Write the field `name` and `val`, or multiple fields with one object
   * for "multipart/form-data" request bodies.
   *
   * ``` js
   * request.post('/upload')
   *   .field('foo', 'bar')
   *   .end(callback);
   *
   * request.post('/upload')
   *   .field({ foo: 'bar', baz: 'qux' })
   *   .end(callback);
   * ```
   *
   * @param {String|Object} name
   * @param {String|Blob|File|Buffer|fs.ReadStream} val
   * @return {Request} for chaining
   * @api public
   */
  RequestBase.prototype.field = function (name, val) {

    // name should be either a string or an object.
    if (null === name || undefined === name) {
      throw new Error('.field(name, val) name can not be empty');
    }

    if (this._data) {
      console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
    }

    if (isObject(name)) {
      for (var key in name) {
        this.field(key, name[key]);
      }
      return this;
    }

    if (Array.isArray(val)) {
      for (var i in val) {
        this.field(name, val[i]);
      }
      return this;
    }

    // val should be defined now
    if (null === val || undefined === val) {
      throw new Error('.field(name, val) val can not be empty');
    }
    if ('boolean' === typeof val) {
      val = '' + val;
    }
    this._getFormData().append(name, val);
    return this;
  };

  /**
   * Abort the request, and clear potential timeout.
   *
   * @return {Request}
   * @api public
   */
  RequestBase.prototype.abort = function () {
    if (this._aborted) {
      return this;
    }
    this._aborted = true;
    this.xhr && this.xhr.abort(); // browser
    this.req && this.req.abort(); // node
    this.clearTimeout();
    this.emit('abort');
    return this;
  };

  /**
   * Enable transmission of cookies with x-domain requests.
   *
   * Note that for this to work the origin must not be
   * using "Access-Control-Allow-Origin" with a wildcard,
   * and also must set "Access-Control-Allow-Credentials"
   * to "true".
   *
   * @api public
   */

  RequestBase.prototype.withCredentials = function (on) {
    // This is browser-only functionality. Node side is no-op.
    if (on == undefined) on = true;
    this._withCredentials = on;
    return this;
  };

  /**
   * Set the max redirects to `n`. Does noting in browser XHR implementation.
   *
   * @param {Number} n
   * @return {Request} for chaining
   * @api public
   */

  RequestBase.prototype.redirects = function (n) {
    this._maxRedirects = n;
    return this;
  };

  /**
   * Convert to a plain javascript object (not JSON string) of scalar properties.
   * Note as this method is designed to return a useful non-this value,
   * it cannot be chained.
   *
   * @return {Object} describing method, url, and data of this request
   * @api public
   */

  RequestBase.prototype.toJSON = function () {
    return {
      method: this.method,
      url: this.url,
      data: this._data,
      headers: this._header
    };
  };

  /**
   * Send `data` as the request body, defaulting the `.type()` to "json" when
   * an object is given.
   *
   * Examples:
   *
   *       // manual json
   *       request.post('/user')
   *         .type('json')
   *         .send('{"name":"tj"}')
   *         .end(callback)
   *
   *       // auto json
   *       request.post('/user')
   *         .send({ name: 'tj' })
   *         .end(callback)
   *
   *       // manual x-www-form-urlencoded
   *       request.post('/user')
   *         .type('form')
   *         .send('name=tj')
   *         .end(callback)
   *
   *       // auto x-www-form-urlencoded
   *       request.post('/user')
   *         .type('form')
   *         .send({ name: 'tj' })
   *         .end(callback)
   *
   *       // defaults to x-www-form-urlencoded
   *      request.post('/user')
   *        .send('name=tobi')
   *        .send('species=ferret')
   *        .end(callback)
   *
   * @param {String|Object} data
   * @return {Request} for chaining
   * @api public
   */

  RequestBase.prototype.send = function (data) {
    var isObj = isObject(data);
    var type = this._header['content-type'];

    if (this._formData) {
      console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
    }

    if (isObj && !this._data) {
      if (Array.isArray(data)) {
        this._data = [];
      } else if (!this._isHost(data)) {
        this._data = {};
      }
    } else if (data && this._data && this._isHost(this._data)) {
      throw Error("Can't merge these send calls");
    }

    // merge
    if (isObj && isObject(this._data)) {
      for (var key in data) {
        this._data[key] = data[key];
      }
    } else if ('string' == typeof data) {
      // default to x-www-form-urlencoded
      if (!type) this.type('form');
      type = this._header['content-type'];
      if ('application/x-www-form-urlencoded' == type) {
        this._data = this._data ? this._data + '&' + data : data;
      } else {
        this._data = (this._data || '') + data;
      }
    } else {
      this._data = data;
    }

    if (!isObj || this._isHost(data)) {
      return this;
    }

    // default to json
    if (!type) this.type('json');
    return this;
  };

  /**
   * Sort `querystring` by the sort function
   *
   *
   * Examples:
   *
   *       // default order
   *       request.get('/user')
   *         .query('name=Nick')
   *         .query('search=Manny')
   *         .sortQuery()
   *         .end(callback)
   *
   *       // customized sort function
   *       request.get('/user')
   *         .query('name=Nick')
   *         .query('search=Manny')
   *         .sortQuery(function(a, b){
   *           return a.length - b.length;
   *         })
   *         .end(callback)
   *
   *
   * @param {Function} sort
   * @return {Request} for chaining
   * @api public
   */

  RequestBase.prototype.sortQuery = function (sort) {
    // _sort default to true but otherwise can be a function or boolean
    this._sort = typeof sort === 'undefined' ? true : sort;
    return this;
  };

  /**
   * Invoke callback with timeout error.
   *
   * @api private
   */

  RequestBase.prototype._timeoutError = function (reason, timeout, errno) {
    if (this._aborted) {
      return;
    }
    var err = new Error(reason + timeout + 'ms exceeded');
    err.timeout = timeout;
    err.code = 'ECONNABORTED';
    err.errno = errno;
    this.timedout = true;
    this.abort();
    this.callback(err);
  };

  RequestBase.prototype._setTimeouts = function () {
    var self = this;

    // deadline
    if (this._timeout && !this._timer) {
      this._timer = setTimeout(function () {
        self._timeoutError('Timeout of ', self._timeout, 'ETIME');
      }, this._timeout);
    }
    // response timeout
    if (this._responseTimeout && !this._responseTimeoutTimer) {
      this._responseTimeoutTimer = setTimeout(function () {
        self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
      }, this._responseTimeout);
    }
  };
});
System.registerDynamic('npm:superagent@3.5.2/lib/is-object.js', [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /**
   * Check if `obj` is an object.
   *
   * @param {Object} obj
   * @return {Boolean}
   * @api private
   */

  function isObject(obj) {
    return null !== obj && 'object' === typeof obj;
  }

  module.exports = isObject;
});
System.registerDynamic('npm:superagent@3.5.2/lib/is-function.js', ['./is-object'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /**
   * Check if `fn` is a function.
   *
   * @param {Function} fn
   * @return {Boolean}
   * @api private
   */
  var isObject = $__require('./is-object');

  function isFunction(fn) {
    var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
    return tag === '[object Function]';
  }

  module.exports = isFunction;
});
System.registerDynamic('npm:superagent@3.5.2/lib/utils.js', [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;

  /**
   * Return the mime type for the given `str`.
   *
   * @param {String} str
   * @return {String}
   * @api private
   */

  exports.type = function (str) {
    return str.split(/ *; */).shift();
  };

  /**
   * Return header field parameters.
   *
   * @param {String} str
   * @return {Object}
   * @api private
   */

  exports.params = function (str) {
    return str.split(/ *; */).reduce(function (obj, str) {
      var parts = str.split(/ *= */);
      var key = parts.shift();
      var val = parts.shift();

      if (key && val) obj[key] = val;
      return obj;
    }, {});
  };

  /**
   * Parse Link header fields.
   *
   * @param {String} str
   * @return {Object}
   * @api private
   */

  exports.parseLinks = function (str) {
    return str.split(/ *, */).reduce(function (obj, str) {
      var parts = str.split(/ *; */);
      var url = parts[0].slice(1, -1);
      var rel = parts[1].split(/ *= */)[1].slice(1, -1);
      obj[rel] = url;
      return obj;
    }, {});
  };

  /**
   * Strip content related fields from `header`.
   *
   * @param {Object} header
   * @return {Object} header
   * @api private
   */

  exports.cleanHeader = function (header, shouldStripCookie) {
    delete header['content-type'];
    delete header['content-length'];
    delete header['transfer-encoding'];
    delete header['host'];
    if (shouldStripCookie) {
      delete header['cookie'];
    }
    return header;
  };
});
System.registerDynamic('npm:superagent@3.5.2/lib/response-base.js', ['./utils'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;

  /**
   * Module dependencies.
   */

  var utils = $__require('./utils');

  /**
   * Expose `ResponseBase`.
   */

  module.exports = ResponseBase;

  /**
   * Initialize a new `ResponseBase`.
   *
   * @api public
   */

  function ResponseBase(obj) {
    if (obj) return mixin(obj);
  }

  /**
   * Mixin the prototype properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */

  function mixin(obj) {
    for (var key in ResponseBase.prototype) {
      obj[key] = ResponseBase.prototype[key];
    }
    return obj;
  }

  /**
   * Get case-insensitive `field` value.
   *
   * @param {String} field
   * @return {String}
   * @api public
   */

  ResponseBase.prototype.get = function (field) {
    return this.header[field.toLowerCase()];
  };

  /**
   * Set header related properties:
   *
   *   - `.type` the content type without params
   *
   * A response of "Content-Type: text/plain; charset=utf-8"
   * will provide you with a `.type` of "text/plain".
   *
   * @param {Object} header
   * @api private
   */

  ResponseBase.prototype._setHeaderProperties = function (header) {
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
      if (header.link) {
        this.links = utils.parseLinks(header.link);
      }
    } catch (err) {
      // ignore
    }
  };

  /**
   * Set flags such as `.ok` based on `status`.
   *
   * For example a 2xx response will give you a `.ok` of __true__
   * whereas 5xx will be __false__ and `.error` will be __true__. The
   * `.clientError` and `.serverError` are also available to be more
   * specific, and `.statusType` is the class of error ranging from 1..5
   * sometimes useful for mapping respond colors etc.
   *
   * "sugar" properties are also defined for common cases. Currently providing:
   *
   *   - .noContent
   *   - .badRequest
   *   - .unauthorized
   *   - .notAcceptable
   *   - .notFound
   *
   * @param {Number} status
   * @api private
   */

  ResponseBase.prototype._setStatusProperties = function (status) {
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = 4 == type || 5 == type ? this.toError() : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
  };
});
System.registerDynamic('npm:superagent@3.5.2/lib/should-retry.js', [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  var ERROR_CODES = ['ECONNRESET', 'ETIMEDOUT', 'EADDRINFO', 'ESOCKETTIMEDOUT'];

  /**
   * Determine if a request should be retried.
   * (Borrowed from segmentio/superagent-retry)
   *
   * @param {Error} err
   * @param {Response} [res]
   * @returns {Boolean}
   */
  module.exports = function shouldRetry(err, res) {
    if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
    if (res && res.status && res.status >= 500) return true;
    // Superagent timeout
    if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
    if (err && 'crossDomain' in err) return true;
    return false;
  };
});
System.registerDynamic("npm:superagent@3.5.2.json", [], true, function() {
  return {
    "main": "lib/node/index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      },
      "lib/node/index.js": {
        "globals": {
          "Buffer": "buffer/global"
        }
      },
      "lib/node/parsers/image.js": {
        "globals": {
          "Buffer": "buffer/global"
        }
      },
      "superagent.js": {
        "cjsRequireDetection": false
      }
    },
    "map": {
      "./lib/node": "./lib/node/index.js",
      "./lib/node/index.js": {
        "browser": "./lib/client.js"
      },
      "./lib/node/parsers": "./lib/node/parsers/index.js"
    }
  };
});

System.registerDynamic('npm:superagent@3.5.2/lib/client.js', ['component-emitter', './request-base', './is-object', './is-function', './response-base', './should-retry'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /**
   * Root reference for iframes.
   */

  var root;
  if (typeof window !== 'undefined') {
    // Browser window
    root = window;
  } else if (typeof self !== 'undefined') {
    // Web Worker
    root = self;
  } else {
    // Other environments
    console.warn("Using browser-only version of superagent in non-browser environment");
    root = this;
  }

  var Emitter = $__require('component-emitter');
  var RequestBase = $__require('./request-base');
  var isObject = $__require('./is-object');
  var isFunction = $__require('./is-function');
  var ResponseBase = $__require('./response-base');
  var shouldRetry = $__require('./should-retry');

  /**
   * Noop.
   */

  function noop() {};

  /**
   * Expose `request`.
   */

  var request = exports = module.exports = function (method, url) {
    // callback
    if ('function' == typeof url) {
      return new exports.Request('GET', method).end(url);
    }

    // url first
    if (1 == arguments.length) {
      return new exports.Request('GET', method);
    }

    return new exports.Request(method, url);
  };

  exports.Request = Request;

  /**
   * Determine XHR.
   */

  request.getXHR = function () {
    if (root.XMLHttpRequest && (!root.location || 'file:' != root.location.protocol || !root.ActiveXObject)) {
      return new XMLHttpRequest();
    } else {
      try {
        return new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {}
      try {
        return new ActiveXObject('Msxml2.XMLHTTP.6.0');
      } catch (e) {}
      try {
        return new ActiveXObject('Msxml2.XMLHTTP.3.0');
      } catch (e) {}
      try {
        return new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {}
    }
    throw Error("Browser-only verison of superagent could not find XHR");
  };

  /**
   * Removes leading and trailing whitespace, added to support IE.
   *
   * @param {String} s
   * @return {String}
   * @api private
   */

  var trim = ''.trim ? function (s) {
    return s.trim();
  } : function (s) {
    return s.replace(/(^\s*|\s*$)/g, '');
  };

  /**
   * Serialize the given `obj`.
   *
   * @param {Object} obj
   * @return {String}
   * @api private
   */

  function serialize(obj) {
    if (!isObject(obj)) return obj;
    var pairs = [];
    for (var key in obj) {
      pushEncodedKeyValuePair(pairs, key, obj[key]);
    }
    return pairs.join('&');
  }

  /**
   * Helps 'serialize' with serializing arrays.
   * Mutates the pairs array.
   *
   * @param {Array} pairs
   * @param {String} key
   * @param {Mixed} val
   */

  function pushEncodedKeyValuePair(pairs, key, val) {
    if (val != null) {
      if (Array.isArray(val)) {
        val.forEach(function (v) {
          pushEncodedKeyValuePair(pairs, key, v);
        });
      } else if (isObject(val)) {
        for (var subkey in val) {
          pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
        }
      } else {
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
      }
    } else if (val === null) {
      pairs.push(encodeURIComponent(key));
    }
  }

  /**
   * Expose serialization method.
   */

  request.serializeObject = serialize;

  /**
   * Parse the given x-www-form-urlencoded `str`.
   *
   * @param {String} str
   * @return {Object}
   * @api private
   */

  function parseString(str) {
    var obj = {};
    var pairs = str.split('&');
    var pair;
    var pos;

    for (var i = 0, len = pairs.length; i < len; ++i) {
      pair = pairs[i];
      pos = pair.indexOf('=');
      if (pos == -1) {
        obj[decodeURIComponent(pair)] = '';
      } else {
        obj[decodeURIComponent(pair.slice(0, pos))] = decodeURIComponent(pair.slice(pos + 1));
      }
    }

    return obj;
  }

  /**
   * Expose parser.
   */

  request.parseString = parseString;

  /**
   * Default MIME type map.
   *
   *     superagent.types.xml = 'application/xml';
   *
   */

  request.types = {
    html: 'text/html',
    json: 'application/json',
    xml: 'application/xml',
    urlencoded: 'application/x-www-form-urlencoded',
    'form': 'application/x-www-form-urlencoded',
    'form-data': 'application/x-www-form-urlencoded'
  };

  /**
   * Default serialization map.
   *
   *     superagent.serialize['application/xml'] = function(obj){
   *       return 'generated xml here';
   *     };
   *
   */

  request.serialize = {
    'application/x-www-form-urlencoded': serialize,
    'application/json': JSON.stringify
  };

  /**
   * Default parsers.
   *
   *     superagent.parse['application/xml'] = function(str){
   *       return { object parsed from str };
   *     };
   *
   */

  request.parse = {
    'application/x-www-form-urlencoded': parseString,
    'application/json': JSON.parse
  };

  /**
   * Parse the given header `str` into
   * an object containing the mapped fields.
   *
   * @param {String} str
   * @return {Object}
   * @api private
   */

  function parseHeader(str) {
    var lines = str.split(/\r?\n/);
    var fields = {};
    var index;
    var line;
    var field;
    var val;

    lines.pop(); // trailing CRLF

    for (var i = 0, len = lines.length; i < len; ++i) {
      line = lines[i];
      index = line.indexOf(':');
      field = line.slice(0, index).toLowerCase();
      val = trim(line.slice(index + 1));
      fields[field] = val;
    }

    return fields;
  }

  /**
   * Check if `mime` is json or has +json structured syntax suffix.
   *
   * @param {String} mime
   * @return {Boolean}
   * @api private
   */

  function isJSON(mime) {
    return (/[\/+]json\b/.test(mime)
    );
  }

  /**
   * Initialize a new `Response` with the given `xhr`.
   *
   *  - set flags (.ok, .error, etc)
   *  - parse header
   *
   * Examples:
   *
   *  Aliasing `superagent` as `request` is nice:
   *
   *      request = superagent;
   *
   *  We can use the promise-like API, or pass callbacks:
   *
   *      request.get('/').end(function(res){});
   *      request.get('/', function(res){});
   *
   *  Sending data can be chained:
   *
   *      request
   *        .post('/user')
   *        .send({ name: 'tj' })
   *        .end(function(res){});
   *
   *  Or passed to `.send()`:
   *
   *      request
   *        .post('/user')
   *        .send({ name: 'tj' }, function(res){});
   *
   *  Or passed to `.post()`:
   *
   *      request
   *        .post('/user', { name: 'tj' })
   *        .end(function(res){});
   *
   * Or further reduced to a single call for simple cases:
   *
   *      request
   *        .post('/user', { name: 'tj' }, function(res){});
   *
   * @param {XMLHTTPRequest} xhr
   * @param {Object} options
   * @api private
   */

  function Response(req) {
    this.req = req;
    this.xhr = this.req.xhr;
    // responseText is accessible only if responseType is '' or 'text' and on older browsers
    this.text = this.req.method != 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text') || typeof this.xhr.responseType === 'undefined' ? this.xhr.responseText : null;
    this.statusText = this.req.xhr.statusText;
    var status = this.xhr.status;
    // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
    if (status === 1223) {
      status = 204;
    }
    this._setStatusProperties(status);
    this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
    // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
    // getResponseHeader still works. so we get content-type even if getting
    // other headers fails.
    this.header['content-type'] = this.xhr.getResponseHeader('content-type');
    this._setHeaderProperties(this.header);

    if (null === this.text && req._responseType) {
      this.body = this.xhr.response;
    } else {
      this.body = this.req.method != 'HEAD' ? this._parseBody(this.text ? this.text : this.xhr.response) : null;
    }
  }

  ResponseBase(Response.prototype);

  /**
   * Parse the given body `str`.
   *
   * Used for auto-parsing of bodies. Parsers
   * are defined on the `superagent.parse` object.
   *
   * @param {String} str
   * @return {Mixed}
   * @api private
   */

  Response.prototype._parseBody = function (str) {
    var parse = request.parse[this.type];
    if (this.req._parser) {
      return this.req._parser(this, str);
    }
    if (!parse && isJSON(this.type)) {
      parse = request.parse['application/json'];
    }
    return parse && str && (str.length || str instanceof Object) ? parse(str) : null;
  };

  /**
   * Return an `Error` representative of this response.
   *
   * @return {Error}
   * @api public
   */

  Response.prototype.toError = function () {
    var req = this.req;
    var method = req.method;
    var url = req.url;

    var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
    var err = new Error(msg);
    err.status = this.status;
    err.method = method;
    err.url = url;

    return err;
  };

  /**
   * Expose `Response`.
   */

  request.Response = Response;

  /**
   * Initialize a new `Request` with the given `method` and `url`.
   *
   * @param {String} method
   * @param {String} url
   * @api public
   */

  function Request(method, url) {
    var self = this;
    this._query = this._query || [];
    this.method = method;
    this.url = url;
    this.header = {}; // preserves header name case
    this._header = {}; // coerces header names to lowercase
    this.on('end', function () {
      var err = null;
      var res = null;

      try {
        res = new Response(self);
      } catch (e) {
        err = new Error('Parser is unable to parse the response');
        err.parse = true;
        err.original = e;
        // issue #675: return the raw response if the response parsing fails
        if (self.xhr) {
          // ie9 doesn't have 'response' property
          err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
          // issue #876: return the http status code if the response parsing fails
          err.status = self.xhr.status ? self.xhr.status : null;
          err.statusCode = err.status; // backwards-compat only
        } else {
          err.rawResponse = null;
          err.status = null;
        }

        return self.callback(err);
      }

      self.emit('response', res);

      var new_err;
      try {
        if (!self._isResponseOK(res)) {
          new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
          new_err.original = err;
          new_err.response = res;
          new_err.status = res.status;
        }
      } catch (e) {
        new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
      }

      // #1000 don't catch errors from the callback to avoid double calling it
      if (new_err) {
        self.callback(new_err, res);
      } else {
        self.callback(null, res);
      }
    });
  }

  /**
   * Mixin `Emitter` and `RequestBase`.
   */

  Emitter(Request.prototype);
  RequestBase(Request.prototype);

  /**
   * Set Content-Type to `type`, mapping values from `request.types`.
   *
   * Examples:
   *
   *      superagent.types.xml = 'application/xml';
   *
   *      request.post('/')
   *        .type('xml')
   *        .send(xmlstring)
   *        .end(callback);
   *
   *      request.post('/')
   *        .type('application/xml')
   *        .send(xmlstring)
   *        .end(callback);
   *
   * @param {String} type
   * @return {Request} for chaining
   * @api public
   */

  Request.prototype.type = function (type) {
    this.set('Content-Type', request.types[type] || type);
    return this;
  };

  /**
   * Set Accept to `type`, mapping values from `request.types`.
   *
   * Examples:
   *
   *      superagent.types.json = 'application/json';
   *
   *      request.get('/agent')
   *        .accept('json')
   *        .end(callback);
   *
   *      request.get('/agent')
   *        .accept('application/json')
   *        .end(callback);
   *
   * @param {String} accept
   * @return {Request} for chaining
   * @api public
   */

  Request.prototype.accept = function (type) {
    this.set('Accept', request.types[type] || type);
    return this;
  };

  /**
   * Set Authorization field value with `user` and `pass`.
   *
   * @param {String} user
   * @param {String} [pass] optional in case of using 'bearer' as type
   * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
   * @return {Request} for chaining
   * @api public
   */

  Request.prototype.auth = function (user, pass, options) {
    if (typeof pass === 'object' && pass !== null) {
      // pass is optional and can substitute for options
      options = pass;
    }
    if (!options) {
      options = {
        type: 'function' === typeof btoa ? 'basic' : 'auto'
      };
    }

    switch (options.type) {
      case 'basic':
        this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
        break;

      case 'auto':
        this.username = user;
        this.password = pass;
        break;

      case 'bearer':
        // usage would be .auth(accessToken, { type: 'bearer' })
        this.set('Authorization', 'Bearer ' + user);
        break;
    }
    return this;
  };

  /**
   * Add query-string `val`.
   *
   * Examples:
   *
   *   request.get('/shoes')
   *     .query('size=10')
   *     .query({ color: 'blue' })
   *
   * @param {Object|String} val
   * @return {Request} for chaining
   * @api public
   */

  Request.prototype.query = function (val) {
    if ('string' != typeof val) val = serialize(val);
    if (val) this._query.push(val);
    return this;
  };

  /**
   * Queue the given `file` as an attachment to the specified `field`,
   * with optional `options` (or filename).
   *
   * ``` js
   * request.post('/upload')
   *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
   *   .end(callback);
   * ```
   *
   * @param {String} field
   * @param {Blob|File} file
   * @param {String|Object} options
   * @return {Request} for chaining
   * @api public
   */

  Request.prototype.attach = function (field, file, options) {
    if (file) {
      if (this._data) {
        throw Error("superagent can't mix .send() and .attach()");
      }

      this._getFormData().append(field, file, options || file.name);
    }
    return this;
  };

  Request.prototype._getFormData = function () {
    if (!this._formData) {
      this._formData = new root.FormData();
    }
    return this._formData;
  };

  /**
   * Invoke the callback with `err` and `res`
   * and handle arity check.
   *
   * @param {Error} err
   * @param {Response} res
   * @api private
   */

  Request.prototype.callback = function (err, res) {
    // console.log(this._retries, this._maxRetries)
    if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
      return this._retry();
    }

    var fn = this._callback;
    this.clearTimeout();

    if (err) {
      if (this._maxRetries) err.retries = this._retries - 1;
      this.emit('error', err);
    }

    fn(err, res);
  };

  /**
   * Invoke callback with x-domain error.
   *
   * @api private
   */

  Request.prototype.crossDomainError = function () {
    var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
    err.crossDomain = true;

    err.status = this.status;
    err.method = this.method;
    err.url = this.url;

    this.callback(err);
  };

  // This only warns, because the request is still likely to work
  Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function () {
    console.warn("This is not supported in browser version of superagent");
    return this;
  };

  // This throws, because it can't send/receive data as expected
  Request.prototype.pipe = Request.prototype.write = function () {
    throw Error("Streaming is not supported in browser version of superagent");
  };

  /**
   * Compose querystring to append to req.url
   *
   * @api private
   */

  Request.prototype._appendQueryString = function () {
    var query = this._query.join('&');
    if (query) {
      this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
    }

    if (this._sort) {
      var index = this.url.indexOf('?');
      if (index >= 0) {
        var queryArr = this.url.substring(index + 1).split('&');
        if (isFunction(this._sort)) {
          queryArr.sort(this._sort);
        } else {
          queryArr.sort();
        }
        this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
      }
    }
  };

  /**
   * Check if `obj` is a host object,
   * we don't want to serialize these :)
   *
   * @param {Object} obj
   * @return {Boolean}
   * @api private
   */
  Request.prototype._isHost = function _isHost(obj) {
    // Native objects stringify to [object File], [object Blob], [object FormData], etc.
    return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
  };

  /**
   * Initiate request, invoking callback `fn(res)`
   * with an instanceof `Response`.
   *
   * @param {Function} fn
   * @return {Request} for chaining
   * @api public
   */

  Request.prototype.end = function (fn) {
    if (this._endCalled) {
      console.warn("Warning: .end() was called twice. This is not supported in superagent");
    }
    this._endCalled = true;

    // store callback
    this._callback = fn || noop;

    // querystring
    this._appendQueryString();

    return this._end();
  };

  Request.prototype._end = function () {
    var self = this;
    var xhr = this.xhr = request.getXHR();
    var data = this._formData || this._data;

    this._setTimeouts();

    // state change
    xhr.onreadystatechange = function () {
      var readyState = xhr.readyState;
      if (readyState >= 2 && self._responseTimeoutTimer) {
        clearTimeout(self._responseTimeoutTimer);
      }
      if (4 != readyState) {
        return;
      }

      // In IE9, reads to any property (e.g. status) off of an aborted XHR will
      // result in the error "Could not complete the operation due to error c00c023f"
      var status;
      try {
        status = xhr.status;
      } catch (e) {
        status = 0;
      }

      if (!status) {
        if (self.timedout || self._aborted) return;
        return self.crossDomainError();
      }
      self.emit('end');
    };

    // progress
    var handleProgress = function (direction, e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100;
      }
      e.direction = direction;
      self.emit('progress', e);
    };
    if (this.hasListeners('progress')) {
      try {
        xhr.onprogress = handleProgress.bind(null, 'download');
        if (xhr.upload) {
          xhr.upload.onprogress = handleProgress.bind(null, 'upload');
        }
      } catch (e) {
        // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
        // Reported here:
        // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
      }
    }

    // initiate request
    try {
      if (this.username && this.password) {
        xhr.open(this.method, this.url, true, this.username, this.password);
      } else {
        xhr.open(this.method, this.url, true);
      }
    } catch (err) {
      // see #1149
      return this.callback(err);
    }

    // CORS
    if (this._withCredentials) xhr.withCredentials = true;

    // body
    if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
      // serialize stuff
      var contentType = this._header['content-type'];
      var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
      if (!serialize && isJSON(contentType)) {
        serialize = request.serialize['application/json'];
      }
      if (serialize) data = serialize(data);
    }

    // set header fields
    for (var field in this.header) {
      if (null == this.header[field]) continue;

      if (this.header.hasOwnProperty(field)) xhr.setRequestHeader(field, this.header[field]);
    }

    if (this._responseType) {
      xhr.responseType = this._responseType;
    }

    // send stuff
    this.emit('request', this);

    // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
    // We need null here if data is undefined
    xhr.send(typeof data !== 'undefined' ? data : null);
    return this;
  };

  /**
   * GET `url` with optional callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed|Function} [data] or fn
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */

  request.get = function (url, data, fn) {
    var req = request('GET', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.query(data);
    if (fn) req.end(fn);
    return req;
  };

  /**
   * HEAD `url` with optional callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed|Function} [data] or fn
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */

  request.head = function (url, data, fn) {
    var req = request('HEAD', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };

  /**
   * OPTIONS query to `url` with optional callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed|Function} [data] or fn
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */

  request.options = function (url, data, fn) {
    var req = request('OPTIONS', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };

  /**
   * DELETE `url` with optional `data` and callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed} [data]
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */

  function del(url, data, fn) {
    var req = request('DELETE', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };

  request['del'] = del;
  request['delete'] = del;

  /**
   * PATCH `url` with optional `data` and callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed} [data]
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */

  request.patch = function (url, data, fn) {
    var req = request('PATCH', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };

  /**
   * POST `url` with optional `data` and callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed} [data]
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */

  request.post = function (url, data, fn) {
    var req = request('POST', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };

  /**
   * PUT `url` with optional `data` and callback `fn(res)`.
   *
   * @param {String} url
   * @param {Mixed|Function} [data] or fn
   * @param {Function} [fn]
   * @return {Request}
   * @api public
   */

  request.put = function (url, data, fn) {
    var req = request('PUT', url);
    if ('function' == typeof data) fn = data, data = null;
    if (data) req.send(data);
    if (fn) req.end(fn);
    return req;
  };
});
System.registerDynamic("npm:@cycle/http@13.3.0/lib/http-driver.js", ["xstream", "@cycle/run/lib/adapt", "./MainHTTPSource", "superagent"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var xstream_1 = $__require("xstream");
    var adapt_1 = $__require("@cycle/run/lib/adapt");
    var MainHTTPSource_1 = $__require("./MainHTTPSource");
    var superagent = $__require("superagent");
    function preprocessReqOptions(reqOptions) {
        reqOptions.withCredentials = reqOptions.withCredentials || false;
        reqOptions.redirects = typeof reqOptions.redirects === 'number' ? reqOptions.redirects : 5;
        reqOptions.method = reqOptions.method || "get";
        return reqOptions;
    }
    function optionsToSuperagent(rawReqOptions) {
        var reqOptions = preprocessReqOptions(rawReqOptions);
        if (typeof reqOptions.url !== "string") {
            throw new Error("Please provide a `url` property in the request options.");
        }
        var lowerCaseMethod = (reqOptions.method || 'GET').toLowerCase();
        var sanitizedMethod = lowerCaseMethod === "delete" ? "del" : lowerCaseMethod;
        var request = superagent[sanitizedMethod](reqOptions.url);
        if (typeof request.redirects === "function") {
            request = request.redirects(reqOptions.redirects);
        }
        if (reqOptions.type) {
            request = request.type(reqOptions.type);
        }
        if (reqOptions.send) {
            request = request.send(reqOptions.send);
        }
        if (reqOptions.accept) {
            request = request.accept(reqOptions.accept);
        }
        if (reqOptions.query) {
            request = request.query(reqOptions.query);
        }
        if (reqOptions.withCredentials) {
            request = request.withCredentials();
        }
        if (reqOptions.agent) {
            request = request.key(reqOptions.agent.key);
            request = request.cert(reqOptions.agent.cert);
        }
        if (typeof reqOptions.user === 'string' && typeof reqOptions.password === 'string') {
            request = request.auth(reqOptions.user, reqOptions.password);
        }
        if (reqOptions.headers) {
            for (var key in reqOptions.headers) {
                if (reqOptions.headers.hasOwnProperty(key)) {
                    request = request.set(key, reqOptions.headers[key]);
                }
            }
        }
        if (reqOptions.field) {
            for (var key in reqOptions.field) {
                if (reqOptions.field.hasOwnProperty(key)) {
                    request = request.field(key, reqOptions.field[key]);
                }
            }
        }
        if (reqOptions.attach) {
            for (var i = reqOptions.attach.length - 1; i >= 0; i--) {
                var a = reqOptions.attach[i];
                request = request.attach(a.name, a.path, a.filename);
            }
        }
        if (reqOptions.responseType) {
            request = request.responseType(reqOptions.responseType);
        }
        return request;
    }
    exports.optionsToSuperagent = optionsToSuperagent;
    function createResponse$(reqInput) {
        return xstream_1.default.create({
            start: function startResponseStream(listener) {
                try {
                    var reqOptions_1 = normalizeRequestInput(reqInput);
                    this.request = optionsToSuperagent(reqOptions_1);
                    if (reqOptions_1.progress) {
                        this.request = this.request.on('progress', function (res) {
                            res.request = reqOptions_1;
                            listener.next(res);
                        });
                    }
                    this.request.end(function (err, res) {
                        if (err) {
                            if (err.response) {
                                err.response.request = reqOptions_1;
                            }
                            listener.error(err);
                        } else {
                            res.request = reqOptions_1;
                            listener.next(res);
                            listener.complete();
                        }
                    });
                } catch (err) {
                    listener.error(err);
                }
            },
            stop: function stopResponseStream() {
                if (this.request && this.request.abort) {
                    this.request.abort();
                }
            }
        });
    }
    exports.createResponse$ = createResponse$;
    function softNormalizeRequestInput(reqInput) {
        var reqOptions;
        try {
            reqOptions = normalizeRequestInput(reqInput);
        } catch (err) {
            reqOptions = { url: 'Error', _error: err };
        }
        return reqOptions;
    }
    function normalizeRequestInput(reqInput) {
        if (typeof reqInput === 'string') {
            return { url: reqInput };
        } else if (typeof reqInput === 'object') {
            return reqInput;
        } else {
            throw new Error("Observable of requests given to HTTP Driver must emit " + "either URL strings or objects with parameters.");
        }
    }
    function requestInputToResponse$(reqInput) {
        var response$ = createResponse$(reqInput).remember();
        var reqOptions = softNormalizeRequestInput(reqInput);
        if (!reqOptions.lazy) {
            response$.addListener({ next: function () {}, error: function () {}, complete: function () {} });
        }
        response$ = adapt_1.adapt(response$);
        Object.defineProperty(response$, 'request', {
            value: reqOptions,
            writable: false
        });
        return response$;
    }
    ;
    function makeHTTPDriver() {
        function httpDriver(request$, name) {
            var response$$ = request$.map(requestInputToResponse$);
            var httpSource = new MainHTTPSource_1.MainHTTPSource(response$$, name, []);
            response$$.addListener({ next: function () {}, error: function () {}, complete: function () {} });
            return httpSource;
        }
        return httpDriver;
    }
    exports.makeHTTPDriver = makeHTTPDriver;
    
});
System.registerDynamic("npm:@cycle/http@13.3.0.json", [], true, function() {
  return {
    "main": "lib/index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      },
      "dist/cycle-http-driver.js": {
        "cjsRequireDetection": false
      },
      "lib/index.d.ts": {
        "format": "esm"
      },
      "src/index.ts": {
        "format": "esm"
      },
      "test/support/run-server.ts": {
        "format": "esm"
      }
    },
    "map": {
      "./lib": "./lib/index.js",
      "./test/browser/lib": "./test/browser/lib/index.js"
    }
  };
});

System.registerDynamic("npm:@cycle/http@13.3.0/lib/index.js", ["./http-driver"], true, function ($__require, exports, module) {
  "use strict";

  var global = this || self,
      GLOBAL = global;
  Object.defineProperty(exports, "__esModule", { value: true });
  /**
   * HTTP Driver factory.
   *
   * This is a function which, when called, returns a HTTP Driver for Cycle.js
   * apps. The driver is also a function, and it takes a stream of requests as
   * input, and outputs an HTTP Source, an object with some functions to query for
   * response streams.
   *
   * **Requests**. The stream of requests should emit either strings or objects.
   * If the stream emits strings, those should be the URL of the remote resource
   * over HTTP. If the stream emits objects, these should be instructions how
   * superagent should execute the request. These objects follow a structure
   * similar to superagent's request API itself. `request` object properties:
   *
   * - `url` *(String)*: the remote resource path. **required**
   * - `method` *(String)*: HTTP Method for the request (GET, POST, PUT, etc).
   * - `category` *(String)*: an optional and arbitrary key that may be used in
   * the HTTP Source when querying for the response. E.g.
   * `sources.http.select(category)`
   * - `query` *(Object)*: an object with the payload for `GET` or `POST`.
   * - `send` *(Object)*: an object with the payload for `POST`.
   * - `headers` *(Object)*: object specifying HTTP headers.
   * - `accept` *(String)*: the Accept header.
   * - `type` *(String)*: a short-hand for setting Content-Type.
   * - `user` *(String)*: username for authentication.
   * - `password` *(String)*: password for authentication.
   * - `field` *(Object)*: object where key/values are Form fields.
   * - `progress` *(Boolean)*: whether or not to detect and emit progress events
   * on the response Observable.
   * - `attach` *(Array)*: array of objects, where each object specifies `name`,
   * `path`, and `filename` of a resource to upload.
   * - `withCredentials` *(Boolean)*: enables the ability to send cookies from the
   * origin.
   * - `agent` *(Object)*: an object specifying `cert` and `key` for SSL
   * certificate authentication.
   * - `redirects` *(Number)*: number of redirects to follow.
   * - `lazy` *(Boolean)*: whether or not this request runs lazily, which means
   * the request happens if and only if its corresponding response stream from the
   * HTTP Source is subscribed to. By default this value is false: requests run
   * eagerly, even if their response is ignored by the application.
   * - `responseType` *(String)*: setting for XHR responseType.
   *
   * **Responses**. A metastream is a stream that emits streams. The HTTP Source
   * manages response metastreams. These streams of responses have a `request`
   * field attached to them (to the stream object itself) indicating which request
   * (from the driver input) generated this response streams. The HTTP Source has
   * functions `filter()` and `select()`, but is not itself a stream. So you can
   * call `sources.HTTP.filter(request => request.url === X)` to get a new HTTP
   * Source object which is filtered for response streams that match the condition
   * given, and may call `sources.HTTP.select(category)` to get a metastream of
   * response that match the category key. With an HTTP Source, you can also call
   * `httpSource.select()` with no param to get the metastream. You should flatten
   * the metastream before consuming it, then the resulting response stream will
   * emit the response object received through superagent.
   *
   * @return {Function} the HTTP Driver function
   * @function makeHTTPDriver
   */
  var http_driver_1 = $__require("./http-driver");
  exports.makeHTTPDriver = http_driver_1.makeHTTPDriver;
  
});
System.registerDynamic("npm:@cycle/isolate@3.1.0.json", [], true, function() {
  return {
    "main": "lib/index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      },
      "dist/cycle-isolate.js": {
        "cjsRequireDetection": false
      },
      "lib/es6/index.js": {
        "format": "esm"
      }
    },
    "map": {
      "./lib": "./lib/index.js"
    }
  };
});

System.registerDynamic("npm:@cycle/isolate@3.1.0/lib/index.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    function checkIsolateArgs(dataflowComponent, scope) {
        if (typeof dataflowComponent !== "function") {
            throw new Error("First argument given to isolate() must be a " + "'dataflowComponent' function");
        }
        if (scope === null) {
            throw new Error("Second argument given to isolate() must not be null");
        }
    }
    function normalizeScopes(sources, scopes, randomScope) {
        var perChannel = {};
        Object.keys(sources).forEach(function (channel) {
            if (typeof scopes === 'string') {
                perChannel[channel] = scopes;
                return;
            }
            var candidate = scopes[channel];
            if (typeof candidate !== 'undefined') {
                perChannel[channel] = candidate;
                return;
            }
            var wildcard = scopes['*'];
            if (typeof wildcard !== 'undefined') {
                perChannel[channel] = wildcard;
                return;
            }
            perChannel[channel] = randomScope;
        });
        return perChannel;
    }
    function isolateAllSources(outerSources, scopes) {
        var innerSources = {};
        for (var channel in outerSources) {
            var outerSource = outerSources[channel];
            if (outerSources.hasOwnProperty(channel) && outerSource && scopes[channel] !== null && typeof outerSource.isolateSource === 'function') {
                innerSources[channel] = outerSource.isolateSource(outerSource, scopes[channel]);
            } else if (outerSources.hasOwnProperty(channel)) {
                innerSources[channel] = outerSources[channel];
            }
        }
        return innerSources;
    }
    function isolateAllSinks(sources, innerSinks, scopes) {
        var outerSinks = {};
        for (var channel in innerSinks) {
            var source = sources[channel];
            var innerSink = innerSinks[channel];
            if (innerSinks.hasOwnProperty(channel) && source && scopes[channel] !== null && typeof source.isolateSink === 'function') {
                outerSinks[channel] = source.isolateSink(innerSink, scopes[channel]);
            } else if (innerSinks.hasOwnProperty(channel)) {
                outerSinks[channel] = innerSinks[channel];
            }
        }
        return outerSinks;
    }
    var counter = 0;
    function newScope() {
        return "cycle" + ++counter;
    }
    /**
     * Takes a `component` function and a `scope`, and returns an isolated version
     * of the `component` function.
     *
     * When the isolated component is invoked, each source provided to it is
     * isolated to the given `scope` using `source.isolateSource(source, scope)`,
     * if possible. Likewise, the sinks returned from the isolated component are
     * isolated to the given `scope` using `source.isolateSink(sink, scope)`.
     *
     * The `scope` can be a string or an object. If it is anything else than those
     * two types, it will be converted to a string. If `scope` is an object, it
     * represents "scopes per channel", allowing you to specify a different scope
     * for each key of sources/sinks. For instance
     *
     * ```js
     * const childSinks = isolate(Child, {DOM: 'foo', HTTP: 'bar'})(sources);
     * ```
     *
     * You can also use a wildcard `'*'` to use as a default for source/sinks
     * channels that did not receive a specific scope:
     *
     * ```js
     * // Uses 'bar' as the isolation scope for HTTP and other channels
     * const childSinks = isolate(Child, {DOM: 'foo', '*': 'bar'})(sources);
     * ```
     *
     * If a channel's value is null, then that channel's sources and sinks won't be
     * isolated. If the wildcard is null and some channels are unspecified, those
     * channels won't be isolated. If you don't have a wildcard and some channels
     * are unspecified, then `isolate` will generate a random scope.
     *
     * ```js
     * // Does not isolate HTTP requests
     * const childSinks = isolate(Child, {DOM: 'foo', HTTP: null})(sources);
     * ```
     *
     * If the `scope` argument is not provided at all, a new scope will be
     * automatically created. This means that while **`isolate(component, scope)` is
     * pure** (referentially transparent), **`isolate(component)` is impure** (not
     * referentially transparent). Two calls to `isolate(Foo, bar)` will generate
     * the same component. But, two calls to `isolate(Foo)` will generate two
     * distinct components.
     *
     * ```js
     * // Uses some arbitrary string as the isolation scope for HTTP and other channels
     * const childSinks = isolate(Child, {DOM: 'foo'})(sources);
     * ```
     *
     * Note that both `isolateSource()` and `isolateSink()` are static members of
     * `source`. The reason for this is that drivers produce `source` while the
     * application produces `sink`, and it's the driver's responsibility to
     * implement `isolateSource()` and `isolateSink()`.
     *
     * @param {Function} component a function that takes `sources` as input
     * and outputs a collection of `sinks`.
     * @param {String} scope an optional string that is used to isolate each
     * `sources` and `sinks` when the returned scoped component is invoked.
     * @return {Function} the scoped component function that, as the original
     * `component` function, takes `sources` and returns `sinks`.
     * @function isolate
     */
    function isolate(component, scope) {
        if (scope === void 0) {
            scope = newScope();
        }
        checkIsolateArgs(component, scope);
        var randomScope = typeof scope === 'object' ? newScope() : '';
        var scopes = typeof scope === 'string' || typeof scope === 'object' ? scope : scope.toString();
        return function wrappedComponent(outerSources) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            var scopesPerChannel = normalizeScopes(outerSources, scopes, randomScope);
            var innerSources = isolateAllSources(outerSources, scopesPerChannel);
            var innerSinks = component.apply(void 0, [innerSources].concat(rest));
            var outerSinks = isolateAllSinks(outerSources, innerSinks, scopesPerChannel);
            return outerSinks;
        };
    }
    isolate.reset = function () {
        return counter = 0;
    };
    exports.default = isolate;
    
});
System.registerDynamic('npm:symbol-observable@1.0.4/lib/ponyfill.js', [], true, function ($__require, exports, module) {
	'use strict';

	var global = this || self,
	    GLOBAL = global;
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports['default'] = symbolObservablePonyfill;
	function symbolObservablePonyfill(root) {
		var result;
		var _Symbol = root.Symbol;

		if (typeof _Symbol === 'function') {
			if (_Symbol.observable) {
				result = _Symbol.observable;
			} else {
				result = _Symbol('observable');
				_Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	};
});
System.registerDynamic('npm:symbol-observable@1.0.4/lib/index.js', ['./ponyfill'], true, function ($__require, exports, module) {
  'use strict';

  var global = this || self,
      GLOBAL = global;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _ponyfill = $__require('./ponyfill');

  var _ponyfill2 = _interopRequireDefault(_ponyfill);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
  }

  var root; /* global window */

  if (typeof self !== 'undefined') {
    root = self;
  } else if (typeof window !== 'undefined') {
    root = window;
  } else if (typeof global !== 'undefined') {
    root = global;
  } else if (typeof module !== 'undefined') {
    root = module;
  } else {
    root = Function('return this')();
  }

  var result = (0, _ponyfill2['default'])(root);
  exports['default'] = result;
});
System.registerDynamic("npm:symbol-observable@1.0.4.json", [], true, function() {
  return {
    "main": "index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      },
      "es/*": {
        "format": "esm"
      }
    },
    "map": {
      "./lib": "./lib/index.js"
    }
  };
});

System.registerDynamic('npm:symbol-observable@1.0.4/index.js', ['./lib/index'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports = $__require('./lib/index');
});
System.registerDynamic("npm:xstream@10.9.0.json", [], true, function() {
  return {
    "main": "index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      },
      "dist/xstream.js": {
        "cjsRequireDetection": false
      }
    }
  };
});

System.registerDynamic("npm:xstream@10.9.0/index.js", ["symbol-observable"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    var __extends = exports && exports.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var symbol_observable_1 = $__require("symbol-observable");
    var NO = {};
    exports.NO = NO;
    function noop() {}
    function cp(a) {
        var l = a.length;
        var b = Array(l);
        for (var i = 0; i < l; ++i) b[i] = a[i];
        return b;
    }
    function and(f1, f2) {
        return function andFn(t) {
            return f1(t) && f2(t);
        };
    }
    function _try(c, t, u) {
        try {
            return c.f(t);
        } catch (e) {
            u._e(e);
            return NO;
        }
    }
    var NO_IL = {
        _n: noop,
        _e: noop,
        _c: noop
    };
    exports.NO_IL = NO_IL;
    // mutates the input
    function internalizeProducer(producer) {
        producer._start = function _start(il) {
            il.next = il._n;
            il.error = il._e;
            il.complete = il._c;
            this.start(il);
        };
        producer._stop = producer.stop;
    }
    var StreamSub = function () {
        function StreamSub(_stream, _listener) {
            this._stream = _stream;
            this._listener = _listener;
        }
        StreamSub.prototype.unsubscribe = function () {
            this._stream.removeListener(this._listener);
        };
        return StreamSub;
    }();
    var Observer = function () {
        function Observer(_listener) {
            this._listener = _listener;
        }
        Observer.prototype.next = function (value) {
            this._listener._n(value);
        };
        Observer.prototype.error = function (err) {
            this._listener._e(err);
        };
        Observer.prototype.complete = function () {
            this._listener._c();
        };
        return Observer;
    }();
    var FromObservable = function () {
        function FromObservable(observable) {
            this.type = 'fromObservable';
            this.ins = observable;
            this.active = false;
        }
        FromObservable.prototype._start = function (out) {
            this.out = out;
            this.active = true;
            this._sub = this.ins.subscribe(new Observer(out));
            if (!this.active) this._sub.unsubscribe();
        };
        FromObservable.prototype._stop = function () {
            if (this._sub) this._sub.unsubscribe();
            this.active = false;
        };
        return FromObservable;
    }();
    var Merge = function () {
        function Merge(insArr) {
            this.type = 'merge';
            this.insArr = insArr;
            this.out = NO;
            this.ac = 0;
        }
        Merge.prototype._start = function (out) {
            this.out = out;
            var s = this.insArr;
            var L = s.length;
            this.ac = L;
            for (var i = 0; i < L; i++) s[i]._add(this);
        };
        Merge.prototype._stop = function () {
            var s = this.insArr;
            var L = s.length;
            for (var i = 0; i < L; i++) s[i]._remove(this);
            this.out = NO;
        };
        Merge.prototype._n = function (t) {
            var u = this.out;
            if (u === NO) return;
            u._n(t);
        };
        Merge.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            u._e(err);
        };
        Merge.prototype._c = function () {
            if (--this.ac <= 0) {
                var u = this.out;
                if (u === NO) return;
                u._c();
            }
        };
        return Merge;
    }();
    var CombineListener = function () {
        function CombineListener(i, out, p) {
            this.i = i;
            this.out = out;
            this.p = p;
            p.ils.push(this);
        }
        CombineListener.prototype._n = function (t) {
            var p = this.p,
                out = this.out;
            if (out === NO) return;
            if (p.up(t, this.i)) {
                var a = p.vals;
                var l = a.length;
                var b = Array(l);
                for (var i = 0; i < l; ++i) b[i] = a[i];
                out._n(b);
            }
        };
        CombineListener.prototype._e = function (err) {
            var out = this.out;
            if (out === NO) return;
            out._e(err);
        };
        CombineListener.prototype._c = function () {
            var p = this.p;
            if (p.out === NO) return;
            if (--p.Nc === 0) p.out._c();
        };
        return CombineListener;
    }();
    var Combine = function () {
        function Combine(insArr) {
            this.type = 'combine';
            this.insArr = insArr;
            this.out = NO;
            this.ils = [];
            this.Nc = this.Nn = 0;
            this.vals = [];
        }
        Combine.prototype.up = function (t, i) {
            var v = this.vals[i];
            var Nn = !this.Nn ? 0 : v === NO ? --this.Nn : this.Nn;
            this.vals[i] = t;
            return Nn === 0;
        };
        Combine.prototype._start = function (out) {
            this.out = out;
            var s = this.insArr;
            var n = this.Nc = this.Nn = s.length;
            var vals = this.vals = new Array(n);
            if (n === 0) {
                out._n([]);
                out._c();
            } else {
                for (var i = 0; i < n; i++) {
                    vals[i] = NO;
                    s[i]._add(new CombineListener(i, out, this));
                }
            }
        };
        Combine.prototype._stop = function () {
            var s = this.insArr;
            var n = s.length;
            var ils = this.ils;
            for (var i = 0; i < n; i++) s[i]._remove(ils[i]);
            this.out = NO;
            this.ils = [];
            this.vals = [];
        };
        return Combine;
    }();
    var FromArray = function () {
        function FromArray(a) {
            this.type = 'fromArray';
            this.a = a;
        }
        FromArray.prototype._start = function (out) {
            var a = this.a;
            for (var i = 0, n = a.length; i < n; i++) out._n(a[i]);
            out._c();
        };
        FromArray.prototype._stop = function () {};
        return FromArray;
    }();
    var FromPromise = function () {
        function FromPromise(p) {
            this.type = 'fromPromise';
            this.on = false;
            this.p = p;
        }
        FromPromise.prototype._start = function (out) {
            var prod = this;
            this.on = true;
            this.p.then(function (v) {
                if (prod.on) {
                    out._n(v);
                    out._c();
                }
            }, function (e) {
                out._e(e);
            }).then(noop, function (err) {
                setTimeout(function () {
                    throw err;
                });
            });
        };
        FromPromise.prototype._stop = function () {
            this.on = false;
        };
        return FromPromise;
    }();
    var Periodic = function () {
        function Periodic(period) {
            this.type = 'periodic';
            this.period = period;
            this.intervalID = -1;
            this.i = 0;
        }
        Periodic.prototype._start = function (out) {
            var self = this;
            function intervalHandler() {
                out._n(self.i++);
            }
            this.intervalID = setInterval(intervalHandler, this.period);
        };
        Periodic.prototype._stop = function () {
            if (this.intervalID !== -1) clearInterval(this.intervalID);
            this.intervalID = -1;
            this.i = 0;
        };
        return Periodic;
    }();
    var Debug = function () {
        function Debug(ins, arg) {
            this.type = 'debug';
            this.ins = ins;
            this.out = NO;
            this.s = noop;
            this.l = '';
            if (typeof arg === 'string') this.l = arg;else if (typeof arg === 'function') this.s = arg;
        }
        Debug.prototype._start = function (out) {
            this.out = out;
            this.ins._add(this);
        };
        Debug.prototype._stop = function () {
            this.ins._remove(this);
            this.out = NO;
        };
        Debug.prototype._n = function (t) {
            var u = this.out;
            if (u === NO) return;
            var s = this.s,
                l = this.l;
            if (s !== noop) {
                try {
                    s(t);
                } catch (e) {
                    u._e(e);
                }
            } else if (l) console.log(l + ':', t);else console.log(t);
            u._n(t);
        };
        Debug.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            u._e(err);
        };
        Debug.prototype._c = function () {
            var u = this.out;
            if (u === NO) return;
            u._c();
        };
        return Debug;
    }();
    var Drop = function () {
        function Drop(max, ins) {
            this.type = 'drop';
            this.ins = ins;
            this.out = NO;
            this.max = max;
            this.dropped = 0;
        }
        Drop.prototype._start = function (out) {
            this.out = out;
            this.dropped = 0;
            this.ins._add(this);
        };
        Drop.prototype._stop = function () {
            this.ins._remove(this);
            this.out = NO;
        };
        Drop.prototype._n = function (t) {
            var u = this.out;
            if (u === NO) return;
            if (this.dropped++ >= this.max) u._n(t);
        };
        Drop.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            u._e(err);
        };
        Drop.prototype._c = function () {
            var u = this.out;
            if (u === NO) return;
            u._c();
        };
        return Drop;
    }();
    var EndWhenListener = function () {
        function EndWhenListener(out, op) {
            this.out = out;
            this.op = op;
        }
        EndWhenListener.prototype._n = function () {
            this.op.end();
        };
        EndWhenListener.prototype._e = function (err) {
            this.out._e(err);
        };
        EndWhenListener.prototype._c = function () {
            this.op.end();
        };
        return EndWhenListener;
    }();
    var EndWhen = function () {
        function EndWhen(o, ins) {
            this.type = 'endWhen';
            this.ins = ins;
            this.out = NO;
            this.o = o;
            this.oil = NO_IL;
        }
        EndWhen.prototype._start = function (out) {
            this.out = out;
            this.o._add(this.oil = new EndWhenListener(out, this));
            this.ins._add(this);
        };
        EndWhen.prototype._stop = function () {
            this.ins._remove(this);
            this.o._remove(this.oil);
            this.out = NO;
            this.oil = NO_IL;
        };
        EndWhen.prototype.end = function () {
            var u = this.out;
            if (u === NO) return;
            u._c();
        };
        EndWhen.prototype._n = function (t) {
            var u = this.out;
            if (u === NO) return;
            u._n(t);
        };
        EndWhen.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            u._e(err);
        };
        EndWhen.prototype._c = function () {
            this.end();
        };
        return EndWhen;
    }();
    var Filter = function () {
        function Filter(passes, ins) {
            this.type = 'filter';
            this.ins = ins;
            this.out = NO;
            this.f = passes;
        }
        Filter.prototype._start = function (out) {
            this.out = out;
            this.ins._add(this);
        };
        Filter.prototype._stop = function () {
            this.ins._remove(this);
            this.out = NO;
        };
        Filter.prototype._n = function (t) {
            var u = this.out;
            if (u === NO) return;
            var r = _try(this, t, u);
            if (r === NO || !r) return;
            u._n(t);
        };
        Filter.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            u._e(err);
        };
        Filter.prototype._c = function () {
            var u = this.out;
            if (u === NO) return;
            u._c();
        };
        return Filter;
    }();
    var FlattenListener = function () {
        function FlattenListener(out, op) {
            this.out = out;
            this.op = op;
        }
        FlattenListener.prototype._n = function (t) {
            this.out._n(t);
        };
        FlattenListener.prototype._e = function (err) {
            this.out._e(err);
        };
        FlattenListener.prototype._c = function () {
            this.op.inner = NO;
            this.op.less();
        };
        return FlattenListener;
    }();
    var Flatten = function () {
        function Flatten(ins) {
            this.type = 'flatten';
            this.ins = ins;
            this.out = NO;
            this.open = true;
            this.inner = NO;
            this.il = NO_IL;
        }
        Flatten.prototype._start = function (out) {
            this.out = out;
            this.open = true;
            this.inner = NO;
            this.il = NO_IL;
            this.ins._add(this);
        };
        Flatten.prototype._stop = function () {
            this.ins._remove(this);
            if (this.inner !== NO) this.inner._remove(this.il);
            this.out = NO;
            this.open = true;
            this.inner = NO;
            this.il = NO_IL;
        };
        Flatten.prototype.less = function () {
            var u = this.out;
            if (u === NO) return;
            if (!this.open && this.inner === NO) u._c();
        };
        Flatten.prototype._n = function (s) {
            var u = this.out;
            if (u === NO) return;
            var _a = this,
                inner = _a.inner,
                il = _a.il;
            if (inner !== NO && il !== NO_IL) inner._remove(il);
            (this.inner = s)._add(this.il = new FlattenListener(u, this));
        };
        Flatten.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            u._e(err);
        };
        Flatten.prototype._c = function () {
            this.open = false;
            this.less();
        };
        return Flatten;
    }();
    var Fold = function () {
        function Fold(f, seed, ins) {
            var _this = this;
            this.type = 'fold';
            this.ins = ins;
            this.out = NO;
            this.f = function (t) {
                return f(_this.acc, t);
            };
            this.acc = this.seed = seed;
        }
        Fold.prototype._start = function (out) {
            this.out = out;
            this.acc = this.seed;
            out._n(this.acc);
            this.ins._add(this);
        };
        Fold.prototype._stop = function () {
            this.ins._remove(this);
            this.out = NO;
            this.acc = this.seed;
        };
        Fold.prototype._n = function (t) {
            var u = this.out;
            if (u === NO) return;
            var r = _try(this, t, u);
            if (r === NO) return;
            u._n(this.acc = r);
        };
        Fold.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            u._e(err);
        };
        Fold.prototype._c = function () {
            var u = this.out;
            if (u === NO) return;
            u._c();
        };
        return Fold;
    }();
    var Last = function () {
        function Last(ins) {
            this.type = 'last';
            this.ins = ins;
            this.out = NO;
            this.has = false;
            this.val = NO;
        }
        Last.prototype._start = function (out) {
            this.out = out;
            this.has = false;
            this.ins._add(this);
        };
        Last.prototype._stop = function () {
            this.ins._remove(this);
            this.out = NO;
            this.val = NO;
        };
        Last.prototype._n = function (t) {
            this.has = true;
            this.val = t;
        };
        Last.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            u._e(err);
        };
        Last.prototype._c = function () {
            var u = this.out;
            if (u === NO) return;
            if (this.has) {
                u._n(this.val);
                u._c();
            } else u._e(new Error('last() failed because input stream completed'));
        };
        return Last;
    }();
    var MapOp = function () {
        function MapOp(project, ins) {
            this.type = 'map';
            this.ins = ins;
            this.out = NO;
            this.f = project;
        }
        MapOp.prototype._start = function (out) {
            this.out = out;
            this.ins._add(this);
        };
        MapOp.prototype._stop = function () {
            this.ins._remove(this);
            this.out = NO;
        };
        MapOp.prototype._n = function (t) {
            var u = this.out;
            if (u === NO) return;
            var r = _try(this, t, u);
            if (r === NO) return;
            u._n(r);
        };
        MapOp.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            u._e(err);
        };
        MapOp.prototype._c = function () {
            var u = this.out;
            if (u === NO) return;
            u._c();
        };
        return MapOp;
    }();
    var Remember = function () {
        function Remember(ins) {
            this.type = 'remember';
            this.ins = ins;
            this.out = NO;
        }
        Remember.prototype._start = function (out) {
            this.out = out;
            this.ins._add(out);
        };
        Remember.prototype._stop = function () {
            this.ins._remove(this.out);
            this.out = NO;
        };
        return Remember;
    }();
    var ReplaceError = function () {
        function ReplaceError(replacer, ins) {
            this.type = 'replaceError';
            this.ins = ins;
            this.out = NO;
            this.f = replacer;
        }
        ReplaceError.prototype._start = function (out) {
            this.out = out;
            this.ins._add(this);
        };
        ReplaceError.prototype._stop = function () {
            this.ins._remove(this);
            this.out = NO;
        };
        ReplaceError.prototype._n = function (t) {
            var u = this.out;
            if (u === NO) return;
            u._n(t);
        };
        ReplaceError.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            try {
                this.ins._remove(this);
                (this.ins = this.f(err))._add(this);
            } catch (e) {
                u._e(e);
            }
        };
        ReplaceError.prototype._c = function () {
            var u = this.out;
            if (u === NO) return;
            u._c();
        };
        return ReplaceError;
    }();
    var StartWith = function () {
        function StartWith(ins, val) {
            this.type = 'startWith';
            this.ins = ins;
            this.out = NO;
            this.val = val;
        }
        StartWith.prototype._start = function (out) {
            this.out = out;
            this.out._n(this.val);
            this.ins._add(out);
        };
        StartWith.prototype._stop = function () {
            this.ins._remove(this.out);
            this.out = NO;
        };
        return StartWith;
    }();
    var Take = function () {
        function Take(max, ins) {
            this.type = 'take';
            this.ins = ins;
            this.out = NO;
            this.max = max;
            this.taken = 0;
        }
        Take.prototype._start = function (out) {
            this.out = out;
            this.taken = 0;
            if (this.max <= 0) out._c();else this.ins._add(this);
        };
        Take.prototype._stop = function () {
            this.ins._remove(this);
            this.out = NO;
        };
        Take.prototype._n = function (t) {
            var u = this.out;
            if (u === NO) return;
            var m = ++this.taken;
            if (m < this.max) u._n(t);else if (m === this.max) {
                u._n(t);
                u._c();
            }
        };
        Take.prototype._e = function (err) {
            var u = this.out;
            if (u === NO) return;
            u._e(err);
        };
        Take.prototype._c = function () {
            var u = this.out;
            if (u === NO) return;
            u._c();
        };
        return Take;
    }();
    var Stream = function () {
        function Stream(producer) {
            this._prod = producer || NO;
            this._ils = [];
            this._stopID = NO;
            this._dl = NO;
            this._d = false;
            this._target = NO;
            this._err = NO;
        }
        Stream.prototype._n = function (t) {
            var a = this._ils;
            var L = a.length;
            if (this._d) this._dl._n(t);
            if (L == 1) a[0]._n(t);else if (L == 0) return;else {
                var b = cp(a);
                for (var i = 0; i < L; i++) b[i]._n(t);
            }
        };
        Stream.prototype._e = function (err) {
            if (this._err !== NO) return;
            this._err = err;
            var a = this._ils;
            var L = a.length;
            this._x();
            if (this._d) this._dl._e(err);
            if (L == 1) a[0]._e(err);else if (L == 0) return;else {
                var b = cp(a);
                for (var i = 0; i < L; i++) b[i]._e(err);
            }
            if (!this._d && L == 0) throw this._err;
        };
        Stream.prototype._c = function () {
            var a = this._ils;
            var L = a.length;
            this._x();
            if (this._d) this._dl._c();
            if (L == 1) a[0]._c();else if (L == 0) return;else {
                var b = cp(a);
                for (var i = 0; i < L; i++) b[i]._c();
            }
        };
        Stream.prototype._x = function () {
            if (this._ils.length === 0) return;
            if (this._prod !== NO) this._prod._stop();
            this._err = NO;
            this._ils = [];
        };
        Stream.prototype._stopNow = function () {
            // WARNING: code that calls this method should
            // first check if this._prod is valid (not `NO`)
            this._prod._stop();
            this._err = NO;
            this._stopID = NO;
        };
        Stream.prototype._add = function (il) {
            var ta = this._target;
            if (ta !== NO) return ta._add(il);
            var a = this._ils;
            a.push(il);
            if (a.length > 1) return;
            if (this._stopID !== NO) {
                clearTimeout(this._stopID);
                this._stopID = NO;
            } else {
                var p = this._prod;
                if (p !== NO) p._start(this);
            }
        };
        Stream.prototype._remove = function (il) {
            var _this = this;
            var ta = this._target;
            if (ta !== NO) return ta._remove(il);
            var a = this._ils;
            var i = a.indexOf(il);
            if (i > -1) {
                a.splice(i, 1);
                if (this._prod !== NO && a.length <= 0) {
                    this._err = NO;
                    this._stopID = setTimeout(function () {
                        return _this._stopNow();
                    });
                } else if (a.length === 1) {
                    this._pruneCycles();
                }
            }
        };
        // If all paths stemming from `this` stream eventually end at `this`
        // stream, then we remove the single listener of `this` stream, to
        // force it to end its execution and dispose resources. This method
        // assumes as a precondition that this._ils has just one listener.
        Stream.prototype._pruneCycles = function () {
            if (this._hasNoSinks(this, [])) this._remove(this._ils[0]);
        };
        // Checks whether *there is no* path starting from `x` that leads to an end
        // listener (sink) in the stream graph, following edges A->B where B is a
        // listener of A. This means these paths constitute a cycle somehow. Is given
        // a trace of all visited nodes so far.
        Stream.prototype._hasNoSinks = function (x, trace) {
            if (trace.indexOf(x) !== -1) return true;else if (x.out === this) return true;else if (x.out && x.out !== NO) return this._hasNoSinks(x.out, trace.concat(x));else if (x._ils) {
                for (var i = 0, N = x._ils.length; i < N; i++) if (!this._hasNoSinks(x._ils[i], trace.concat(x))) return false;
                return true;
            } else return false;
        };
        Stream.prototype.ctor = function () {
            return this instanceof MemoryStream ? MemoryStream : Stream;
        };
        /**
         * Adds a Listener to the Stream.
         *
         * @param {Listener} listener
         */
        Stream.prototype.addListener = function (listener) {
            listener._n = listener.next || noop;
            listener._e = listener.error || noop;
            listener._c = listener.complete || noop;
            this._add(listener);
        };
        /**
         * Removes a Listener from the Stream, assuming the Listener was added to it.
         *
         * @param {Listener<T>} listener
         */
        Stream.prototype.removeListener = function (listener) {
            this._remove(listener);
        };
        /**
         * Adds a Listener to the Stream returning a Subscription to remove that
         * listener.
         *
         * @param {Listener} listener
         * @returns {Subscription}
         */
        Stream.prototype.subscribe = function (listener) {
            this.addListener(listener);
            return new StreamSub(this, listener);
        };
        /**
         * Add interop between most.js and RxJS 5
         *
         * @returns {Stream}
         */
        Stream.prototype[symbol_observable_1.default] = function () {
            return this;
        };
        /**
         * Creates a new Stream given a Producer.
         *
         * @factory true
         * @param {Producer} producer An optional Producer that dictates how to
         * start, generate events, and stop the Stream.
         * @return {Stream}
         */
        Stream.create = function (producer) {
            if (producer) {
                if (typeof producer.start !== 'function' || typeof producer.stop !== 'function') throw new Error('producer requires both start and stop functions');
                internalizeProducer(producer); // mutates the input
            }
            return new Stream(producer);
        };
        /**
         * Creates a new MemoryStream given a Producer.
         *
         * @factory true
         * @param {Producer} producer An optional Producer that dictates how to
         * start, generate events, and stop the Stream.
         * @return {MemoryStream}
         */
        Stream.createWithMemory = function (producer) {
            if (producer) internalizeProducer(producer); // mutates the input
            return new MemoryStream(producer);
        };
        /**
         * Creates a Stream that does nothing when started. It never emits any event.
         *
         * Marble diagram:
         *
         * ```text
         *          never
         * -----------------------
         * ```
         *
         * @factory true
         * @return {Stream}
         */
        Stream.never = function () {
            return new Stream({ _start: noop, _stop: noop });
        };
        /**
         * Creates a Stream that immediately emits the "complete" notification when
         * started, and that's it.
         *
         * Marble diagram:
         *
         * ```text
         * empty
         * -|
         * ```
         *
         * @factory true
         * @return {Stream}
         */
        Stream.empty = function () {
            return new Stream({
                _start: function (il) {
                    il._c();
                },
                _stop: noop
            });
        };
        /**
         * Creates a Stream that immediately emits an "error" notification with the
         * value you passed as the `error` argument when the stream starts, and that's
         * it.
         *
         * Marble diagram:
         *
         * ```text
         * throw(X)
         * -X
         * ```
         *
         * @factory true
         * @param error The error event to emit on the created stream.
         * @return {Stream}
         */
        Stream.throw = function (error) {
            return new Stream({
                _start: function (il) {
                    il._e(error);
                },
                _stop: noop
            });
        };
        /**
         * Creates a stream from an Array, Promise, or an Observable.
         *
         * @factory true
         * @param {Array|PromiseLike|Observable} input The input to make a stream from.
         * @return {Stream}
         */
        Stream.from = function (input) {
            if (typeof input[symbol_observable_1.default] === 'function') return Stream.fromObservable(input);else if (typeof input.then === 'function') return Stream.fromPromise(input);else if (Array.isArray(input)) return Stream.fromArray(input);
            throw new TypeError("Type of input to from() must be an Array, Promise, or Observable");
        };
        /**
         * Creates a Stream that immediately emits the arguments that you give to
         * *of*, then completes.
         *
         * Marble diagram:
         *
         * ```text
         * of(1,2,3)
         * 123|
         * ```
         *
         * @factory true
         * @param a The first value you want to emit as an event on the stream.
         * @param b The second value you want to emit as an event on the stream. One
         * or more of these values may be given as arguments.
         * @return {Stream}
         */
        Stream.of = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            return Stream.fromArray(items);
        };
        /**
         * Converts an array to a stream. The returned stream will emit synchronously
         * all the items in the array, and then complete.
         *
         * Marble diagram:
         *
         * ```text
         * fromArray([1,2,3])
         * 123|
         * ```
         *
         * @factory true
         * @param {Array} array The array to be converted as a stream.
         * @return {Stream}
         */
        Stream.fromArray = function (array) {
            return new Stream(new FromArray(array));
        };
        /**
         * Converts a promise to a stream. The returned stream will emit the resolved
         * value of the promise, and then complete. However, if the promise is
         * rejected, the stream will emit the corresponding error.
         *
         * Marble diagram:
         *
         * ```text
         * fromPromise( ----42 )
         * -----------------42|
         * ```
         *
         * @factory true
         * @param {PromiseLike} promise The promise to be converted as a stream.
         * @return {Stream}
         */
        Stream.fromPromise = function (promise) {
            return new Stream(new FromPromise(promise));
        };
        /**
         * Converts an Observable into a Stream.
         *
         * @factory true
         * @param {any} observable The observable to be converted as a stream.
         * @return {Stream}
         */
        Stream.fromObservable = function (obs) {
            if (obs.endWhen) return obs;
            return new Stream(new FromObservable(obs));
        };
        /**
         * Creates a stream that periodically emits incremental numbers, every
         * `period` milliseconds.
         *
         * Marble diagram:
         *
         * ```text
         *     periodic(1000)
         * ---0---1---2---3---4---...
         * ```
         *
         * @factory true
         * @param {number} period The interval in milliseconds to use as a rate of
         * emission.
         * @return {Stream}
         */
        Stream.periodic = function (period) {
            return new Stream(new Periodic(period));
        };
        Stream.prototype._map = function (project) {
            return new (this.ctor())(new MapOp(project, this));
        };
        /**
         * Transforms each event from the input Stream through a `project` function,
         * to get a Stream that emits those transformed events.
         *
         * Marble diagram:
         *
         * ```text
         * --1---3--5-----7------
         *    map(i => i * 10)
         * --10--30-50----70-----
         * ```
         *
         * @param {Function} project A function of type `(t: T) => U` that takes event
         * `t` of type `T` from the input Stream and produces an event of type `U`, to
         * be emitted on the output Stream.
         * @return {Stream}
         */
        Stream.prototype.map = function (project) {
            return this._map(project);
        };
        /**
         * It's like `map`, but transforms each input event to always the same
         * constant value on the output Stream.
         *
         * Marble diagram:
         *
         * ```text
         * --1---3--5-----7-----
         *       mapTo(10)
         * --10--10-10----10----
         * ```
         *
         * @param projectedValue A value to emit on the output Stream whenever the
         * input Stream emits any value.
         * @return {Stream}
         */
        Stream.prototype.mapTo = function (projectedValue) {
            var s = this.map(function () {
                return projectedValue;
            });
            var op = s._prod;
            op.type = 'mapTo';
            return s;
        };
        /**
         * Only allows events that pass the test given by the `passes` argument.
         *
         * Each event from the input stream is given to the `passes` function. If the
         * function returns `true`, the event is forwarded to the output stream,
         * otherwise it is ignored and not forwarded.
         *
         * Marble diagram:
         *
         * ```text
         * --1---2--3-----4-----5---6--7-8--
         *     filter(i => i % 2 === 0)
         * ------2--------4---------6----8--
         * ```
         *
         * @param {Function} passes A function of type `(t: T) +> boolean` that takes
         * an event from the input stream and checks if it passes, by returning a
         * boolean.
         * @return {Stream}
         */
        Stream.prototype.filter = function (passes) {
            var p = this._prod;
            if (p instanceof Filter) return new Stream(new Filter(and(p.f, passes), p.ins));
            return new Stream(new Filter(passes, this));
        };
        /**
         * Lets the first `amount` many events from the input stream pass to the
         * output stream, then makes the output stream complete.
         *
         * Marble diagram:
         *
         * ```text
         * --a---b--c----d---e--
         *    take(3)
         * --a---b--c|
         * ```
         *
         * @param {number} amount How many events to allow from the input stream
         * before completing the output stream.
         * @return {Stream}
         */
        Stream.prototype.take = function (amount) {
            return new (this.ctor())(new Take(amount, this));
        };
        /**
         * Ignores the first `amount` many events from the input stream, and then
         * after that starts forwarding events from the input stream to the output
         * stream.
         *
         * Marble diagram:
         *
         * ```text
         * --a---b--c----d---e--
         *       drop(3)
         * --------------d---e--
         * ```
         *
         * @param {number} amount How many events to ignore from the input stream
         * before forwarding all events from the input stream to the output stream.
         * @return {Stream}
         */
        Stream.prototype.drop = function (amount) {
            return new Stream(new Drop(amount, this));
        };
        /**
         * When the input stream completes, the output stream will emit the last event
         * emitted by the input stream, and then will also complete.
         *
         * Marble diagram:
         *
         * ```text
         * --a---b--c--d----|
         *       last()
         * -----------------d|
         * ```
         *
         * @return {Stream}
         */
        Stream.prototype.last = function () {
            return new Stream(new Last(this));
        };
        /**
         * Prepends the given `initial` value to the sequence of events emitted by the
         * input stream. The returned stream is a MemoryStream, which means it is
         * already `remember()`'d.
         *
         * Marble diagram:
         *
         * ```text
         * ---1---2-----3---
         *   startWith(0)
         * 0--1---2-----3---
         * ```
         *
         * @param initial The value or event to prepend.
         * @return {MemoryStream}
         */
        Stream.prototype.startWith = function (initial) {
            return new MemoryStream(new StartWith(this, initial));
        };
        /**
         * Uses another stream to determine when to complete the current stream.
         *
         * When the given `other` stream emits an event or completes, the output
         * stream will complete. Before that happens, the output stream will behaves
         * like the input stream.
         *
         * Marble diagram:
         *
         * ```text
         * ---1---2-----3--4----5----6---
         *   endWhen( --------a--b--| )
         * ---1---2-----3--4--|
         * ```
         *
         * @param other Some other stream that is used to know when should the output
         * stream of this operator complete.
         * @return {Stream}
         */
        Stream.prototype.endWhen = function (other) {
            return new (this.ctor())(new EndWhen(other, this));
        };
        /**
         * "Folds" the stream onto itself.
         *
         * Combines events from the past throughout
         * the entire execution of the input stream, allowing you to accumulate them
         * together. It's essentially like `Array.prototype.reduce`. The returned
         * stream is a MemoryStream, which means it is already `remember()`'d.
         *
         * The output stream starts by emitting the `seed` which you give as argument.
         * Then, when an event happens on the input stream, it is combined with that
         * seed value through the `accumulate` function, and the output value is
         * emitted on the output stream. `fold` remembers that output value as `acc`
         * ("accumulator"), and then when a new input event `t` happens, `acc` will be
         * combined with that to produce the new `acc` and so forth.
         *
         * Marble diagram:
         *
         * ```text
         * ------1-----1--2----1----1------
         *   fold((acc, x) => acc + x, 3)
         * 3-----4-----5--7----8----9------
         * ```
         *
         * @param {Function} accumulate A function of type `(acc: R, t: T) => R` that
         * takes the previous accumulated value `acc` and the incoming event from the
         * input stream and produces the new accumulated value.
         * @param seed The initial accumulated value, of type `R`.
         * @return {MemoryStream}
         */
        Stream.prototype.fold = function (accumulate, seed) {
            return new MemoryStream(new Fold(accumulate, seed, this));
        };
        /**
         * Replaces an error with another stream.
         *
         * When (and if) an error happens on the input stream, instead of forwarding
         * that error to the output stream, *replaceError* will call the `replace`
         * function which returns the stream that the output stream will replicate.
         * And, in case that new stream also emits an error, `replace` will be called
         * again to get another stream to start replicating.
         *
         * Marble diagram:
         *
         * ```text
         * --1---2-----3--4-----X
         *   replaceError( () => --10--| )
         * --1---2-----3--4--------10--|
         * ```
         *
         * @param {Function} replace A function of type `(err) => Stream` that takes
         * the error that occurred on the input stream or on the previous replacement
         * stream and returns a new stream. The output stream will behave like the
         * stream that this function returns.
         * @return {Stream}
         */
        Stream.prototype.replaceError = function (replace) {
            return new (this.ctor())(new ReplaceError(replace, this));
        };
        /**
         * Flattens a "stream of streams", handling only one nested stream at a time
         * (no concurrency).
         *
         * If the input stream is a stream that emits streams, then this operator will
         * return an output stream which is a flat stream: emits regular events. The
         * flattening happens without concurrency. It works like this: when the input
         * stream emits a nested stream, *flatten* will start imitating that nested
         * one. However, as soon as the next nested stream is emitted on the input
         * stream, *flatten* will forget the previous nested one it was imitating, and
         * will start imitating the new nested one.
         *
         * Marble diagram:
         *
         * ```text
         * --+--------+---------------
         *   \        \
         *    \       ----1----2---3--
         *    --a--b----c----d--------
         *           flatten
         * -----a--b------1----2---3--
         * ```
         *
         * @return {Stream}
         */
        Stream.prototype.flatten = function () {
            var p = this._prod;
            return new Stream(new Flatten(this));
        };
        /**
         * Passes the input stream to a custom operator, to produce an output stream.
         *
         * *compose* is a handy way of using an existing function in a chained style.
         * Instead of writing `outStream = f(inStream)` you can write
         * `outStream = inStream.compose(f)`.
         *
         * @param {function} operator A function that takes a stream as input and
         * returns a stream as well.
         * @return {Stream}
         */
        Stream.prototype.compose = function (operator) {
            return operator(this);
        };
        /**
         * Returns an output stream that behaves like the input stream, but also
         * remembers the most recent event that happens on the input stream, so that a
         * newly added listener will immediately receive that memorised event.
         *
         * @return {MemoryStream}
         */
        Stream.prototype.remember = function () {
            return new MemoryStream(new Remember(this));
        };
        /**
         * Returns an output stream that identically behaves like the input stream,
         * but also runs a `spy` function for each event, to help you debug your app.
         *
         * *debug* takes a `spy` function as argument, and runs that for each event
         * happening on the input stream. If you don't provide the `spy` argument,
         * then *debug* will just `console.log` each event. This helps you to
         * understand the flow of events through some operator chain.
         *
         * Please note that if the output stream has no listeners, then it will not
         * start, which means `spy` will never run because no actual event happens in
         * that case.
         *
         * Marble diagram:
         *
         * ```text
         * --1----2-----3-----4--
         *         debug
         * --1----2-----3-----4--
         * ```
         *
         * @param {function} labelOrSpy A string to use as the label when printing
         * debug information on the console, or a 'spy' function that takes an event
         * as argument, and does not need to return anything.
         * @return {Stream}
         */
        Stream.prototype.debug = function (labelOrSpy) {
            return new (this.ctor())(new Debug(this, labelOrSpy));
        };
        /**
         * *imitate* changes this current Stream to emit the same events that the
         * `other` given Stream does. This method returns nothing.
         *
         * This method exists to allow one thing: **circular dependency of streams**.
         * For instance, let's imagine that for some reason you need to create a
         * circular dependency where stream `first$` depends on stream `second$`
         * which in turn depends on `first$`:
         *
         * <!-- skip-example -->
         * ```js
         * import delay from 'xstream/extra/delay'
         *
         * var first$ = second$.map(x => x * 10).take(3);
         * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
         * ```
         *
         * However, that is invalid JavaScript, because `second$` is undefined
         * on the first line. This is how *imitate* can help solve it:
         *
         * ```js
         * import delay from 'xstream/extra/delay'
         *
         * var secondProxy$ = xs.create();
         * var first$ = secondProxy$.map(x => x * 10).take(3);
         * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
         * secondProxy$.imitate(second$);
         * ```
         *
         * We create `secondProxy$` before the others, so it can be used in the
         * declaration of `first$`. Then, after both `first$` and `second$` are
         * defined, we hook `secondProxy$` with `second$` with `imitate()` to tell
         * that they are "the same". `imitate` will not trigger the start of any
         * stream, it just binds `secondProxy$` and `second$` together.
         *
         * The following is an example where `imitate()` is important in Cycle.js
         * applications. A parent component contains some child components. A child
         * has an action stream which is given to the parent to define its state:
         *
         * <!-- skip-example -->
         * ```js
         * const childActionProxy$ = xs.create();
         * const parent = Parent({...sources, childAction$: childActionProxy$});
         * const childAction$ = parent.state$.map(s => s.child.action$).flatten();
         * childActionProxy$.imitate(childAction$);
         * ```
         *
         * Note, though, that **`imitate()` does not support MemoryStreams**. If we
         * would attempt to imitate a MemoryStream in a circular dependency, we would
         * either get a race condition (where the symptom would be "nothing happens")
         * or an infinite cyclic emission of values. It's useful to think about
         * MemoryStreams as cells in a spreadsheet. It doesn't make any sense to
         * define a spreadsheet cell `A1` with a formula that depends on `B1` and
         * cell `B1` defined with a formula that depends on `A1`.
         *
         * If you find yourself wanting to use `imitate()` with a
         * MemoryStream, you should rework your code around `imitate()` to use a
         * Stream instead. Look for the stream in the circular dependency that
         * represents an event stream, and that would be a candidate for creating a
         * proxy Stream which then imitates the target Stream.
         *
         * @param {Stream} target The other stream to imitate on the current one. Must
         * not be a MemoryStream.
         */
        Stream.prototype.imitate = function (target) {
            if (target instanceof MemoryStream) throw new Error('A MemoryStream was given to imitate(), but it only ' + 'supports a Stream. Read more about this restriction here: ' + 'https://github.com/staltz/xstream#faq');
            this._target = target;
            for (var ils = this._ils, N = ils.length, i = 0; i < N; i++) target._add(ils[i]);
            this._ils = [];
        };
        /**
         * Forces the Stream to emit the given value to its listeners.
         *
         * As the name indicates, if you use this, you are most likely doing something
         * The Wrong Way. Please try to understand the reactive way before using this
         * method. Use it only when you know what you are doing.
         *
         * @param value The "next" value you want to broadcast to all listeners of
         * this Stream.
         */
        Stream.prototype.shamefullySendNext = function (value) {
            this._n(value);
        };
        /**
         * Forces the Stream to emit the given error to its listeners.
         *
         * As the name indicates, if you use this, you are most likely doing something
         * The Wrong Way. Please try to understand the reactive way before using this
         * method. Use it only when you know what you are doing.
         *
         * @param {any} error The error you want to broadcast to all the listeners of
         * this Stream.
         */
        Stream.prototype.shamefullySendError = function (error) {
            this._e(error);
        };
        /**
         * Forces the Stream to emit the "completed" event to its listeners.
         *
         * As the name indicates, if you use this, you are most likely doing something
         * The Wrong Way. Please try to understand the reactive way before using this
         * method. Use it only when you know what you are doing.
         */
        Stream.prototype.shamefullySendComplete = function () {
            this._c();
        };
        /**
         * Adds a "debug" listener to the stream. There can only be one debug
         * listener, that's why this is 'setDebugListener'. To remove the debug
         * listener, just call setDebugListener(null).
         *
         * A debug listener is like any other listener. The only difference is that a
         * debug listener is "stealthy": its presence/absence does not trigger the
         * start/stop of the stream (or the producer inside the stream). This is
         * useful so you can inspect what is going on without changing the behavior
         * of the program. If you have an idle stream and you add a normal listener to
         * it, the stream will start executing. But if you set a debug listener on an
         * idle stream, it won't start executing (not until the first normal listener
         * is added).
         *
         * As the name indicates, we don't recommend using this method to build app
         * logic. In fact, in most cases the debug operator works just fine. Only use
         * this one if you know what you're doing.
         *
         * @param {Listener<T>} listener
         */
        Stream.prototype.setDebugListener = function (listener) {
            if (!listener) {
                this._d = false;
                this._dl = NO;
            } else {
                this._d = true;
                listener._n = listener.next || noop;
                listener._e = listener.error || noop;
                listener._c = listener.complete || noop;
                this._dl = listener;
            }
        };
        return Stream;
    }();
    /**
     * Blends multiple streams together, emitting events from all of them
     * concurrently.
     *
     * *merge* takes multiple streams as arguments, and creates a stream that
     * behaves like each of the argument streams, in parallel.
     *
     * Marble diagram:
     *
     * ```text
     * --1----2-----3--------4---
     * ----a-----b----c---d------
     *            merge
     * --1-a--2--b--3-c---d--4---
     * ```
     *
     * @factory true
     * @param {Stream} stream1 A stream to merge together with other streams.
     * @param {Stream} stream2 A stream to merge together with other streams. Two
     * or more streams may be given as arguments.
     * @return {Stream}
     */
    Stream.merge = function merge() {
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        return new Stream(new Merge(streams));
    };
    /**
     * Combines multiple input streams together to return a stream whose events
     * are arrays that collect the latest events from each input stream.
     *
     * *combine* internally remembers the most recent event from each of the input
     * streams. When any of the input streams emits an event, that event together
     * with all the other saved events are combined into an array. That array will
     * be emitted on the output stream. It's essentially a way of joining together
     * the events from multiple streams.
     *
     * Marble diagram:
     *
     * ```text
     * --1----2-----3--------4---
     * ----a-----b-----c--d------
     *          combine
     * ----1a-2a-2b-3b-3c-3d-4d--
     * ```
     *
     * Note: to minimize garbage collection, *combine* uses the same array
     * instance for each emission.  If you need to compare emissions over time,
     * cache the values with `map` first:
     *
     * ```js
     * import pairwise from 'xstream/extra/pairwise'
     *
     * const stream1 = xs.of(1);
     * const stream2 = xs.of(2);
     *
     * xs.combine(stream1, stream2).map(
     *   combinedEmissions => ([ ...combinedEmissions ])
     * ).compose(pairwise)
     * ```
     *
     * @factory true
     * @param {Stream} stream1 A stream to combine together with other streams.
     * @param {Stream} stream2 A stream to combine together with other streams.
     * Multiple streams, not just two, may be given as arguments.
     * @return {Stream}
     */
    Stream.combine = function combine() {
        var streams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            streams[_i] = arguments[_i];
        }
        return new Stream(new Combine(streams));
    };
    exports.Stream = Stream;
    var MemoryStream = function (_super) {
        __extends(MemoryStream, _super);
        function MemoryStream(producer) {
            var _this = _super.call(this, producer) || this;
            _this._has = false;
            return _this;
        }
        MemoryStream.prototype._n = function (x) {
            this._v = x;
            this._has = true;
            _super.prototype._n.call(this, x);
        };
        MemoryStream.prototype._add = function (il) {
            var ta = this._target;
            if (ta !== NO) return ta._add(il);
            var a = this._ils;
            a.push(il);
            if (a.length > 1) {
                if (this._has) il._n(this._v);
                return;
            }
            if (this._stopID !== NO) {
                if (this._has) il._n(this._v);
                clearTimeout(this._stopID);
                this._stopID = NO;
            } else if (this._has) il._n(this._v);else {
                var p = this._prod;
                if (p !== NO) p._start(this);
            }
        };
        MemoryStream.prototype._stopNow = function () {
            this._has = false;
            _super.prototype._stopNow.call(this);
        };
        MemoryStream.prototype._x = function () {
            this._has = false;
            _super.prototype._x.call(this);
        };
        MemoryStream.prototype.map = function (project) {
            return this._map(project);
        };
        MemoryStream.prototype.mapTo = function (projectedValue) {
            return _super.prototype.mapTo.call(this, projectedValue);
        };
        MemoryStream.prototype.take = function (amount) {
            return _super.prototype.take.call(this, amount);
        };
        MemoryStream.prototype.endWhen = function (other) {
            return _super.prototype.endWhen.call(this, other);
        };
        MemoryStream.prototype.replaceError = function (replace) {
            return _super.prototype.replaceError.call(this, replace);
        };
        MemoryStream.prototype.remember = function () {
            return this;
        };
        MemoryStream.prototype.debug = function (labelOrSpy) {
            return _super.prototype.debug.call(this, labelOrSpy);
        };
        return MemoryStream;
    }(Stream);
    exports.MemoryStream = MemoryStream;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Stream;
    
});
System.registerDynamic("npm:@cycle/run@3.2.0/lib/adapt.js", [], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var adaptStream = function (x) {
        return x;
    };
    function setAdapt(f) {
        adaptStream = f;
    }
    exports.setAdapt = setAdapt;
    function adapt(stream) {
        return adaptStream(stream);
    }
    exports.adapt = adapt;
    
});
System.registerDynamic("npm:@cycle/run@3.2.0.json", [], true, function() {
  return {
    "main": "lib/index.js",
    "format": "cjs",
    "meta": {
      "*.json": {
        "format": "json"
      },
      "dist/cycle-run.js": {
        "cjsRequireDetection": false
      },
      "lib/es6/adapt.js": {
        "format": "esm"
      },
      "lib/es6/index.js": {
        "format": "esm"
      }
    },
    "map": {
      "./lib": "./lib/index.js"
    }
  };
});

System.registerDynamic("npm:@cycle/run@3.2.0/lib/index.js", ["xstream", "./adapt"], true, function ($__require, exports, module) {
    "use strict";

    var global = this || self,
        GLOBAL = global;
    Object.defineProperty(exports, "__esModule", { value: true });
    var xstream_1 = $__require("xstream");
    var adapt_1 = $__require("./adapt");
    function logToConsoleError(err) {
        var target = err.stack || err;
        if (console && console.error) {
            console.error(target);
        } else if (console && console.log) {
            console.log(target);
        }
    }
    function makeSinkProxies(drivers) {
        var sinkProxies = {};
        for (var name_1 in drivers) {
            if (drivers.hasOwnProperty(name_1)) {
                sinkProxies[name_1] = xstream_1.default.createWithMemory();
            }
        }
        return sinkProxies;
    }
    function callDrivers(drivers, sinkProxies) {
        var sources = {};
        for (var name_2 in drivers) {
            if (drivers.hasOwnProperty(name_2)) {
                sources[name_2] = drivers[name_2](sinkProxies[name_2], name_2);
                if (sources[name_2] && typeof sources[name_2] === 'object') {
                    sources[name_2]._isCycleSource = name_2;
                }
            }
        }
        return sources;
    }
    // NOTE: this will mutate `sources`.
    function adaptSources(sources) {
        for (var name_3 in sources) {
            if (sources.hasOwnProperty(name_3) && sources[name_3] && typeof sources[name_3]['shamefullySendNext'] === 'function') {
                sources[name_3] = adapt_1.adapt(sources[name_3]);
            }
        }
        return sources;
    }
    function replicateMany(sinks, sinkProxies) {
        var sinkNames = Object.keys(sinks).filter(function (name) {
            return !!sinkProxies[name];
        });
        var buffers = {};
        var replicators = {};
        sinkNames.forEach(function (name) {
            buffers[name] = { _n: [], _e: [] };
            replicators[name] = {
                next: function (x) {
                    return buffers[name]._n.push(x);
                },
                error: function (err) {
                    return buffers[name]._e.push(err);
                },
                complete: function () {}
            };
        });
        var subscriptions = sinkNames.map(function (name) {
            return xstream_1.default.fromObservable(sinks[name]).subscribe(replicators[name]);
        });
        sinkNames.forEach(function (name) {
            var listener = sinkProxies[name];
            var next = function (x) {
                listener._n(x);
            };
            var error = function (err) {
                logToConsoleError(err);
                listener._e(err);
            };
            buffers[name]._n.forEach(next);
            buffers[name]._e.forEach(error);
            replicators[name].next = next;
            replicators[name].error = error;
            // because sink.subscribe(replicator) had mutated replicator to add
            // _n, _e, _c, we must also update these:
            replicators[name]._n = next;
            replicators[name]._e = error;
        });
        buffers = null; // free up for GC
        return function disposeReplication() {
            subscriptions.forEach(function (s) {
                return s.unsubscribe();
            });
            sinkNames.forEach(function (name) {
                return sinkProxies[name]._c();
            });
        };
    }
    function disposeSources(sources) {
        for (var k in sources) {
            if (sources.hasOwnProperty(k) && sources[k] && sources[k].dispose) {
                sources[k].dispose();
            }
        }
    }
    function isObjectEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    /**
     * A function that prepares the Cycle application to be executed. Takes a `main`
     * function and prepares to circularly connects it to the given collection of
     * driver functions. As an output, `setup()` returns an object with three
     * properties: `sources`, `sinks` and `run`. Only when `run()` is called will
     * the application actually execute. Refer to the documentation of `run()` for
     * more details.
     *
     * **Example:**
     * ```js
     * import {setup} from '@cycle/run';
     * const {sources, sinks, run} = setup(main, drivers);
     * // ...
     * const dispose = run(); // Executes the application
     * // ...
     * dispose();
     * ```
     *
     * @param {Function} main a function that takes `sources` as input and outputs
     * `sinks`.
     * @param {Object} drivers an object where keys are driver names and values
     * are driver functions.
     * @return {Object} an object with three properties: `sources`, `sinks` and
     * `run`. `sources` is the collection of driver sources, `sinks` is the
     * collection of driver sinks, these can be used for debugging or testing. `run`
     * is the function that once called will execute the application.
     * @function setup
     */
    function setup(main, drivers) {
        if (typeof main !== "function") {
            throw new Error("First argument given to Cycle must be the 'main' " + "function.");
        }
        if (typeof drivers !== "object" || drivers === null) {
            throw new Error("Second argument given to Cycle must be an object " + "with driver functions as properties.");
        }
        if (isObjectEmpty(drivers)) {
            throw new Error("Second argument given to Cycle must be an object " + "with at least one driver function declared as a property.");
        }
        var sinkProxies = makeSinkProxies(drivers);
        var sources = callDrivers(drivers, sinkProxies);
        var adaptedSources = adaptSources(sources);
        var sinks = main(adaptedSources);
        if (typeof window !== 'undefined') {
            window.Cyclejs = window.Cyclejs || {};
            window.Cyclejs.sinks = sinks;
        }
        function _run() {
            var disposeReplication = replicateMany(sinks, sinkProxies);
            return function dispose() {
                disposeSources(sources);
                disposeReplication();
            };
        }
        return { sinks: sinks, sources: sources, run: _run };
    }
    exports.setup = setup;
    /**
     * Takes a `main` function and circularly connects it to the given collection
     * of driver functions.
     *
     * **Example:**
     * ```js
     * import run from '@cycle/run';
     * const dispose = run(main, drivers);
     * // ...
     * dispose();
     * ```
     *
     * The `main` function expects a collection of "source" streams (returned from
     * drivers) as input, and should return a collection of "sink" streams (to be
     * given to drivers). A "collection of streams" is a JavaScript object where
     * keys match the driver names registered by the `drivers` object, and values
     * are the streams. Refer to the documentation of each driver to see more
     * details on what types of sources it outputs and sinks it receives.
     *
     * @param {Function} main a function that takes `sources` as input and outputs
     * `sinks`.
     * @param {Object} drivers an object where keys are driver names and values
     * are driver functions.
     * @return {Function} a dispose function, used to terminate the execution of the
     * Cycle.js program, cleaning up resources used.
     * @function run
     */
    function run(main, drivers) {
        var program = setup(main, drivers);
        if (typeof window !== 'undefined' && window['CyclejsDevTool_startGraphSerializer']) {
            window['CyclejsDevTool_startGraphSerializer'](program.sinks);
        }
        return program.run();
    }
    exports.run = run;
    exports.default = run;
    
});
//# sourceMappingURL=build.js.map