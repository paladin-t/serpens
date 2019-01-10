var $builtinmodule = function (name) {
    var mod = { };

    var moduleFunction = function () {
        console.log('moduleFunction', arguments);

        return new Sk.builtins.tuple([ ]);
    };
    mod.moduleFunction = new Sk.builtin.func(moduleFunction);

    var MODULE_OBJECT = "ModuleObject";
    var ModuleObject = function ($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(
            function (self, a, b) {
                console.log('ModuleObject', self, a, b);
                var val = { };
                val.a = a;
                val.b = b;
                self.v = val;
                self.tp$name = MODULE_OBJECT;
            }
        );

        $loc._internalGenericGetAttr = Sk.builtin.object.prototype.GenericSetAttr;

        $loc.__getattr__ = new Sk.builtin.func(
            function (self, name) {
                if (name != null && (Sk.builtin.checkString(name) || typeof name === "string")) {
                    var _name = name;

                    // Gets JavaScript string.
                    if (Sk.builtin.checkString(name)) {
                        _name = Sk.ffi.remapToJs(name);
                    }

                    switch (_name) {
                        case 'intv':
                            return new Sk.builtin.int_(PyArray_NDIM(self));
                        case 'tuplev':
                            return new Sk.builtin.tuple([ ]);
                        case 'listv':
                            return new Sk.builtin.list([ ]);
                        case 'a':
                            return self.v.a;
                        case 'b':
                            return self.v.b;
                    }
                }

                // If we have not returned yet, try the genericgetattr.
                var r, f, ret;
                if (self.tp$getattr !== undefined) {
                    f = self.tp$getattr("__getattribute__");
                }
                if (f !== undefined) {
                    ret = Sk.misceval.callsimOrSuspend(f, new Sk.builtin.str(_name));
                }
                if (r === undefined) {
                    throw new Sk.builtin.AttributeError("'" + Sk.abstr.typeName(self) + "' object has no attribute '" + _name + "'");
                }

                return r;
            }
        );

        $loc.__setattr__ = new Sk.builtin.func(
            function (self, name, value) {
                if (name != null && (Sk.builtin.checkString(name) || typeof name === "string")) {
                    var _name = name;

                    // Gets JavaScript string.
                    if (Sk.builtin.checkString(name)) {
                        _name = Sk.ffi.remapToJs(name);
                    }

                    switch (_name) {
                        case 'a':
                            self.v.a = value;
                            return;
                        case 'b':
                            self.v.b = value;
                            return;
                    }
                }

                // builtin: --> all is readonly (I am not happy with this)
                throw new Sk.builtin.AttributeError("'ModuleObject' object attribute '" + name + "' is readonly");
            }
        );

        $loc.__len__ = new Sk.builtin.func(
            function (self) {
                return new Sk.builtin.int_(2);
            }
        );

        $loc.__str__ = new Sk.builtin.func(
            function (self) {
                return new Sk.builtin.str('[' + self.v.a.v.toString() + ', ' + self.v.b.v.toString() + ']');
            }
        );

        // Creates left hand side operations for given binary operator.
        function makeBinaryOp (operation) {
            return function (self, other) {
                console.log(operation, self, other);
            };
        }

        $loc.__add__ = new Sk.builtin.func(makeBinaryOp("add"));
        $loc.__radd__ = new Sk.builtin.func(makeBinaryOp("add"));
        $loc.__iadd__ = new Sk.builtin.func(makeBinaryOp("add"));
    };

    mod[MODULE_OBJECT] = Sk.misceval.buildClass(mod, ModuleObject, MODULE_OBJECT, [ ]);

    mod.doNotExist = new Sk.builtin.func(
        function () {
            throw new Sk.builtin.NotImplementedError("`doNotExist` is not yet implemented");
        }
    );

    return mod;
};
