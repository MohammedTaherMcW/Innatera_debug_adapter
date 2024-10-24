! function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t(require("vscode-debugadapter")) : "function" == typeof define && define.amd ? define("Innatera-vscode-debug", ["vscode-debugadapter"], t) : "object" == typeof exports ? exports["platformio-vscode-debug"] = t(require("vscode-debugadapter")) : e["Innatera-vscode-debug"] = t(e["vscode-debugadapter"])
}(global, (function(e) {
    return (() => {
        "use strict";
        var t = {
                28: (e, t, s) => {
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.MIError = t.VariableObject = void 0;
                    const r = s(398);
                    t.VariableObject = class {
                        constructor(e) {
                            this.name = r.MINode.valueOf(e, "name"), this.exp = r.MINode.valueOf(e, "exp"), this.numchild = parseInt(r.MINode.valueOf(e, "numchild")), this.type = r.MINode.valueOf(e, "type"), this.value = r.MINode.valueOf(e, "value"), this.threadId = r.MINode.valueOf(e, "thread-id"), this.frozen = !!r.MINode.valueOf(e, "frozen"), this.dynamic = !!r.MINode.valueOf(e, "dynamic"), this.displayhint = r.MINode.valueOf(e, "displayhint"), this.hasMore = !!r.MINode.valueOf(e, "has_more")
                        }
                        applyChanges(e) {
                            this.value = r.MINode.valueOf(e, "value"), r.MINode.valueOf(e, "type_changed") && (this.type = r.MINode.valueOf(e, "new_type")), this.dynamic = !!r.MINode.valueOf(e, "dynamic"), this.displayhint = r.MINode.valueOf(e, "displayhint"), this.hasMore = !!r.MINode.valueOf(e, "has_more")
                        }
                        isCompound() {
                            return this.numchild > 0 || "{...}" === this.value || this.dynamic && ("array" === this.displayhint || "map" === this.displayhint)
                        }
                        toProtocolVariable() {
                            return {
                                name: this.exp,
                                evaluateName: this.fullExp || this.exp,
                                value: void 0 === this.value ? "<unknown>" : this.value,
                                type: this.type,
                                presentationHint: {
                                    kind: this.displayhint
                                },
                                variablesReference: this.id
                            }
                        }
                    }, t.MIError = class {
                        constructor(e, t) {
                            Object.defineProperty(this, "name", {
                                get: () => this.constructor.name
                            }), Object.defineProperty(this, "message", {
                                get: () => e
                            }), Object.defineProperty(this, "source", {
                                get: () => t
                            }), Error.captureStackTrace(this, this.constructor)
                        }
                        toString() {
                            return `${this.message} (from ${this.source})`
                        }
                    }, Object.setPrototypeOf(t.MIError, Object.create(Error.prototype)), t.MIError.prototype.constructor = t.MIError
                },
                656: (e, t, s) => {
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.expandValue = t.isExpandable = void 0;
                    const r = s(398),
                        i = /^([a-zA-Z_\-][a-zA-Z0-9_\-]*|\[\d+\])\s*=\s*/,
                        n = /^[a-zA-Z_\-][a-zA-Z0-9_\-]*/,
                        o = /^\<.+?\>/,
                        a = /^(0x[0-9a-fA-F]+\s*)"/,
                        d = /^0x[0-9a-fA-F]+/,
                        l = /^0x0+\b/,
                        u = /^(\d+) ['"]/,
                        h = /^\d+(\.\d+)?/;
                    t.isExpandable = function(e) {
                        return 0 === (e = e.trim()).length ? 0 : e.startsWith("{...}") ? 2 : "{" === e[0] ? 1 : e.startsWith("true") || e.startsWith("false") || l.exec(e) || a.exec(e) ? 0 : d.exec(e) ? 2 : (u.exec(e) || h.exec(e) || n.exec(e) || o.exec(e), 0)
                    }, t.expandValue = function(e, t, s = "", c) {
                        const p = () => {
                                if ('"' !== (t = t.trim())[0] && "'" !== t[0]) return "";
                                let e = 1,
                                    s = !0;
                                const r = t[0];
                                let i = t.substr(1),
                                    n = !1;
                                for (; s;) n ? n = !1 : "\\" === i[0] ? n = !0 : i[0] === r && (s = !1), i = i.substr(1), e++;
                                const o = t.substr(0, e).trim();
                                return t = t.substr(e).trim(), o
                            },
                            m = [s];
                        let b, f, g, v, y, R = "";
                        const x = e => {
                            let t = "",
                                s = "";
                            return m.push(e), m.forEach((e => {
                                if (s = "", "" !== e)
                                    if (e.startsWith("[")) t += e;
                                    else if (t) {
                                    for (; e.startsWith("*");) s += "*", e = e.substr(1);
                                    t = t + "." + e
                                } else t = e
                            })), m.pop(), s + t
                        };
                        return b = () => '"' === (t = t.trim())[0] ? p() : "{" === t[0] ? (() => {
                            if ("{" !== (t = t.trim())[0]) return;
                            if ("}" === (t = t.substr(1).trim())[0]) return t = t.substr(1).trim(), [];
                            if (t.startsWith("...") && "}" === (t = t.substr(3).trim())[0]) return t = t.substr(1).trim(), "<...>";
                            const e = t.indexOf("="),
                                s = t.indexOf("{"),
                                r = t.indexOf(",");
                            let i = s;
                            if (-1 !== r && r < s && (i = r), -1 !== i && e > i || -1 === e) {
                                const e = [];
                                m.push("[0]");
                                let s = b();
                                m.pop(), e.push(y("[0]", s));
                                let r = 0;
                                for (;;) {
                                    if (m.push("[" + ++r + "]"), !(s = g())) {
                                        m.pop();
                                        break
                                    }
                                    m.pop(), e.push(y("[" + r + "]", s))
                                }
                                return t = t.substr(1).trim(), e
                            }
                            let n = v(!0);
                            if (n) {
                                const e = [];
                                for (e.push(n); n = f(!0);) e.push(n);
                                return t = t.substr(1).trim(), e
                            }
                        })() : (() => {
                            let e, s;
                            return 0 === (t = t.trim()).length ? e = void 0 : t.startsWith("true") ? (e = "true", t = t.substr(4).trim()) : t.startsWith("false") ? (e = "false", t = t.substr(5).trim()) : (s = l.exec(t)) ? (e = "<nullptr>", t = t.substr(s[0].length).trim()) : (s = a.exec(t)) ? (t = t.substr(s[1].length).trim(), e = p()) : (s = d.exec(t)) ? (e = "*" + s[0], t = t.substr(s[0].length).trim()) : (s = u.exec(t)) ? (e = s[1], t = t.substr(s[0].length - 1), e += " " + p()) : (s = h.exec(t)) || (s = n.exec(t)) || (s = o.exec(t)) ? (e = s[0], t = t.substr(s[0].length).trim()) : e = t, e
                        })(), v = (e = !1) => {
                            t = t.trim();
                            const s = i.exec(t);
                            if (!s) return;
                            t = t.substr(s[0].length).trim();
                            const r = R = s[1];
                            e && m.push(R);
                            const n = b();
                            return e && m.pop(), y(r, n)
                        }, y = (t, s) => {
                            let i = 0;
                            return "object" == typeof s && (i = e(s), s = "Object"), "string" == typeof s && s.startsWith("*0x") && (c && "1" === r.MINode.valueOf(c, "arg") ? (i = e(x("*(" + t), {
                                arg: !0
                            }), s = "<args>") : (i = e(x("*" + t)), s = "Object@" + s)), "string" == typeof s && s.startsWith("<...>") && (i = e(x(t)), s = "..."), {
                                name: t,
                                value: s,
                                variablesReference: i
                            }
                        }, g = () => {
                            if ("," === (t = t.trim())[0]) return t = t.substr(1).trim(), b()
                        }, f = (e = !1) => {
                            if ("," === (t = t.trim())[0]) return t = t.substr(1).trim(), v(e)
                        }, t = t.trim(), b()
                    }
                },
                789: function(e, t, s) {
                    var r = this && this.__awaiter || function(e, t, s, r) {
                        return new(s || (s = Promise))((function(i, n) {
                            function o(e) {
                                try {
                                    d(r.next(e))
                                } catch (e) {
                                    n(e)
                                }
                            }

                            function a(e) {
                                try {
                                    d(r.throw(e))
                                } catch (e) {
                                    n(e)
                                }
                            }

                            function d(e) {
                                var t;
                                e.done ? i(e.value) : (t = e.value, t instanceof s ? t : new s((function(e) {
                                    e(t)
                                }))).then(o, a)
                            }
                            d((r = r.apply(e, t || [])).next())
                        }))
                    };
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.GDBDebugSession = void 0;
                    const i = s(113),
                        n = s(147),
                        o = s(512),
                        a = s(797),
                        d = s(200),
                        l = s(593),
                        u = s(28),
                        h = s(656),
                        c = s(504),
                        p = s(398),
                        m = s(527);
                    class b {
                        constructor(e, t) {
                            this.name = e, this.options = t
                        }
                    }
                    const f = 65536,
                        g = 131071;
                    class v extends a.Event {
                        constructor(e, t) {
                            super("custom-stop", {
                                reason: e,
                                threadID: t
                            })
                        }
                    }
                    class y extends a.Event {
                        constructor(e, t = !0) {
                            super("custom-continued", {
                                threadID: e,
                                allThreads: t
                            })
                        }
                    }
                    class R extends a.DebugSession {
                        constructor(e, t = !1, s = 1) {
                            super(e, t), this.variableHandles = new a.Handles(131072), this.variableHandlesReverse = {}, this.forceDisassembly = !1, this.activeEditorPath = null, this.currentThreadId = 0, this.stopped = !1, this.stoppedReason = "", this.breakpointMap = new Map, this.fileExistsCache = new Map
                        }
                        initDebugger() {
                            this.miDebugger.on("launcherror", this.launchError.bind(this)), this.miDebugger.on("quit", this.quitEvent.bind(this)), this.miDebugger.on("exited-normally", this.quitEvent.bind(this)), this.miDebugger.on("stopped", this.stopEvent.bind(this)), this.miDebugger.on("msg", this.handleMsg.bind(this)), this.miDebugger.on("breakpoint", this.handleBreakpoint.bind(this)), this.miDebugger.on("step-end", this.handleBreak.bind(this)), this.miDebugger.on("step-out-end", this.handleBreak.bind(this)), this.miDebugger.on("signal-stop", this.handlePause.bind(this)), this.miDebugger.on("running", this.handleRunning.bind(this)), this.miDebugger.on("thread-created", this.handleThreadCreated.bind(this)), this.miDebugger.on("thread-exited", this.handleThreadExited.bind(this)), this.miDebugger.on("thread-selected", this.handleThreadSelected.bind(this)), this.sendEvent(new a.InitializedEvent)
                        }
                        initializeRequest(e, t) {
                            e.body.supportsConditionalBreakpoints = !0, e.body.supportsConfigurationDoneRequest = !0, e.body.supportsEvaluateForHovers = !0, e.body.supportsFunctionBreakpoints = !0, e.body.supportsHitConditionalBreakpoints = !0, e.body.supportsRestartRequest = !0, e.body.supportsSetVariable = !0, e.body.supportsTerminateRequest = !0, e.body.supportsValueFormattingOptions = !0, this.sendResponse(e)
                        }
                        launchRequest(e, t) {
                            this.args = t, this.processLaunchAttachRequest(e, !1)
                        }
                        attachRequest(e, t) {
                            this.args = t, this.processLaunchAttachRequest(e, !0)
                        }
                        processLaunchAttachRequest(e, t) {
                            this.quit = !1, this.attached = !1, this.started = !1, this.crashed = !1, this.debugReady = !1, this.stopped = !1, this.breakpointMap = new Map, this.fileExistsCache = new Map;
                            const s = ["debug"];
                            this.args.projectEnvName && s.push("-e", this.args.projectEnvName), this.args.loadMode && s.push("--load-mode", this.args.loadMode), s.push("--interface", "gdb", "--interpreter=mi2", "-q"), this.miDebugger = new c.MI2("innaterapluginio", s), this.initDebugger(), this.miDebugger.printCalls = !!this.args.showDevDebugOutput, this.miDebugger.debugOutput = !!this.args.showDevDebugOutput, this.miDebugger.once("debug-ready", (() => {
                                this.debugReady = !0, this.stopped = !0, this.stoppedReason = "start", this.sendEvent(new d.StoppedEvent("start", this.currentThreadId, !0)), this.sendEvent(new v("start", this.currentThreadId))
                            })), this.miDebugger.connect(this.args.cwd, ['interpreter-exec console "source .pioinit"', "enable-pretty-printing"]).then((() => {
                                this.symbolTable = new m.SymbolTable(this.args.toolchainBinDir, this.args.executable);
                                try {
                                    this.symbolTable.loadSymbols(), this.started = !0, this.sendResponse(e)
                                } catch (t) {
                                    this.args.toolchainBinDir && this.sendErrorResponse(e, 102, `Failed to load symbols from executable file: ${t.toString()}`)
                                }
                            }), (t => {
                                this.sendErrorResponse(e, 103, `Failed to launch GDB: ${t.toString()}`)
                            }))
                        }
                        customRequest(e, t, s) {
                            switch (e) {
                                case "set-force-disassembly":
                                    t.body = {
                                        success: !0
                                    }, this.forceDisassembly = s.force, this.stopped && (this.activeEditorPath = null, this.sendEvent(new a.ContinuedEvent(this.currentThreadId, !0)), this.sendEvent(new d.StoppedEvent(this.stoppedReason, this.currentThreadId, !0))), this.sendResponse(t);
                                    break;
                                case "load-function-symbols":
                                    t.body = {
                                        functionSymbols: this.symbolTable.getFunctionSymbols()
                                    }, this.sendResponse(t);
                                    break;
                                case "set-active-editor":
                                    this.activeEditorPath = s.path, t.body = {}, this.sendResponse(t);
                                    break;
                                case "get-arguments":
                                    t.body = this.args, this.sendResponse(t);
                                    break;
                                case "read-memory":
                                    this.customReadMemoryRequest(t, s.address, s.length);
                                    break;
                                case "write-memory":
                                    this.customWriteMemoryRequest(t, s.address, s.data);
                                    break;
                                case "read-registers":
                                    this.customReadRegistersRequest(t);
                                    break;
                                case "read-register-list":
                                    this.customReadRegisterListRequest(t);
                                    break;
                                case "disassemble":
                                    this.disassembleRequest(t, s);
                                    break;
                                case "execute-command":
                                    let e = s.command;
                                    e = e.startsWith("-") ? e.substring(1) : `interpreter-exec console "${e}"`,
                                    this.miDebugger.sendCommand(e).then((e => {
                                        t.body = e.resultRecords, this.sendResponse(t)
                                    }), (e => {
                                        t.body = e, this.sendErrorResponse(t, 110, "Unable to execute command")
                                    }));
                                    break;
                                case "update-register":
                                        this.customUpdateRegisterRequest(t, s);
                                        break;
                                case "update-memory":
                                        this.UpdateMemory(t,s);
                                        break;
                                default:
                                    t.body = {
                                        error: "Invalid command."
                                    }, this.sendResponse(t)
                                }
                            }
                            UpdateMemory(t,s){
                                let command = `data-write-memory-bytes ${s.address}  ${s.value}`
    
                                this.miDebugger.sendCommand(command).then((r => {
                                    if ("done" === r.resultRecords.resultClass) {
                                        t.body = {
                                            success: s.address,
                                            Command: command
                                        }
                                    } else t.body = {
                                        error: r.resultRecords.results,
                                        Command: command                                    
                                    };
                                    this.sendResponse(t)
                                }), (r => {
                                    t.body = {
                                        error: r,
                                        Command: command
                                    }, this.sendErrorResponse(t, 116, `Unable to Update register list: ${JSON.stringify(r)} "and " ${JSON.stringify(t)}`)
                                }))
                            }
                            customUpdateRegisterRequest(t, s) {

                                const registerLabel = s.label;
                                const registerValue = s.value; // You may need to add this to the request payload
    
                                let command = `gdb-set $${registerLabel}=${registerValue}`;
    
                                this.miDebugger.sendCommand(command).then((r => {
                                    if ("done" === r.resultRecords.resultClass) {
                                        t.body = {
                                            success: true,
                                            MIdebugger: command
                                        }
                                    } else t.body = {
                                        error: r.resultRecords.results,
                                        Commandsend: command
                                    };
                                    this.sendResponse(t)
                                }), (r => {
                                    t.body = {
                                        error: r,
                                        send: command
                                    }, this.sendErrorResponse(t, 116, `Unable to Update register list: ${JSON.stringify(r)} "and " ${JSON.stringify(t)}`)
                                }))
                        }
                        disassembleRequest(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                if (t.function) try {
                                    const s = yield this.getDisassemblyForFunction(t.function, t.file);
                                    e.body = {
                                        instructions: s.instructions,
                                        name: s.name,
                                        file: s.file,
                                        address: s.address,
                                        length: s.length
                                    }, this.sendResponse(e)
                                } catch (t) {
                                    this.sendErrorResponse(e, 1, `Unable to disassemble: ${t.toString()}`)
                                } else if (t.startAddress) try {
                                    let s = this.symbolTable.getFunctionAtAddress(t.startAddress);
                                    if (s) s = yield this.getDisassemblyForFunction(s.name, s.file), e.body = {
                                        instructions: s.instructions,
                                        name: s.name,
                                        file: s.file,
                                        address: s.address,
                                        length: s.length
                                    }, this.sendResponse(e);
                                    else {
                                        const s = yield this.getDisassemblyForAddresses(t.startAddress, t.length || 256);
                                        e.body = {
                                            instructions: s
                                        }, this.sendResponse(e)
                                    }
                                } catch (t) {
                                    this.sendErrorResponse(e, 1, `Unable to disassemble: ${t.toString()}`)
                                } else this.sendErrorResponse(e, 1, "Unable to disassemble; invalid parameters.")
                            }))
                        }
                        getDisassemblyForFunction(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                const s = this.symbolTable.getFunctionByName(e, t);
                                if (!s) throw new Error(`Unable to find function with name ${e}.`);
                                if (s.instructions) return s;
                                const r = s.address,
                                    i = s.address + s.length,
                                    n = (yield this.miDebugger.sendCommand(`data-disassemble -s ${(0,l.hexFormat)(r,8)} -e ${(0,l.hexFormat)(i,8)} -- 2`)).result("asm_insns").map((e => ({
                                        address: p.MINode.valueOf(e, "address"),
                                        functionName: p.MINode.valueOf(e, "func-name"),
                                        offset: parseInt(p.MINode.valueOf(e, "offset")),
                                        instruction: p.MINode.valueOf(e, "inst"),
                                        opcodes: p.MINode.valueOf(e, "opcodes")
                                    })));
                                return s.instructions = n, s
                            }))
                        }
                        getDisassemblyForAddresses(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                const s = e + t;
                                return (yield this.miDebugger.sendCommand(`data-disassemble -s ${(0,l.hexFormat)(e,8)} -e ${(0,l.hexFormat)(s,8)} -- 2`)).result("asm_insns").map((e => ({
                                    address: p.MINode.valueOf(e, "address"),
                                    functionName: p.MINode.valueOf(e, "func-name"),
                                    offset: parseInt(p.MINode.valueOf(e, "offset")),
                                    instruction: p.MINode.valueOf(e, "inst"),
                                    opcodes: p.MINode.valueOf(e, "opcodes")
                                })))
                            }))
                        }
                        customReadMemoryRequest(e, t, s) {
                            this.miDebugger.examineMemory(t, s).then((s => {
                                const r = s.match(/[0-9a-f]{2}/g).map((e => parseInt(e, 16)));
                                e.body = {
                                    startAddress: t,
                                    endAddress: t + r.length,
                                    bytes: r
                                }, this.sendResponse(e)
                            }), (t => {
                                e.body = {
                                    error: t
                                }, this.sendErrorResponse(e, 114, `Unable to read memory: ${t.toString()}`)
                            }))
                        }
                        customWriteMemoryRequest(e, t, s) {
                            const r = (0, l.hexFormat)(t, 8);
                            this.miDebugger.sendCommand(`data-write-memory-bytes ${r} ${s}`).then((t => {
                                this.sendResponse(e)
                            }), (t => {
                                e.body = {
                                    error: t
                                }, this.sendErrorResponse(e, 114, `Unable to write memory: ${t.toString()}`)
                            }))
                        }
                        customReadRegistersRequest(e) {
                            this.miDebugger.sendCommand("data-list-register-values x 1 2 3 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32").then((t => {
                                if ("done" === t.resultRecords.resultClass) {
                                    const s = t.resultRecords.results[0][1];
                                    e.body = s.map((e => {
                                        const t = {};
                                        return e.forEach((e => {
                                            t[e[0]] = e[1]
                                        })), t
                                    }))
                                } else e.body = {
                                    error: "Unable to parse response"
                                };
                                this.sendResponse(e)
                            }), (t => {
                                e.body = {
                                    error: t
                                }, this.sendErrorResponse(e, 115, `Unable to read registers: ${t.toString()}`)
                            }))
                        }
                        customReadRegisterListRequest(e) {
                            this.miDebugger.sendCommand("data-list-register-names").then((t => {
                                if ("done" === t.resultRecords.resultClass) {
                                    let s;
                                    t.resultRecords.results.forEach((e => {
                                        "register-names" === e[0] && (s = e[1])
                                    })), e.body = s
                                } else e.body = {
                                    error: t.resultRecords.results
                                };
                                this.sendResponse(e)
                            }), (t => {
                                e.body = {
                                    error: t
                                }, this.sendErrorResponse(e, 116, `Unable to read register list: ${t.toString()}`)
                            }))
                        }
                        disconnectRequest(e, t) {
                            this.miDebugger && (this.attached ? this.miDebugger.detach() : this.miDebugger.stop(!0)), this.sendResponse(e)
                        }
                        terminateRequest(e, t) {
                            this.miDebugger && this.miDebugger.stop(), this.sendResponse(e)
                        }
                        restartRequest(e, t) {
                            const s = () => {
                                this.miDebugger.restart(['interpreter-exec console "pio_restart_target"']).then((t => {
                                    this.sendResponse(e), (0, o.setTimeout)((() => {
                                        this.stopped = !0, this.stoppedReason = "restart", this.sendEvent(new a.ContinuedEvent(this.currentThreadId, !0)), this.sendEvent(new d.StoppedEvent("restart", this.currentThreadId, !0))
                                    }), 50)
                                }), (t => {
                                    this.sendErrorResponse(e, 6, `Could not restart: ${t}`)
                                }))
                            };
                            this.stopped ? s() : (this.miDebugger.once("generic-stopped", s), this.miDebugger.sendCommand("exec-interrupt"))
                        }
                        handleAdapterOutput(e) {
                            this.sendEvent(new d.AdapterOutputEvent(e, "out"))
                        }
                        handleMsg(e, t) {
                            "target" === e && (e = "stdout"), "log" === e && (e = "stderr"), this.sendEvent(new a.OutputEvent(t, e))
                        }
                        handleRunning(e) {
                            this.stopped = !1, this.sendEvent(new a.ContinuedEvent(this.currentThreadId, !0)), this.sendEvent(new y(this.currentThreadId, !0))
                        }
                        handleBreakpoint(e) {
                            const t = parseInt(e.record("thread-id") || this.currentThreadId);
                            this.stopped = !0, this.stoppedReason = "breakpoint", this.sendEvent(new d.StoppedEvent("breakpoint", t, !0)), this.sendEvent(new v("breakpoint", t))
                        }
                        handleBreak(e) {
                            this.stopped = !0, this.stoppedReason = "step", this.sendEvent(new d.StoppedEvent("step", this.currentThreadId, !0)), this.sendEvent(new v("step", this.currentThreadId))
                        }
                        handlePause(e) {
                            this.stopped = !0, this.stoppedReason = "user request", this.sendEvent(new d.StoppedEvent("user request", this.currentThreadId, !0)), this.sendEvent(new v("user request", this.currentThreadId))
                        }
                        handleThreadCreated(e) {
                            this.sendEvent(new a.ThreadEvent("started", e.threadId))
                        }
                        handleThreadExited(e) {
                            this.sendEvent(new a.ThreadEvent("exited", e.threadId))
                        }
                        handleThreadSelected(e) {
                            this.currentThreadId = e.threadId, this.sendEvent(new a.ThreadEvent("selected", e.threadId))
                        }
                        stopEvent(e) {
                            this.started || (this.crashed = !0), this.quit || (this.stopped = !0, this.stoppedReason = "exception", this.sendEvent(new d.StoppedEvent("exception", this.currentThreadId, !0)), this.sendEvent(new v("exception", this.currentThreadId)))
                        }
                        quitEvent() {
                            this.quit = !0, this.sendEvent(new a.TerminatedEvent)
                        }
                        launchError(e) {
                            this.handleMsg("stderr", `Could not start debugger process > ${e.toString()}\n`), this.quitEvent()
                        }
                        setFunctionBreakPointsRequest(e, t) {
                            if (!t.breakpoints || !t.breakpoints.length) return;
                            const s = s => r(this, void 0, void 0, (function*() {
                                    const r = [];
                                    t.breakpoints.forEach((e => {
                                        r.push(this.miDebugger.addBreakPoint({
                                            raw: e.name,
                                            condition: e.condition,
                                            countCondition: e.hitCondition
                                        }))
                                    }));
                                    try {
                                        const t = yield Promise.all(r), s = [];
                                        t.forEach((e => {
                                            e[0] && s.push({
                                                line: e[1].line
                                            })
                                        })), e.body = {
                                            breakpoints: s
                                        }, this.sendResponse(e)
                                    } catch (t) {
                                        this.sendErrorResponse(e, 10, t.toString())
                                    }
                                    s && (yield this.miDebugger.sendCommand("exec-continue"))
                                })),
                                i = () => r(this, void 0, void 0, (function*() {
                                    this.stopped ? yield s(!1): (this.miDebugger.sendCommand("exec-interrupt"), this.miDebugger.once("generic-stopped", (() => {
                                        s(!0)
                                    })))
                                }));
                            this.debugReady ? i() : this.miDebugger.once("debug-ready", i)
                        }
                        setBreakPointsRequest(e, t) {
                            const s = s => r(this, void 0, void 0, (function*() {
                                    this.debugReady = !0;
                                    const r = (this.breakpointMap.get(t.source.path) || []).map((e => e.number));
                                    try {
                                        yield this.miDebugger.removeBreakpoints(r), this.breakpointMap.set(t.source.path, []);
                                        const s = [],
                                            i = decodeURIComponent(t.source.path);
                                        if (i.startsWith("disassembly:/")) {
                                            const e = (0, l.parseQuery)(i.substr(i.indexOf("?"))),
                                                r = yield this.getDisassemblyForFunction(e.func, e.file);
                                            t.breakpoints.forEach((e => {
                                                if (e.line <= r.instructions.length) {
                                                    const i = r.instructions[e.line - 1];
                                                    s.push(this.miDebugger.addBreakPoint({
                                                        file: t.source.path,
                                                        line: e.line,
                                                        condition: e.condition,
                                                        countCondition: e.hitCondition,
                                                        raw: i.address
                                                    }))
                                                }
                                            }))
                                        } else t.breakpoints.forEach((e => {
                                            s.push(this.miDebugger.addBreakPoint({
                                                file: t.source.path,
                                                line: e.line,
                                                condition: e.condition,
                                                countCondition: e.hitCondition
                                            }))
                                        }));
                                        const n = (yield Promise.all(s)).filter((e => null !== e));
                                        e.body = {
                                            breakpoints: n.map((e => ({
                                                line: e.line,
                                                id: e.number,
                                                verified: !0
                                            })))
                                        }, this.breakpointMap.set(t.source.path, n), this.sendResponse(e)
                                    } catch (t) {
                                        this.sendErrorResponse(e, 9, t.toString())
                                    }
                                    s && (yield this.miDebugger.sendCommand("exec-continue"))
                                })),
                                i = () => r(this, void 0, void 0, (function*() {
                                    this.stopped ? yield s(!1): (yield this.miDebugger.sendCommand("exec-interrupt"), this.miDebugger.once("generic-stopped", (() => {
                                        s(!0)
                                    })))
                                }));
                            this.debugReady ? i() : this.miDebugger.once("debug-ready", i)
                        }
                        threadsRequest(e) {
                            return r(this, void 0, void 0, (function*() {
                                if (!this.stopped) return e.body = {
                                    threads: []
                                }, void this.sendResponse(e);
                                try {
                                    const t = yield this.miDebugger.sendCommand("thread-list-ids"), s = t.result("thread-ids").map((e => parseInt(e[1]))), r = t.result("current-thread-id");
                                    r ? this.currentThreadId = parseInt(r) : (yield this.miDebugger.sendCommand(`thread-select ${s[0]}`), this.currentThreadId = s[0]);
                                    const i = (yield Promise.all(s.map((e => this.miDebugger.sendCommand(`thread-info ${e}`))))).map((e => {
                                        let t = e.result("threads");
                                        if (1 === t.length) {
                                            t = t[0];
                                            const e = parseInt(p.MINode.valueOf(t, "id")),
                                                s = p.MINode.valueOf(t, "target-id"),
                                                r = p.MINode.valueOf(t, "details");
                                            return new a.Thread(e, r || s)
                                        }
                                        return null
                                    })).filter((e => null !== e));
                                    e.body = {
                                        threads: i
                                    }, this.sendResponse(e)
                                } catch (t) {
                                    this.sendErrorResponse(e, 1, `Unable to get thread information: ${t}`)
                                }
                            }))
                        }
                        stackTraceRequest(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                try {
                                    const s = yield this.miDebugger.getStack(t.threadId, t.startFrame, t.levels), r = [];
                                    for (const e of s) {
                                        const s = 65535 & (t.threadId << 8 | 255 & e.level),
                                            i = e.file;
                                        let n = this.forceDisassembly || !i;
                                        if (n || (n = !(yield this.checkFileExists(i))), !n && this.activeEditorPath && this.activeEditorPath.startsWith("disassembly://")) {
                                            const t = this.symbolTable.getFunctionByName(e.function, e.fileName);
                                            t && (0, l.encodeDisassembly)(t.name, t.file) === this.activeEditorPath && (n = !0)
                                        }
                                        try {
                                            if (n) {
                                                const t = yield this.getDisassemblyForFunction(e.function, e.fileName);
                                                let i = -1;
                                                if (t.instructions.forEach(((t, s) => {
                                                        t.address === e.address && (i = s + 1)
                                                    })), -1 !== i) {
                                                    const n = (0, l.encodeDisassembly)(t.name, t.file);
                                                    r.push(new a.StackFrame(s, `${e.function}@${e.address}`, new a.Source(t.name, n), i, 0))
                                                } else r.push(new a.StackFrame(s, e.function+"@" + e.address, null, e.line, 0))
                                            } else r.push(new a.StackFrame(s, e.function+"@" + e.address, new a.Source(e.fileName, i), e.line, 0))
                                        } catch (t) {
                                            r.push(new a.StackFrame(s, e.function+"@" + e.address, null, e.line, 0))
                                        }
                                    }
                                    e.body = {
                                        stackFrames: r
                                    }, this.sendResponse(e)
                                } catch (t) {
                                    this.sendErrorResponse(e, 12, `Failed to get Stack Trace: ${t.toString()}`)
                                }
                            }))
                        }
                        configurationDoneRequest(e, t) {
                            this.sendResponse(e)
                        }
                        scopesRequest(e, t) {
                            const s = new Array;
                            s.push(new a.Scope("Local", parseInt(t.frameId), !1)), s.push(new a.Scope("Global", 254, !1)), s.push(new a.Scope("Static", f + parseInt(t.frameId), !1)), e.body = {
                                scopes: s
                            }, this.sendResponse(e)
                        }
                        createVariable(e, t) {
                            return t ? this.variableHandles.create(new b(e, t)) : this.variableHandles.create(e)
                        }
                        findOrCreateVariable(e) {
                            let t;
                            return this.variableHandlesReverse.hasOwnProperty(e.name) ? t = this.variableHandlesReverse[e.name] : (t = this.createVariable(e), this.variableHandlesReverse[e.name] = t), e.isCompound() ? t : 0
                        }
                        getVarObjByName(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                let s;
                                try {
                                    (yield this.miDebugger.varUpdate(t)).result("changelist").forEach((e => {
                                        const t = p.MINode.valueOf(e, "name"),
                                            s = this.variableHandlesReverse[t];
                                        this.variableHandles.get(s).applyChanges(e)
                                    }));
                                    const e = this.variableHandlesReverse[t];
                                    s = this.variableHandles.get(e)
                                } catch (r) {
                                    if (!(r instanceof u.MIError && "Variable object not found" === r.message)) throw r; {
                                        s = yield this.miDebugger.varCreate(e, t);
                                        const r = this.findOrCreateVariable(s);
                                        s.exp = e, s.id = r
                                    }
                                }
                                return s
                            }))
                        }
                        stackVariablesRequest(e, t, s, i) {
                            return r(this, void 0, void 0, (function*() {
                                const r = [];
                                let i;
                                try {
                                    i = yield this.miDebugger.getStackVariables(e, t);
                                    for (const e of i) try {
                                        const t = `var_local_${e.name}`,
                                            s = yield this.getVarObjByName(e.name, t);
                                        r.push(s.toProtocolVariable())
                                    } catch (t) {
                                        r.push({
                                            name: e.name,
                                            value: `<${t}>`,
                                            variablesReference: 0
                                        })
                                    }
                                    s.body = {
                                        variables: r
                                    }, this.sendResponse(s)
                                } catch (e) {
                                    this.sendErrorResponse(s, 1, `Could not expand variable: ${e}`)
                                }
                            }))
                        }
                        globalVariablesRequest(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                const t = this.symbolTable.getGlobalVariables(),
                                    s = [];
                                try {
                                    for (const e of t) {
                                        const t = `var_global_${e.name}`,
                                            r = yield this.getVarObjByName(e.name, t);
                                        s.push(r.toProtocolVariable())
                                    }
                                    e.body = {
                                        variables: s
                                    }, this.sendResponse(e)
                                } catch (t) {
                                    this.sendErrorResponse(e, 1, `Could not get global variable information: ${t}`)
                                }
                            }))
                        }
                        staticVariablesRequest(e, t, s, i) {
                            return r(this, void 0, void 0, (function*() {
                                const r = [];
                                try {
                                    const i = (yield this.miDebugger.getFrame(e, t)).fileName,
                                        n = this.symbolTable.getStaticVariables(i);
                                    for (const e of n) {
                                        const t = `var_static_${i}_${e.name}`,
                                            s = yield this.getVarObjByName(e.name, t);
                                        r.push(s.toProtocolVariable())
                                    }
                                    s.body = {
                                        variables: r
                                    }, this.sendResponse(s)
                                } catch (e) {
                                    this.sendErrorResponse(s, 1, `Could not get global variable information: ${e}`)
                                }
                            }))
                        }
                        variableMembersRequest(e, t, s) {
                            return r(this, void 0, void 0, (function*() {
                                let s;
                                try {
                                    s = yield this.miDebugger.evalExpression(JSON.stringify(e));
                                    try {
                                        let i = (0, h.expandValue)(this.createVariable.bind(this), s.result("value"), e, s);
                                        i ? ("string" == typeof i[0] && (i = [{
                                            name: "<value>",
                                            value: (r = i, "object" == typeof r ? void 0 !== r.length ? r.join(", ") : JSON.stringify(r) : r),
                                            variablesReference: 0
                                        }]), t.body = {
                                            variables: i
                                        }, this.sendResponse(t)) : this.sendErrorResponse(t, 2, "Could not expand variable")
                                    } catch (e) {
                                        this.sendErrorResponse(t, 2, `Could not expand variable: ${e}`)
                                    }
                                } catch (e) {
                                    this.sendErrorResponse(t, 1, `Could not expand variable: ${e}`)
                                }
                                var r
                            }))
                        }
                        variablesRequest(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                let s;
                                if (254 === t.variablesReference) return this.globalVariablesRequest(e, t);
                                if (t.variablesReference >= 256 && t.variablesReference < f) {
                                    const s = 255 & t.variablesReference,
                                        r = (65280 & t.variablesReference) >>> 8;
                                    return this.stackVariablesRequest(r, s, e, t)
                                }
                                if (t.variablesReference >= f && t.variablesReference <= g) {
                                    const s = 255 & t.variablesReference,
                                        r = (65280 & t.variablesReference) >>> 8;
                                    return this.staticVariablesRequest(r, s, e, t)
                                }
                                if (s = this.variableHandles.get(t.variablesReference), "string" == typeof s) return this.variableMembersRequest(s, e, t);
                                if ("object" == typeof s)
                                    if (s instanceof u.VariableObject) {
                                        const t = s;
                                        let r;
                                        try {
                                            r = yield this.miDebugger.varListChildren(s.name);
                                            const i = r.map((e => {
                                                const s = this.findOrCreateVariable(e);
                                                return e.id = s, /^\d+$/.test(e.exp) ? e.fullExp = `${t.fullExp||t.exp}[${e.exp}]` : e.fullExp = `${t.fullExp||t.exp}.${e.exp}`, e.toProtocolVariable()
                                            }));
                                            e.body = {
                                                variables: i
                                            }, this.sendResponse(e)
                                        } catch (t) {
                                            this.sendErrorResponse(e, 1, `Could not expand variable: ${t}`)
                                        }
                                    } else if (s instanceof b) {
                                    const t = s;
                                    if (t.options.arg) {
                                        const s = [];
                                        let i = !0,
                                            n = 0;
                                        const o = () => {
                                                e.body = {
                                                    variables: s
                                                }, this.sendResponse(e)
                                            },
                                            a = () => r(this, void 0, void 0, (function*() {
                                                const r = yield this.miDebugger.evalExpression(JSON.stringify(`${t.name}+${n})`));
                                                try {
                                                    const d = (0, h.expandValue)(this.createVariable.bind(this), r.result("value"), t.name, r);
                                                    if (d)
                                                        if ("string" == typeof d) {
                                                            if ("<nullptr>" === d) {
                                                                if (!i) return o();
                                                                i = !1
                                                            } else if ('"' !== d[0]) return s.push({
                                                                name: "[err]",
                                                                value: d,
                                                                variablesReference: 0
                                                            }), o();
                                                            s.push({
                                                                name: `[${n++}]`,
                                                                value: d,
                                                                variablesReference: 0
                                                            }), a()
                                                        } else s.push({
                                                            name: "[err]",
                                                            value: d,
                                                            variablesReference: 0
                                                        }), o();
                                                    else this.sendErrorResponse(e, 15, "Could not expand variable")
                                                } catch (t) {
                                                    this.sendErrorResponse(e, 14, `Could not expand variable: ${t}`)
                                                }
                                            }));
                                        a()
                                    } else this.sendErrorResponse(e, 13, `Unimplemented variable request options: ${JSON.stringify(t.options)}`)
                                } else e.body = {
                                    variables: s
                                }, this.sendResponse(e);
                                else e.body = {
                                    variables: []
                                }, this.sendResponse(e)
                            }))
                        }
                        evaluateRequest(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                if ("watch" === t.context) try {
                                    const s = `watch_${i.createHash("md5").update(t.expression).digest("hex")}}`,
                                        r = yield this.getVarObjByName(t.expression, s);
                                    e.body = {
                                        result: r.value,
                                        variablesReference: r.id
                                    }, this.sendResponse(e)
                                } catch (t) {
                                    e.body = {
                                        result: `<${t.toString()}>`,
                                        variablesReference: 0
                                    }, this.sendErrorResponse(e, 7, t.toString())
                                } else if ("hover" === t.context) try {
                                    const s = yield this.miDebugger.evalExpression(t.expression);
                                    e.body = {
                                        variablesReference: 0,
                                        result: s.result("value")
                                    }, this.sendResponse(e)
                                } catch (t) {
                                    this.sendErrorResponse(e, 7, t.toString())
                                } else this.miDebugger.sendUserInput(t.expression).then((t => {
                                    e.body = void 0 === t ? {
                                        result: "",
                                        variablesReference: 0
                                    } : {
                                        result: JSON.stringify(t),
                                        variablesReference: 0
                                    }, this.sendResponse(e)
                                }), (t => {
                                    this.sendErrorResponse(e, 8, t.toString())
                                }))
                            }))
                        }
                        setVariableRequest(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                try {
                                    let s = t.name;
                                    const r = this.variableHandles.get(t.variablesReference);
                                    r ? s = `${r.name}.${t.name}` : 254 === t.variablesReference ? s = `var_global_${t.name}` : t.variablesReference >= 256 && t.variablesReference < f ? s = `var_local_${t.name}` : t.variablesReference >= f && t.variablesReference <= g && (s = `var_static_${t.name}`);
                                    const i = yield this.miDebugger.varAssign(s, t.value);
                                    e.body = {
                                        value: i.result("value")
                                    }, this.sendResponse(e)
                                } catch (t) {
                                    this.sendErrorResponse(e, 11, `Could not update variable: ${t}`)
                                }
                            }))
                        }
                        pauseRequest(e, t) {
                            this.miDebugger.interrupt(t.threadId).then((t => {
                                this.sendResponse(e)
                            }), (t => {
                                this.sendErrorResponse(e, 3, `Could not pause: ${t}`)
                            }))
                        }
                        continueRequest(e, t) {
                            this.miDebugger.continue(t.threadId).then((t => {
                                e.body = {
                                    allThreadsContinued: !0
                                }, this.sendResponse(e)
                            }), (t => {
                                this.sendErrorResponse(e, 2, `Could not continue: ${t}`)
                            }))
                        }
                        stepInRequest(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                try {
                                    let s = this.forceDisassembly;
                                    if (!s) {
                                        const e = yield this.miDebugger.getFrame(t.threadId, 0);
                                        if (s = !(yield this.checkFileExists(e.file)), this.activeEditorPath && this.activeEditorPath.startsWith("disassembly://")) {
                                            const t = this.symbolTable.getFunctionByName(e.function, e.fileName);
                                            (0, l.encodeDisassembly)(t.name, t.file) === this.activeEditorPath && (s = !0)
                                        }
                                    }
                                    yield this.miDebugger.step(t.threadId, s), this.sendResponse(e)
                                } catch (t) {
                                    this.sendErrorResponse(e, 6, `Could not step over: ${t}`)
                                }
                            }))
                        }
                        stepOutRequest(e, t) {
                            this.miDebugger.stepOut(t.threadId).then((t => {
                                this.sendResponse(e)
                            }), (t => {
                                this.sendErrorResponse(e, 5, `Could not step out: ${t}`)
                            }))
                        }
                        nextRequest(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                try {
                                    let s = this.forceDisassembly;
                                    if (!s) {
                                        const e = yield this.miDebugger.getFrame(t.threadId, 0);
                                        if (s = !(yield this.checkFileExists(e.file)), this.activeEditorPath && this.activeEditorPath.startsWith("disassembly://")) {
                                            const t = this.symbolTable.getFunctionByName(e.function, e.fileName);
                                            (0, l.encodeDisassembly)(t.name, t.file) === this.activeEditorPath && (s = !0)
                                        }
                                    }
                                    yield this.miDebugger.next(t.threadId, s), this.sendResponse(e)
                                } catch (t) {
                                    this.sendErrorResponse(e, 6, `Could not step over: ${t}`)
                                }
                            }))
                        }
                        checkFileExists(e) {
                            return e ? this.fileExistsCache.has(e) ? Promise.resolve(this.fileExistsCache.get(e)) : new Promise(((t, s) => {
                                n.exists(e, (s => {
                                    this.fileExistsCache.set(e, s), t(s)
                                }))
                            })) : Promise.resolve(!1)
                        }
                    }
                    t.GDBDebugSession = R, a.DebugSession.run(R)
                },
                504: function(e, t, s) {
                    var r = this && this.__awaiter || function(e, t, s, r) {
                        return new(s || (s = Promise))((function(i, n) {
                            function o(e) {
                                try {
                                    d(r.next(e))
                                } catch (e) {
                                    n(e)
                                }
                            }

                            function a(e) {
                                try {
                                    d(r.throw(e))
                                } catch (e) {
                                    n(e)
                                }
                            }

                            function d(e) {
                                var t;
                                e.done ? i(e.value) : (t = e.value, t instanceof s ? t : new s((function(e) {
                                    e(t)
                                }))).then(o, a)
                            }
                            d((r = r.apply(e, t || [])).next())
                        }))
                    };
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.MI2 = t.escape = void 0;
                    const i = s(81),
                        n = s(361),
                        o = s(28),
                        a = s(398);

                    function d(e) {
                        return e.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
                    }
                    t.escape = d;
                    const l = /^(?:\d*|undefined)[\*\+\=]|[\~\@\&\^]/,
                        u = /(?:\d*|undefined)\(gdb\)/,
                        h = /\d+/;

                    function c(e) {
                        return !l.exec(e)
                    }
                    class p extends n.EventEmitter {
                        constructor(e, t) {
                            super(), this.application = e, this.args = t, this.currentToken = 1, this.handlers = {}, this.debugReadyFired = !1
                        }
                        connect(e, t) {
                            return new Promise(((s, r) => {
                                const n = [...this.args],
                                    o = Object.create(process.env);
                                process.env.Innatera_PATH && (o.PATH = process.env.Innatera_PATH, o.Path = process.env.Innatera_PATH), this.process = i.spawn(this.application, n, {
                                    cwd: e,
                                    env: o,
                                    shell: "win32" === process.platform
                                }), this.process.stdout.on("data", this.stdout.bind(this)), this.process.stderr.on("data", this.stderr.bind(this)), this.process.on("exit", (() => {
                                    this.emit("quit")
                                }).bind(this)), this.process.on("error", (e => {
                                    this.emit("launcherror", e)
                                }).bind(this));
                                const a = [this.sendCommand("gdb-set target-async on", !0), ...t.map((e => this.sendCommand(e)))];
                                Promise.all(a).then((() => {
                                    s(!0)
                                }), r)
                            }))
                        }
                        stdout(e) {
                            this.buffer += "string" == typeof e ? e : e.toString("utf8");
                            const t = this.buffer.lastIndexOf("\n"); - 1 !== t && (this.onOutput(this.buffer.substr(0, t)), this.buffer = this.buffer.substr(t + 1)), this.buffer.length && this.onOutputPartial(this.buffer) && (this.buffer = "")
                        }
                        stderr(e) {
                            this.errbuf += "string" == typeof e ? e : e.toString("utf8");
                            const t = this.errbuf.lastIndexOf("\n"); - 1 !== t && (this.onOutputStderr(this.errbuf.substr(0, t)), this.errbuf = this.errbuf.substr(t + 1)), this.errbuf.length && (this.logNoNewLine("stderr", this.errbuf), this.errbuf = "")
                        }
                        onOutputStderr(e) {
                            (e = e.split("\n")).forEach((e => {
                                this.log("stderr", e)
                            }))
                        }
                        onOutputPartial(e) {
                            return !!c(e) && (this.logNoNewLine("stdout", e), !0)
                        }
                        onOutput(e) {
                            (e = e.split("\n")).forEach((e => {
                                if (c(e)) u.exec(e) || this.log("stdout", e);
                                else {
                                    const t = (0, a.parseMI)(e);
                                    this.debugOutput && this.log("log", "GDB -> App: " + JSON.stringify(t));
                                    let s = !1;
                                    void 0 !== t.token && this.handlers[t.token] && (this.handlers[t.token](t), delete this.handlers[t.token], s = !0), !s && t.resultRecords && "error" === t.resultRecords.resultClass && this.log("stderr", t.result("msg") || e), t.outOfBandRecord && (t.outOfBandRecord.forEach((e => {
                                        if (e.isStream) e.content.includes("Innatera: Initialization completed") && (this.debugReadyTimeout = setTimeout((() => {
                                            this.debugReadyFired = !0, this.emit("debug-ready")
                                        }), 200), this.once("generic-stopped", (() => {
                                            this.debugReadyFired || (clearTimeout(this.debugReadyTimeout), this.emit("debug-ready"))
                                        }))), this.log(e.type, e.content);
                                        else if ("exec" === e.type)
                                            if (this.emit("exec-async-output", t), "running" === e.asyncClass) this.emit("running", t);
                                            else if ("stopped" === e.asyncClass) {
                                            const e = t.record("reason");
                                            "breakpoint-hit" === e ? this.emit("breakpoint", t) : "end-stepping-range" === e ? this.emit("step-end", t) : "function-finished" === e ? this.emit("step-out-end", t) : "signal-received" === e ? this.emit("signal-stop", t) : "exited-normally" === e ? this.emit("exited-normally", t) : "exited" === e ? (this.log("stderr", "Program exited with code " + t.record("exit-code")), this.emit("exited-normally", t)) : (this.debugReadyFired && this.log("console", "Not implemented stop reason (assuming exception): " + e), this.emit("stopped", t)), this.emit("generic-stopped", t)
                                        } else this.log("log", JSON.stringify(t));
                                        else if ("notify" === e.type)
                                            if ("thread-created" === e.asyncClass) {
                                                const e = t.result("id"),
                                                    s = t.result("group-id");
                                                this.emit("thread-created", {
                                                    threadId: e,
                                                    threadGroupId: s
                                                })
                                            } else if ("thread-exited" === e.asyncClass) {
                                            const e = t.result("id"),
                                                s = t.result("group-id");
                                            this.emit("thread-exited", {
                                                threadId: e,
                                                threadGroupId: s
                                            })
                                        } else if ("thread-selected" === e.asyncClass) {
                                            const e = t.result("id");
                                            this.emit("thread-selected", {
                                                threadId: e
                                            })
                                        }
                                    })), s = !0), void 0 === t.token && void 0 === t.resultRecords && 0 === t.outOfBandRecord.length && (s = !0), s || this.log("log", "Unhandled: " + JSON.stringify(t))
                                }
                            }))
                        }
                        stop(e = !1) {
                            if (e) {
                                const e = this.process,
                                    t = setTimeout((() => {
                                        process.kill(-e.pid)
                                    }), 1e3);
                                this.process.on("exit", (e => {
                                    clearTimeout(t)
                                }))
                            }
                            this.sendRaw("-gdb-exit")
                        }
                        detach() {
                            const e = this.process,
                                t = setTimeout((() => {
                                    process.kill(-e.pid)
                                }), 1e3);
                            this.process.on("exit", (e => {
                                clearTimeout(t)
                            })), this.sendRaw("-target-detach")
                        }
                        interrupt(e) {
                            return new Promise(((t, s) => {
                                this.sendCommand(`exec-interrupt --thread ${e}`).then((e => {
                                    t("done" === e.resultRecords.resultClass)
                                }), s)
                            }))
                        }
                        continue (e) {
                            return new Promise(((t, s) => {
                                this.sendCommand(`exec-continue --thread ${e}`).then((e => {
                                    t("running" === e.resultRecords.resultClass)
                                }), s)
                            }))
                        }
                        next(e, t) {
                            return new Promise(((s, r) => {
                                const i = t ? "exec-next-instruction" : "exec-next";
                                this.sendCommand(`${i} --thread ${e}`).then((e => {
                                    s("running" === e.resultRecords.resultClass)
                                }), r)
                            }))
                        }
                        step(e, t) {
                            return new Promise(((s, r) => {
                                const i = t ? "exec-step-instruction" : "exec-step";
                                this.sendCommand(`${i} --thread ${e}`).then((e => {
                                    s("running" === e.resultRecords.resultClass)
                                }), r)
                            }))
                        }
                        stepOut(e) {
                            return new Promise(((t, s) => {
                                this.sendCommand(`exec-finish --thread ${e}`).then((e => {
                                    t("running" === e.resultRecords.resultClass)
                                }), s)
                            }))
                        }
                        restart(e) {
                            return this._sendCommandSequence(e)
                        }
                        _sendCommandSequence(e) {
                            return new Promise(((t, s) => {
                                const r = (e => {
                                    0 === e.length && t(!0);
                                    const i = e[0];
                                    this.sendCommand(i).then((t => {
                                        r(e.slice(1))
                                    }), s)
                                }).bind(this);
                                r(e)
                            }))
                        }
                        changeVariable(e, t) {
                            return this.sendCommand("gdb-set var " + e + "=" + t)
                        }
                        setBreakPointCondition(e, t) {
                            return this.sendCommand("break-condition " + e + " " + t)
                        }
                        addBreakPoint(e) {
                            return new Promise(((t, s) => {
                                let r = "";
                                if (e.countCondition)
                                    if (">" === e.countCondition[0]) r += "-i " + h.exec(e.countCondition.substr(1))[0] + " ";
                                    else {
                                        const t = h.exec(e.countCondition)[0];
                                        t.length !== e.countCondition.length ? (this.log("stderr", "Unsupported break count expression: '" + e.countCondition + "'. Only supports 'X' for breaking once after X times or '>X' for ignoring the first X breaks"), r += "-t ") : 0 !== parseInt(t) && (r += "-t -i " + parseInt(t) + " ")
                                    }
                                e.raw ? r += "*" + d(e.raw) : r += '"' + d(e.file) + ":" + e.line + '"', this.sendCommand(`break-insert ${r}`).then((r => {
                                    if ("done" === r.resultRecords.resultClass) {
                                        const i = parseInt(r.result("bkpt.number"));
                                        e.number = i, e.condition ? this.setBreakPointCondition(i, e.condition).then((s => {
                                            "done" === s.resultRecords.resultClass ? t(e) : t(null)
                                        }), s) : t(e)
                                    } else t(null)
                                }), s)
                            }))
                        }
                        removeBreakpoints(e) {
                            return new Promise(((t, s) => {
                                if (0 === e.length) t(!0);
                                else {
                                    const r = "break-delete " + e.join(" ");
                                    this.sendCommand(r).then((e => {
                                        t("done" === e.resultRecords.resultClass)
                                    }), s)
                                }
                            }))
                        }
                        getFrame(e, t) {
                            return new Promise(((s, r) => {
                                const i = `stack-info-frame --thread ${e} --frame ${t}`;
                                this.sendCommand(i).then((e => {
                                    const t = e.result("frame"),
                                        r = a.MINode.valueOf(t, "level"),
                                        i = a.MINode.valueOf(t, "addr"),
                                        n = a.MINode.valueOf(t, "func"),
                                        o = a.MINode.valueOf(t, "file"),
                                        d = a.MINode.valueOf(t, "fullname");
                                    let l = 0;
                                    const u = a.MINode.valueOf(t, "line");
                                    u && (l = parseInt(u)), s({
                                        address: i,
                                        fileName: o,
                                        file: d,
                                        function: n,
                                        level: r,
                                        line: l
                                    })
                                }), r)
                            }))
                        }
                        getStack(e, t, s) {
                            return new Promise(((r, i) => {
                                this.sendCommand(`stack-list-frames --thread ${e} ${t} ${s}`).then((e => {
                                    const t = e.result("stack"),
                                        s = [];
                                    t.forEach((e => {
                                        const t = a.MINode.valueOf(e, "@frame.level"),
                                            r = a.MINode.valueOf(e, "@frame.addr"),
                                            i = a.MINode.valueOf(e, "@frame.func"),
                                            n = a.MINode.valueOf(e, "@frame.file"),
                                            o = a.MINode.valueOf(e, "@frame.fullname");
                                        let d = 0;
                                        const l = a.MINode.valueOf(e, "@frame.line");
                                        l && (d = parseInt(l));
                                        const u = parseInt(a.MINode.valueOf(e, "@frame.from"));
                                        s.push({
                                            address: r,
                                            fileName: n,
                                            file: o,
                                            function: i || u,
                                            level: t,
                                            line: d
                                        })
                                    })), r(s)
                                }), i)
                            }))
                        }
                        getStackVariables(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                const s = (yield this.sendCommand(`stack-list-variables --thread ${e} --frame ${t} --simple-values`)).result("variables"),
                                    r = [];
                                for (const e of s) {
                                    const t = a.MINode.valueOf(e, "name"),
                                        s = a.MINode.valueOf(e, "value"),
                                        i = a.MINode.valueOf(e, "type");
                                    r.push({
                                        name: t,
                                        valueStr: s,
                                        type: i,
                                        raw: e
                                    })
                                }
                                return r
                            }))
                        }
                        examineMemory(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                let s = "",
                                    r = e;
                                for (; t > 0;) {
                                    const e = t > 1024 ? 1024 : t;
                                    s += (yield this.sendCommand(`data-read-memory-bytes 0x${r.toString(16)} ${e}`)).result("memory[0].contents"), t -= e, r += e
                                }
                                return s
                            }))
                        }
                        evalExpression(e) {
                            return new Promise(((t, s) => {
                                this.sendCommand("data-evaluate-expression " + e).then((e => {
                                    t(e)
                                }), s)
                            }))
                        }
                        varCreate(e, t = "-") {
                            return r(this, void 0, void 0, (function*() {
                                const s = yield this.sendCommand(`var-create ${t} @ "${e}"`);
                                return new o.VariableObject(s.result(""))
                            }))
                        }
                        varEvalExpression(e) {
                            return r(this, void 0, void 0, (function*() {
                                return this.sendCommand(`var-evaluate-expression ${e}`)
                            }))
                        }
                        varListChildren(e) {
                            return r(this, void 0, void 0, (function*() {
                                return ((yield this.sendCommand(`var-list-children --all-values ${e}`)).result("children") || []).map((e => new o.VariableObject(e[1])))
                            }))
                        }
                        varUpdate(e = "*") {
                            return r(this, void 0, void 0, (function*() {
                                return this.sendCommand(`var-update --all-values ${e}`)
                            }))
                        }
                        varAssign(e, t) {
                            return r(this, void 0, void 0, (function*() {
                                return this.sendCommand(`var-assign ${e} ${t}`)
                            }))
                        }
                        logNoNewLine(e, t) {
                            this.emit("msg", e, t)
                        }
                        log(e, t) {
                            this.emit("msg", e, "\n" === t[t.length - 1] ? t : t + "\n")
                        }
                        sendUserInput(e) {
                            return e.startsWith("-") ? this.sendCommand(e.substr(1)) : this.sendCommand(`interpreter-exec console "${e}"`)
                        }
                        sendRaw(e) {
                            this.printCalls && this.log("log", e), this.process.stdin.write(e + "\n")
                        }
                        sendCommand(e, t = !1) {
                            const s = this.currentToken++;
                            return new Promise(((r, i) => {
                                this.handlers[s] = s => {
                                    s && s.resultRecords && "error" === s.resultRecords.resultClass ? t ? (this.log("stderr", `WARNING: Error executing command '${e}'`), r(s)) : i(new o.MIError(s.result("msg") || "Internal error", e)) : r(s)
                                }, this.sendRaw(s + "-" + e)
                            }))
                        }
                        isReady() {
                            return !!this.process
                        }
                    }
                    t.MI2 = p
                },
                398: (e, t) => {
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.parseMI = t.MINode = void 0;
                    const s = /^[0-7]{3}/;
                    class r {
                        constructor(e, t, s) {
                            this.token = e, this.outOfBandRecord = t, this.resultRecords = s
                        }
                        static valueOf(e, t) {
                            if (!e) return;
                            const s = /^\.?([a-zA-Z_\-][a-zA-Z0-9_\-]*)/,
                                r = /^\[(\d+)\](?:$|\.)/;
                            if (!(t = t.trim())) return e;
                            let i = e;
                            do {
                                let e = s.exec(t);
                                if (e) {
                                    if (t = t.substr(e[0].length), !i.length || "string" == typeof i) return; {
                                        const t = [];
                                        for (const s of i) s[0] === e[1] && t.push(s[1]);
                                        if (t.length > 1) i = t;
                                        else {
                                            if (1 !== t.length) return;
                                            i = t[0]
                                        }
                                    }
                                } else if ("@" === t[0]) i = [i], t = t.substr(1);
                                else {
                                    if (e = r.exec(t), !e) return; {
                                        t = t.substr(e[0].length);
                                        const s = parseInt(e[1]);
                                        if (i.length && "string" != typeof i && s >= 0 && s < i.length) i = i[s];
                                        else if (0 !== s) return
                                    }
                                }
                                t = t.trim()
                            } while (t);
                            return i
                        }
                        record(e) {
                            if (this.outOfBandRecord) return r.valueOf(this.outOfBandRecord[0].output, e)
                        }
                        result(e) {
                            if (this.resultRecords) return r.valueOf(this.resultRecords.results, e)
                        }
                    }
                    t.MINode = r;
                    const i = /^(?:(\d*|undefined)([\*\+\=])|([\~\@\&]))/,
                        n = /^(\d*)\^(done|running|connected|error|exit)/,
                        o = /^\r\n?/,
                        a = /^([a-zA-Z_\-][a-zA-Z0-9_\-]*)/,
                        d = /^(.*?),/;
                    t.parseMI = function(e) {
                        let t;
                        const l = [];
                        let u;
                        const h = {
                                "*": "exec",
                                "+": "status",
                                "=": "notify"
                            },
                            c = {
                                "~": "console",
                                "@": "target",
                                "&": "log"
                            },
                            p = () => {
                                if ('"' !== e[0]) return "";
                                let t, r = 1,
                                    i = !0,
                                    n = e.substr(1),
                                    o = !1;
                                for (; i;) o ? o = !1 : "\\" === n[0] ? o = !0 : '"' === n[0] && (i = !1), n = n.substr(1), r++;
                                try {
                                    t = function(e) {
                                        const t = Buffer.alloc(4 * e.length);
                                        let r = 0;
                                        if ('"' !== e[0] || '"' !== e[e.length - 1]) throw new Error("Not a valid string");
                                        e = e.slice(1, -1);
                                        let i = !1;
                                        for (let n = 0; n < e.length; n++)
                                            if (i) {
                                                let o;
                                                "\\" === e[n] ? r += t.write("\\", r) : '"' === e[n] ? r += t.write('"', r) : "'" === e[n] ? r += t.write("'", r) : "n" === e[n] ? r += t.write("\n", r) : "r" === e[n] ? r += t.write("\r", r) : "t" === e[n] ? r += t.write("\t", r) : "b" === e[n] ? r += t.write("\b", r) : "f" === e[n] ? r += t.write("\f", r) : "v" === e[n] ? r += t.write("\v", r) : "0" === e[n] ? r += t.write("\0", r) : (o = s.exec(e.substr(n))) ? (t.writeUInt8(parseInt(o[0], 8), r++), n += 2) : r += t.write(e[n], r), i = !1
                                            } else if ("\\" === e[n]) i = !0;
                                        else {
                                            if ('"' === e[n]) throw new Error("Not a valid string");
                                            r += t.write(e[n], r)
                                        }
                                        return t.slice(0, r).toString("utf8")
                                    }(e.substr(0, r))
                                } catch (s) {
                                    t = e.substr(0, r)
                                }
                                return e = e.substr(r), t
                            };
                        let m, b, f, g, v;
                        for (m = () => '"' === e[0] ? p() : "{" === e[0] || "[" === e[0] ? (() => {
                                if ("{" !== e[0] && "[" !== e[0]) return;
                                const t = "[" === e[0];
                                if ("}" === (e = e.substr(1))[0] || "]" === e[0]) return e = e.substr(1), [];
                                if (t) {
                                    let t = m();
                                    if (t) {
                                        const s = [];
                                        for (s.push(t); void 0 !== (t = f());) s.push(t);
                                        return e = e.substr(1), s
                                    }
                                }
                                let s = g();
                                if (s) {
                                    const t = [];
                                    for (t.push(s); s = b();) t.push(s);
                                    return e = e.substr(1), t
                                }
                                e = (t ? "[" : "{") + e
                            })() : void 0, g = () => {
                                const t = a.exec(e);
                                if (t) return e = e.substr(t[0].length + 1), [t[1], m()]
                            }, f = () => {
                                if ("," === e[0]) return e = e.substr(1), m()
                            }, b = () => {
                                if ("," === e[0]) return e = e.substr(1), g()
                            }; v = i.exec(e);) {
                            if (e = e.substr(v[0].length), v[1] && void 0 === t && "undefined" !== v[1] && (t = parseInt(v[1])), v[2]) {
                                const t = d.exec(e);
                                e = e.substr(t[1].length);
                                const s = {
                                    isStream: !1,
                                    type: h[v[2]],
                                    asyncClass: t[1],
                                    output: []
                                };
                                let r;
                                for (; r = b();) s.output.push(r);
                                l.push(s)
                            } else if (v[3]) {
                                const e = {
                                    isStream: !0,
                                    type: c[v[3]],
                                    content: p()
                                };
                                l.push(e)
                            }
                            e = e.replace(o, "")
                        }
                        if (v = n.exec(e)) {
                            let s;
                            for (e = e.substr(v[0].length), v[1] && void 0 === t && (t = parseInt(v[1])), u = {
                                    resultClass: v[2],
                                    results: []
                                }; s = b();) u.results.push(s);
                            e = e.replace(o, "")
                        }
                        return new r(t, l || [], u)
                    }
                },
                527: (e, t, s) => {
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.SymbolTable = void 0;
                    const r = s(81),
                        i = s(147),
                        n = s(17),
                        o = s(200),
                        a = /^([0-9a-f]{8})\s([lg\ !])([w\ ])([C\ ])([W\ ])([I\ ])([dD\ ])([FfO\ ])\s([^\s]+)\s([0-9a-f]+)\s(.*)\r?$/,
                        d = /^_Z[^\d]*(\d+)(.+)$/,
                        l = {
                            F: o.SymbolType.Function,
                            f: o.SymbolType.File,
                            O: o.SymbolType.Object,
                            " ": o.SymbolType.Normal
                        },
                        u = {
                            l: o.SymbolScope.Local,
                            g: o.SymbolScope.Global,
                            " ": o.SymbolScope.Neither,
                            "!": o.SymbolScope.Both
                        };
                    t.SymbolTable = class {
                        constructor(e, t) {
                            this.toolchainBinDir = e, this.executable = t, this.symbols = []
                        }
                        loadSymbols() {
                            let e = "";
                            if (i.readdirSync(this.toolchainBinDir).forEach((t => {
                                    t.includes("objdump") && i.existsSync(n.join(this.toolchainBinDir, t)) && (e = n.join(this.toolchainBinDir, t))
                                })), !e) throw new Error('Could not find "objdump" program');
                            const t = r.spawnSync(e, ["--syms", this.executable]).stdout.toString().split("\n");
                            let s = null;
                            for (const e of t) {
                                const t = e.match(a);
                                if (!t) continue;
                                const r = l[t[8]],
                                    i = u[t[2]];
                                let n = t[11].trim(),
                                    h = !1;
                                if ("d" === t[7] && "f" === t[8]) s = n;
                                else {
                                    n.startsWith(".hidden") && (n = n.substring(7).trim(), h = !0);
                                    const e = n.match(d);
                                    if (e) {
                                        if (r !== o.SymbolType.Function) continue;
                                        const t = parseInt(e[1]);
                                        if (n = e[2].substr(0, t), e[2].length > t) {
                                            const s = e[2].substr(t).match(/^(\d+)(.+)$/);
                                            s && (n += "::" + s[2].substr(0, parseInt(s[1])))
                                        }
                                    }
                                }
                                this.symbols.push({
                                    address: parseInt(t[1], 16),
                                    type: r,
                                    scope: i,
                                    section: t[9].trim(),
                                    length: parseInt(t[10], 16),
                                    name: n,
                                    file: i === o.SymbolScope.Local ? s : null,
                                    instructions: null,
                                    hidden: h
                                })
                            }
                        }
                        getFunctionAtAddress(e) {
                            const t = this.symbols.filter((t => t.type === o.SymbolType.Function && t.address <= e && t.address + t.length > e));
                            if (t && 0 !== t.length) return t[0]
                        }
                        getFunctionSymbols() {
                            return this.symbols.filter((e => e.type === o.SymbolType.Function))
                        }
                        getGlobalVariables() {
                            return this.symbols.filter((e => e.type === o.SymbolType.Object && e.scope === o.SymbolScope.Global))
                        }
                        getStaticVariables(e) {
                            return this.symbols.filter((t => t.type === o.SymbolType.Object && t.scope === o.SymbolScope.Local && t.file === e))
                        }
                        getFunctionByName(e, t) {
                            let s = this.symbols.filter((s => s.type === o.SymbolType.Function && s.scope === o.SymbolScope.Local && s.name === e && s.file === t));
                            return 0 !== s.length ? s[0] : (s = this.symbols.filter((t => t.type === o.SymbolType.Function && t.scope !== o.SymbolScope.Local && t.name === e)), 0 !== s.length ? s[0] : null)
                        }
                    }
                },
                200: (e, t, s) => {
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.SymbolScope = t.SymbolType = t.TelemetryEvent = t.StoppedEvent = t.AdapterOutputEvent = t.NumberFormat = void 0;
                    const r = s(797);
                    var i, n, o;
                    (i = t.NumberFormat || (t.NumberFormat = {}))[i.Auto = 0] = "Auto", i[i.Hexidecimal = 1] = "Hexidecimal", i[i.Decimal = 2] = "Decimal", i[i.Binary = 3] = "Binary";
                    class a extends r.Event {
                        constructor(e, t) {
                            super("adapter-output", {
                                content: e,
                                type: t
                            })
                        }
                    }
                    t.AdapterOutputEvent = a;
                    class d extends r.Event {
                        constructor(e, t, s) {
                            super("stopped", {
                                reason: e,
                                threadId: t,
                                allThreadsStopped: s
                            })
                        }
                    }
                    t.StoppedEvent = d;
                    class l extends r.Event {
                        constructor(e, t, s, r = {}) {
                            super("record-event", {
                                category: e,
                                action: t,
                                label: s,
                                parameters: r
                            })
                        }
                    }
                    t.TelemetryEvent = l, (o = t.SymbolType || (t.SymbolType = {}))[o.Function = 0] = "Function", o[o.File = 1] = "File", o[o.Object = 2] = "Object", o[o.Normal = 3] = "Normal", (n = t.SymbolScope || (t.SymbolScope = {}))[n.Local = 0] = "Local", n[n.Global = 1] = "Global", n[n.Neither = 2] = "Neither", n[n.Both = 3] = "Both"
                },
                593: (e, t) => {
                    function s(e, t) {
                        let s = 0;
                        const r = e + t - 1;
                        for (let t = e; t <= r; t++) s = (s | 1 << t) >>> 0;
                        return s
                    }
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.encodeDisassembly = t.parseQuery = t.extractBits = t.createMask = t.binaryFormat = t.hexFormat = void 0, t.hexFormat = function(e, t = 8, s = !0) {
                        let r = e.toString(16);
                        for (; r.length < t;) r = "0" + r;
                        return s ? "0x" + r : r
                    }, t.binaryFormat = function(e, t = 0, s = !0, r = !1) {
                        let i = (e >>> 0).toString(2);
                        for (; i.length < t;) i = "0" + i;
                        if (r) {
                            const e = 4 - i.length % 4;
                            for (let t = 0; t < e; t++) i = "0" + i;
                            const t = i.match(/[01]{4}/g);
                            i = t.join(" "), i = i.substring(e)
                        }
                        return s ? "0b" + i : i
                    }, t.createMask = s, t.extractBits = function(e, t, r) {
                        return (e & s(t, r)) >>> t >>> 0
                    }, t.parseQuery = function(e) {
                        const t = {},
                            s = ("?" === e[0] ? e.substr(1) : e).split("&");
                        for (const e of s) {
                            const s = e.split("=");
                            t[decodeURIComponent(s[0])] = decodeURIComponent(s[1] || "")
                        }
                        return t
                    }, t.encodeDisassembly = function(e, t) {
                        let s = "disassembly:///";
                        return t && (s += `${t}:`), s += `${e}.dbgasm?func=${e}&file=${t||""}`, s
                    }
                },
                81: e => {
                    e.exports = require("child_process")
                },
                113: e => {
                    e.exports = require("crypto")
                },
                361: e => {
                    e.exports = require("events")
                },
                147: e => {
                    e.exports = require("fs")
                },
                17: e => {
                    e.exports = require("path")
                },
                512: e => {
                    e.exports = require("timers")
                },
                797: t => {
                    t.exports = e
                }
            },
            s = {};
        return function e(r) {
            var i = s[r];
            if (void 0 !== i) return i.exports;
            var n = s[r] = {
                exports: {}
            };
            return t[r].call(n.exports, n, n.exports, e), n.exports
        }(789)
    })()
}));