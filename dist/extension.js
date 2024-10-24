! function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t(require("copy-paste"), require("vscode"), require("vscode-debugadapter"), require("xml2js")) : "function" == typeof define && define.amd ? define("platformio-vscode-debug", ["copy-paste", "vscode", "vscode-debugadapter", "xml2js"], t) : "object" == typeof exports ? exports["platformio-vscode-debug"] = t(require("copy-paste"), require("vscode"), require("vscode-debugadapter"), require("xml2js")) : e["platformio-vscode-debug"] = t(e["copy-paste"], e.vscode, e["vscode-debugadapter"], e.xml2js)
}(global, (function(e, t, s, r) {
    return (() => {
        "use strict";
        var i = {
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
                    class h extends r.Event {
                        constructor(e, t, s, r = {}) {
                            super("record-event", {
                                category: e,
                                action: t,
                                label: s,
                                parameters: r
                            })
                        }
                    }
                    t.TelemetryEvent = h, (o = t.SymbolType || (t.SymbolType = {}))[o.Function = 0] = "Function", o[o.File = 1] = "File", o[o.Object = 2] = "Object", o[o.Normal = 3] = "Normal", (n = t.SymbolScope || (t.SymbolScope = {}))[n.Local = 0] = "Local", n[n.Global = 1] = "Global", n[n.Neither = 2] = "Neither", n[n.Both = 3] = "Both"
                },
                719: function(e, t, s) {
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
                    }), t.PlatformIODebugConfigurationProvider = void 0;
                    const i = s(100);
                    t.PlatformIODebugConfigurationProvider = class {
                        constructor() {}
                        resolveDebugConfiguration(e, t, s) {
                            return r(this, void 0, void 0, (function*() {
                                return t.cwd = e ? e.uri.fsPath : i.workspace.rootPath, t
                            }))
                        }
                    }
                },
                186: (e, t, s) => {
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.DisassemblyContentProvider = void 0;
                    const r = s(100),
                        i = s(593);
                    t.DisassemblyContentProvider = class {
                        provideTextDocumentContent(e, t) {
                            return new Promise(((t, s) => {
                                const n = (0, i.parseQuery)(e.query);
                                r.debug.activeDebugSession.customRequest("disassemble", {
                                    function: n.func,
                                    file: n.file
                                }).then((e => {
                                    const s = e.instructions;
                                    let r = "";
                                    s.forEach((e => {
                                        r += `${e.address}: ${this.padEnd(15,e.opcodes)} \t${e.instruction}\n`
                                    })), t(r)
                                }), (e => {
                                    r.window.showErrorMessage(e.message), s(e.message)
                                }))
                            }))
                        }
                        padEnd(e, t) {
                            for (let s = t.length; s < e; s++) t += " ";
                            return t
                        }
                    }
                },
                842: (e, t, s) => {
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.DisassemblyTreeProvider = void 0;
                    const r = s(100);
                    t.DisassemblyTreeProvider = class {
                        constructor() {
                            this._onDidChangeTreeData = new r.EventEmitter, this.onDidChangeTreeData = this._onDidChangeTreeData.event, this.forced = !1
                        }
                        refresh() {
                            this._onDidChangeTreeData.fire()
                        }
                        getChildren(e) {
                            if (!r.debug.activeDebugSession) return [];
                            const t = new r.TreeItem("Disassemble function");
                            t.command = {
                                title: "Disassemble function",
                                command: "Innatera-debug.viewDisassembly"
                            };
                            const s = "Switch to " + (this.forced ? "code" : "assembly"),
                                i = new r.TreeItem(s);
                            return i.command = {
                                title: s,
                                command: "Innatera-debug.setForceDisassembly",
                                arguments: [this.forced ? "Auto" : "Forced"]
                            }, [t, i]
                        }
                        getTreeItem(e) {
                            return e
                        }
                        updateForcedState(e) {
                            this.forced = e, this.refresh()
                        }
                        debugSessionStarted() {
                            this.refresh()
                        }
                        debugSessionTerminated() {
                            this.updateForcedState(!1)
                        }
                    }
                },
                103: function(e, t, s) {
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
                    }), t.deactivate = t.activate = void 0;
                    const i = s(316),
                        n = s(100),
                        o = s(200),
                        a = s(593),
                        d = s(719),
                        h = s(186),
                        l = s(842),
                        u = s(791),
                        c = s(558),
                        m = s(632),
                        p = s(755);
                    class f {
                        constructor(e) {
                            this.adapterOutputChannel = null, this.functionSymbols = null, this.context = e, this.registerProvider = new p.RegisterTreeProvider, this.peripheralProvider = new m.PeripheralTreeProvider, this.memoryTreeProvider = new c.MemoryTreeProvider, this.disassemblyTreeProvider = new l.DisassemblyTreeProvider, this.memoryContentProvider = new u.MemoryContentProvider;
                            const t = n.window.createTreeView("Innatera-debug.peripherals", {
                                treeDataProvider: this.peripheralProvider
                            });
                            e.subscriptions.push(n.debug.registerDebugConfigurationProvider("Innatera-debug",
                                new d.PlatformIODebugConfigurationProvider), 
                            t, 
                            t.onDidExpandElement(this.peripheralProvider.onDidExpandElement.bind(this.peripheralProvider)), 
                            t.onDidCollapseElement(this.peripheralProvider.onDidCollapseElement.bind(this.peripheralProvider)), 
                            n.window.registerTreeDataProvider("Innatera-debug.registers", this.registerProvider), 
                            n.window.registerTreeDataProvider("Innatera-debug.memory", this.memoryTreeProvider), 
                            n.window.registerTreeDataProvider("Innatera-debug.disassembly", this.disassemblyTreeProvider), 
                            n.workspace.registerTextDocumentContentProvider("examinememory", this.memoryContentProvider), 
                            n.workspace.registerTextDocumentContentProvider("disassembly", new h.DisassemblyContentProvider), 
                            n.commands.registerCommand("Innatera-debug.peripherals.updateNode", this.peripheralsUpdateNode.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.peripherals.selectedNode", this.peripheralsSelectedNode.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.peripherals.copyValue", this.peripheralsCopyValue.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.peripherals.setFormat", this.peripheralsSetFormat.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.registers.selectedNode", this.registersSelectedNode.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.registers.copyValue", this.registersCopyValue.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.registers.setFormat", this.registersSetFormat.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.registers.UpdateNode", this.registerUpdateNode.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.memory.deleteHistoryItem", this.memoryDeleteHistoryItem.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.memory.ViewType", this.memoryViewType.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.memory.updateNode", this.memoryUpdateItem.bind(this)),     
                            n.commands.registerCommand("Innatera-debug.memory.clearHistory", this.memoryClearHistory.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.examineMemory", this.examineMemory.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.viewDisassembly", this.showDisassembly.bind(this)), 
                            n.commands.registerCommand("Innatera-debug.setForceDisassembly", this.setForceDisassembly.bind(this)), 
                            n.debug.onDidReceiveDebugSessionCustomEvent(this.receivedCustomEvent.bind(this)), 
                            n.debug.onDidStartDebugSession(this.debugSessionStarted.bind(this)), 
                            n.debug.onDidTerminateDebugSession(this.debugSessionTerminated.bind(this)), 
                            n.window.onDidChangeActiveTextEditor(this.activeEditorChanged.bind(this)), 
                            n.window.onDidChangeTextEditorSelection((e => {
                                e && e.textEditor.document.fileName.endsWith(".dbgmem") && this.memoryContentProvider.handleSelection(e)
                            })))
                        }
                        isPIODebugSession() {
                            return n.debug.activeDebugSession && "Innatera-debug" === n.debug.activeDebugSession.type
                        }
                        activeEditorChanged(e) {
                            if (!e || !this.isPIODebugSession()) return;
                            const t = e.document.uri;
                            "file" === t.scheme ? n.debug.activeDebugSession.customRequest("set-active-editor", {
                                path: t.path
                            }) : "disassembly" === t.scheme && n.debug.activeDebugSession.customRequest("set-active-editor", {
                                path: `${t.scheme}://${t.authority}${t.path}`
                            })
                        }
                        showDisassembly() {
                            return r(this, void 0, void 0, (function*() {
                                if (this.isPIODebugSession()) {
                                    if (!this.functionSymbols) try {
                                        const e = yield n.debug.activeDebugSession.customRequest("load-function-symbols");
                                        this.functionSymbols = e.functionSymbols
                                    } catch (e) {
                                        n.window.showErrorMessage("Unable to load symbol table. Disassembly view unavailable.")
                                    }
                                    try {
                                        const e = yield n.window.showInputBox({
                                            placeHolder: "main",
                                            ignoreFocusOut: !0,
                                            prompt: "Function Name to Disassemble"
                                        }), t = this.functionSymbols.filter((t => t.name === e));
                                        let s;
                                        if (1 === t.length) s = (0, a.encodeDisassembly)(t[0].name, t[0].file);
                                        else {
                                            if (!(t.length > 1)) return n.window.showErrorMessage(`No function with name ${e} found.`);
                                            {
                                                const e = yield n.window.showQuickPick(t.map((e => ({
                                                    label: e.name,
                                                    name: e.name,
                                                    file: e.file,
                                                    scope: e.scope,
                                                    description: e.scope === o.SymbolScope.Global ? "Global Scope" : `Static in ${e.file}`
                                                }))), {
                                                    ignoreFocusOut: !0
                                                });
                                                s = (0, a.encodeDisassembly)(e.name, e.file)
                                            }
                                        }
                                        s && n.window.showTextDocument(n.Uri.parse(s))
                                    } catch (e) {
                                        n.window.showErrorMessage("Unable to show disassembly.")
                                    }
                                } else n.window.showErrorMessage("No debugging session available")
                            }))
                        }
                        setForceDisassembly(e) {
                            const t = e => {
                                const t = "Forced" === e;
                                return this.disassemblyTreeProvider.updateForcedState(t), n.debug.activeDebugSession.customRequest("set-force-disassembly", {
                                    force: t
                                })
                            };
                            if (e) return t(e);
                            n.window.showQuickPick([{
                                label: "Auto",
                                description: "Show disassembly for functions when source cannot be located."
                            }, {
                                label: "Forced",
                                description: "Always show disassembly for functions."
                            }], {
                                matchOnDescription: !0,
                                ignoreFocusOut: !0
                            }).then((e => {
                                t(e.label)
                            }), (e => {}))
                        }
                        memoryViewType(e){
                            
                            const t =  n.window.showQuickPick([{
                                label: "Default",
                                description: "Show disassembly for functions when source cannot be located."
                            }, {
                                label: "Half Words",
                                description: "Always show disassembly for functions."
                            },{
                                label: "Full Words",
                                description: "Always show disassembly for functions." 
                            }], {
                                matchOnDescription: !0,
                                ignoreFocusOut: !0
                            }).then((o => {
                                
                                const [p, s] = e.label.split("+");

                                const fileName = `/Memory [${p}+${s}].dbgmem`

                                let PreviousEditors = n.workspace.textDocuments.filter((e => e.fileName === fileName))

                                PreviousEditors.forEach(document => {
                                    n.commands.executeCommand('workbench.action.closeActiveEditor', document.uri);
                                });

                                this.showMemoryContent(p,s,o.label);


                            }))
                        }
                        memoryUpdateItem(e){
                            function f(e) {
                                return /^0x[0-9a-f]{1,8}$/i.test(e) || /^[0-9]+$/i.test(e) ? e : null
                            }

                            const [t, s] = e.label.split("+");
                            const i = n.window.showInputBox({
                            prompt: "Enter the starting Address ",
                            placeHolder:t
                            }).then(p => {
                            if (f(p)) {
                                n.window.showInputBox({
                                placeHolder: "Prefix with 0x for hexadecimal format",
                                ignoreFocusOut: true,
                                prompt: "Update the value at address "
                                }).then(z => {
                                n.debug.activeDebugSession.customRequest("update-memory", {
                                    address : p,
                                    value : z
                                }).then((v => {
                                    
                                    const fileName = `/Memory [${p}+${s}].dbgmem`

                                    let PreviousEditors = n.workspace.textDocuments.filter((e => e.fileName === fileName))

                                    PreviousEditors.forEach(document => {
                                        n.commands.executeCommand('workbench.action.closeActiveEditor', document.uri);
                                    });
                                    this.showMemoryContent(p,s,'Default');
                                }))        
                                });
                            }
                            });
                        }
                        memoryDeleteHistoryItem(e) {
                            const [t, s] = e.label.split("+");
                            this.memoryTreeProvider.deleteHistory(t, s)
                        }
                        memoryClearHistory() {
                            this.memoryTreeProvider.clearHistory()
                        }
                        examineMemory(e, t) {
                            function s(e) {
                                return /^0x[0-9a-f]{1,8}$/i.test(e) || /^[0-9]+$/i.test(e) ? e : null
                            }
                            if (this.isPIODebugSession()) return e && t ? this.showMemoryContent(e, t, 'Default') : void n.window.showInputBox({
                                placeHolder: "Prefix with 0x for hexidecimal format",
                                ignoreFocusOut: !0,
                                prompt: "A start memory address"
                            }).then((e => {
                                s(e) ? n.window.showInputBox({
                                    placeHolder: "Prefix with 0x for hexidecimal format",
                                    ignoreFocusOut: !0,
                                    prompt: "How many bytes to read?"
                                }).then((t => {
                                    s(t) ? (this.memoryTreeProvider.pushHistory(e, t),
                                     this.showMemoryContent(e, t,'Default')) : n.window.showErrorMessage("Invalid length entered")
                                }), (e => {})) : n.window.showErrorMessage("Invalid memory address entered")
                            }), (e => {}));
                            n.window.showErrorMessage("No debugging session available")
                        }
                        showMemoryContent(e, t, s) {
                            n.workspace.openTextDocument(n.Uri.parse(`examinememory:///Memory%20[${e}+${t}].dbgmem?address=${e}&length=${t}&timestamp=${(new Date).getTime()}&viewtype=${s}`)).then((e => {
                                n.window.showTextDocument(e, {
                                    viewColumn: 2,
                                    preview: !1
                                })
                            }), (e => {
                                n.window.showErrorMessage(`Failed to examine memory: ${e}`)
                            }))
                        }
                        peripheralsUpdateNode(e) {
                            e.node.performUpdate().then((e => {
                                e && this.peripheralProvider.refresh()
                            }), (e => {
                                n.window.showErrorMessage(`Unable to update value: ${e.toString()}`)
                            }))
                        }
                        peripheralsSelectedNode(e) {
                            e.recordType !== m.RecordType.Field && (e.expanded = !e.expanded), e.selected().then((e => {
                                e && this.peripheralProvider.refresh()
                            }), (e => {}))
                        }
                        peripheralsCopyValue(e) {
                            const t = e.node.getCopyValue();
                            t && i.copy(t)
                        }
                        peripheralsSetFormat(e) {
                            return r(this, void 0, void 0, (function*() {
                                const t = yield n.window.showQuickPick([{
                                    label: "Auto",
                                    description: "Automatically choose format (Inherits from parent)",
                                    value: o.NumberFormat.Auto
                                }, {
                                    label: "Hex",
                                    description: "Format value in hexidecimal",
                                    value: o.NumberFormat.Hexidecimal
                                }, {
                                    label: "Decimal",
                                    description: "Format value in decimal",
                                    value: o.NumberFormat.Decimal
                                }, {
                                    label: "Binary",
                                    description: "Format value in binary",
                                    value: o.NumberFormat.Binary
                                }]);
                                e.node.setFormat(t.value), this.peripheralProvider.refresh()
                            }))
                        }
                        registersSelectedNode(e) {
                            e.recordType !== p.RecordType.Field && (e.expanded = !e.expanded)
                        }
                        registersCopyValue(e) {
                            const t = e.node.getCopyValue();
                            t && i.copy(t)
                        }
                        registersSetFormat(e) {
                            return r(this, void 0, void 0, (function*() {
                                const t = yield n.window.showQuickPick([{
                                    label: "Auto",
                                    description: "Automatically choose format (Inherits from parent)",
                                    value: o.NumberFormat.Auto
                                }, {
                                    label: "Hex",
                                    description: "Format value in hexidecimal",
                                    value: o.NumberFormat.Hexidecimal
                                }, {
                                    label: "Decimal",
                                    description: "Format value in decimal",
                                    value: o.NumberFormat.Decimal
                                }, {
                                    label: "Binary",
                                    description: "Format value in binary",
                                    value: o.NumberFormat.Binary
                                }]);
                                e.node.setFormat(t.value), this.registerProvider.refresh()
                            }))
                        }
                        registerUpdateNode(e){
                            return r(this, void 0, void 0, (function*() {
                                const t = yield n.window.showInputBox({
                                    prompt:"Enter the Updating Value for the Node"
                                }).then((s=>{
                                    console.error("Value entered  is ", s);
                                    let p;
                                    if (s.match(this.hexRegex)) p = parseInt(s.substr(2), 16);
                                    else if (s.match(this.binaryRegex)) p = parseInt(s.substr(2), 2);
                                    else {
                                        if (!s.match(/^[0-9]+/)) return t("Value entered is not a valid format.");
                                        if (p = parseInt(s, 10), p >= this.maxValue) return t(`Value entered (${p}) is greater than the maximum value of ${this.maxValue}`)
                                    }
                                    e.node.setValue(p), this.registerProvider.refresh()
                                    let [varName, value] = e.label.split(" = ");
                                    n.debug.activeDebugSession.customRequest("update-register", {
                                        label : varName,
                                        value : p
                                    }).then((v => {
                                        console.error("List of registers", v)               
                                    }))               
                                }));
                            }))
                        }
                        debugSessionStarted(e) {
                            "Innatera-debug" === e.type && (this.functionSymbols = null, e.customRequest("get-arguments").then((e => {
                                this.registerProvider.debugSessionStarted(this.context.workspaceState.get("debugRegistersTreeState")), this.peripheralProvider.debugSessionStarted(e.svdPath, this.context.workspaceState.get("debugPeripheralsTreeState")), this.memoryTreeProvider.debugSessionStarted(this.context.workspaceState.get("debugMemoryTreeState")), this.disassemblyTreeProvider.debugSessionStarted()
                            }), (e => {
                                console.error(e)
                            })))
                        }
                        debugSessionTerminated(e) {
                            "Innatera-debug" === e.type && (this.context.workspaceState.update("debugRegistersTreeState", this.registerProvider.dumpSettings()), this.context.workspaceState.update("debugPeripheralsTreeState", this.peripheralProvider.dumpSettings()), this.context.workspaceState.update("debugMemoryTreeState", this.memoryTreeProvider.dumpSettings()), this.registerProvider.debugSessionTerminated(), this.peripheralProvider.debugSessionTerminated(), this.memoryTreeProvider.debugSessionTerminated(), this.disassemblyTreeProvider.debugSessionTerminated())
                        }
                        receivedCustomEvent(e) {
                            if (this.isPIODebugSession()) switch (e.event) {
                                case "custom-stop":
                                    this.receivedStopEvent(e);
                                    break;
                                case "custom-continued":
                                    this.receivedContinuedEvent(e);
                                    break;
                                case "adapter-output":
                                    this.receivedAdapterOutput(e);
                                    break;
                                case "record-event":
                                    this.receivedEvent(e)
                            }
                        }
                        receivedStopEvent(e) {
                            this.peripheralProvider.debugStopped(), this.registerProvider.debugStopped(), n.workspace.textDocuments.filter((e => e.fileName.endsWith(".dbgmem"))).forEach((e => {
                                this.memoryContentProvider.update(e)
                            }))
                        }
                        receivedContinuedEvent(e) {
                            this.peripheralProvider.debugContinued(), this.registerProvider.debugContinued()
                        }
                        receivedEvent(e) {}
                        receivedAdapterOutput(e) {
                            this.adapterOutputChannel || (this.adapterOutputChannel = n.window.createOutputChannel("Adapter Output"));
                            let t = e.body.content;
                            t.endsWith("\n") || (t += "\n"), this.adapterOutputChannel.append(t)
                        }
                    }
                    t.activate = function(e) {
                        return new f(e)
                    }, t.deactivate = function() {}
                },
                791: (e, t, s) => {
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.MemoryContentProvider = void 0;
                    const r = s(100),
                        i = s(593);
                    t.MemoryContentProvider = class {
                        constructor() {
                            this._onDidChange = new r.EventEmitter, this.onDidChange = this._onDidChange.event, this.firstBytePos = 10, this.lastBytePos = this.firstBytePos + 48 - 1, this.firstAsciiPos = this.lastBytePos + 3, this.lastAsciiPos = this.firstAsciiPos + 16, this.smallDecorationType = r.window.createTextEditorDecorationType({
                                borderWidth: "1px",
                                borderStyle: "solid",
                                overviewRulerColor: "blue",
                                overviewRulerLane: r.OverviewRulerLane.Right,
                                light: {
                                    borderColor: "darkblue"
                                },
                                dark: {
                                    borderColor: "lightblue"
                                }
                            })
                        }
                        provideTextDocumentContent(e) {
                            return new Promise(((t, s) => {
                                const n = (0, i.parseQuery)(e.query),
                                    o = n.address.startsWith("0x") ? parseInt(n.address.substring(2), 16) : parseInt(n.address, 10),
                                    a = n.length.startsWith("0x") ? parseInt(n.length.substring(2), 16) : parseInt(n.length, 10),
                                    p = n.viewtype;
                                r.debug.activeDebugSession.customRequest("read-memory", {
                                    address: o,
                                    length: a || 32
                                }).then((e => {
                                    if (p==='Default') this.byteViewType(e, o, a, t)
                                    if (p==='Full Words') this.fullViewType(e, o, a, t)
                                    if (p==='Half Words') this.halfViewType(e, o, a, t)
                                    
                                }), (e => {
                                    r.window.showErrorMessage(`Unable to read memory from ${(0,i.hexFormat)(o,8)} to ${(0,i.hexFormat)(o+a,8)}`), s(e.toString())
                                }))
                            }))
                        }
                        fullViewType(e, o, a, t){
                            const s = e.bytes;
                            let r = o - o % 4;
                            const n = o - r;
                            let d = "";
                            d += "  Offset:    00       04       08       0C         \t\n", d += (0, i.hexFormat)(r, 8, !1) + ": ";
                            let h = "";
                            for (let e = 0; e < n; e++) d += "   ", h += " ";
                            for (let e = 0; e < a; e += 4) {
                                const word = (s[e] << 24) | (s[e + 1] << 16) | (s[e + 2] << 8) | s[e + 3];  // Combine four bytes into a word
                                d += (0, i.hexFormat)(word, 8, !1).toUpperCase() + " ";  // Display word
                                for (let j = 0; j < 4; j++) {
                                    h += (s[e + j] <= 32 || s[e + j] >= 127) ? "." : String.fromCharCode(s[e + j]);
                                }
            
                                if ((o + e) % 16 == 12 && e < a - 4) {
                                    d += "  " + h;
                                    h = "";
                                    d += "\n";
                                    r += 16;
                                    d += (0, i.hexFormat)(r, 8, !1) + ": ";
                                }
                            }
                            const l = (8 - (o + a) % 4) % 4;

                            for (let e = 0; e < l; e++) d += "   ";


                            d += "  " + h, d += "\n", t(d)

                        }
                        halfViewType(e, o, a, t){
                            const s = e.bytes;
                            let r = o - o % 8;
                            const n = o - r;
                            let d = "";
                            d += "  Offset:  00   02   04   06   08   0A   0C   0E   \t\n", d += (0, i.hexFormat)(r, 8, !1) + ": ";
                            let h = "";
                            for (let e = 0; e < n; e++) d += "   ", h += " ";

                            for (let e = 0; e < a; e += 2) {
                                const halfWord = (s[e] << 8) | s[e + 1];  
                                d += (0, i.hexFormat)(halfWord, 4, !1).toUpperCase() + " ";  
                                h += (s[e] <= 32 || s[e] >= 127) ? "." : String.fromCharCode(s[e]);
                                h += (s[e + 1] <= 32 || s[e + 1] >= 127) ? "." : String.fromCharCode(s[e + 1]);

                                if ((o + e) % 16 == 14 && e < a - 2) {
                                    d += "  " + h;
                                    h = "";
                                    d += "\n";
                                    r += 16;
                                    d += (0, i.hexFormat)(r, 8, !1) + ": ";
                                }
                            }
                            const l = (8 - (o + a) % 8) % 8;

                            for (let e = 0; e < l; e++) d += "   ";


                            d += "  " + h, d += "\n", t(d)


                        }
                        byteViewType(e, o, a, t){
                            const s = e.bytes;
                            let r = o - o % 16;
                            const n = o - r;
                            let d = "";
                            d += "  Offset: 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F \t\n", d += (0, i.hexFormat)(r, 8, !1) + ": ";
                            let h = "";
                            for (let e = 0; e < n; e++) d += "   ", h += " ";

                            for (let e = 0; e < a; e++) {
                                const t = s[e];
                                d += (0, i.hexFormat)(t, 2, !1).toUpperCase() + " ", h += t <= 32 || t >= 127 && t <= 159 ? "." : String.fromCharCode(s[e]), (o + e) % 16 == 15 && e < a - 1 && (d += "  " + h, h = "", d += "\n", r += 16, d += (0, i.hexFormat)(r, 8, !1) + ": ")
                            }


                            const l = (16 - (o + a) % 16) % 16;

                            for (let e = 0; e < l; e++) d += "   ";


                            d += "  " + h, d += "\n", t(d)

                        }
                        update(e) {
                            this._onDidChange.fire(e.uri)
                        }
                        getOffset(e) {
                            if (e.line < 1 || e.character < this.firstBytePos) return;
                            let t = 16 * (e.line - 1);
                            const s = e.character - this.firstBytePos;
                            return e.character >= this.firstBytePos && e.character <= this.lastBytePos ? t += Math.floor(s / 3) : e.character >= this.firstAsciiPos && (t += e.character - this.firstAsciiPos), t
                        }
                        getPosition(e, t = !1) {
                            const s = 1 + Math.floor(e / 16);
                            let i = e % 16;
                            return t ? i += this.firstAsciiPos : i = this.firstBytePos + 3 * i, new r.Position(s, i)
                        }
                        getRanges(e, t, s) {
                            const i = this.getPosition(e, s);
                            let n = this.getPosition(t, s);
                            n = new r.Position(n.line, n.character + (s ? 1 : 2));
                            const o = [],
                                a = s ? this.firstAsciiPos : this.firstBytePos,
                                d = s ? this.lastAsciiPos : this.lastBytePos;
                            for (let e = i.line; e <= n.line; ++e) {
                                const t = new r.Position(e, e === i.line ? i.character : a),
                                    s = new r.Position(e, e === n.line ? n.character : d);
                                o.push(new r.Range(t, s))
                            }
                            return o
                        }
                        handleSelection(e) {
                            const t = e.textEditor.document.lineCount;
                            if (e.selections[0].start.line + 1 === t || e.selections[0].end.line + 1 === t) return void e.textEditor.setDecorations(this.smallDecorationType, []);
                            const s = this.getOffset(e.selections[0].start),
                                r = this.getOffset(e.selections[0].end);
                            if (void 0 === s || void 0 === r) return void e.textEditor.setDecorations(this.smallDecorationType, []);
                            let i = this.getRanges(s, r, !1);
                            i = i.concat(this.getRanges(s, r, !0)), e.textEditor.setDecorations(this.smallDecorationType, i)
                        }
                    }
                },
                558: (e, t, s) => {
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.MemoryTreeProvider = void 0;
                    const r = s(100);
                    t.MemoryTreeProvider = class {
                        constructor() {
                            this._onDidChangeTreeData = new r.EventEmitter, this.onDidChangeTreeData = this._onDidChangeTreeData.event, this.history = []
                        }
                        refresh() {
                            this._onDidChangeTreeData.fire()
                        }
                        dumpSettings() {
                            return this.history
                        }
                        getChildren(e) {
                            if (!r.debug.activeDebugSession) return [];
                            if (this.history.length) return this.getHistoryNodes();
                            const t = new r.TreeItem("Enter address...");
                            return t.command = {
                                title: "Enter memory address...",
                                command: "Innatera-debug.examineMemory"
                            }, [t]
                        }
                        getHistoryNodes() {
                            return this.history.map((e => {
                                const t = new r.TreeItem(e);
                                return t.command = {
                                    title: `Examine memory at ${e}`,
                                    command: "Innatera-debug.examineMemory",
                                    arguments: e.split("+")
                                }, t
                            }))
                        }
                        getTreeItem(e) {
                            return e
                        }
                        pushHistory(e, t) {
                            const s = `${e}+${t}`;
                            this.history.includes(s) || (this.history.push(s), this.refresh())
                        }
                        deleteHistory(e, t) {
                            const s = `${e}+${t}`;
                            this.history.includes(s) && (this.history = this.history.filter((e => e !== s)), this.refresh())
                        }
                        clearHistory() {
                            this.history = [], this.refresh()
                        }
                        debugSessionStarted(e) {
                            this.history = e || [], this.refresh()
                        }
                        debugSessionTerminated() {
                            this.history = [], this.refresh()
                        }
                    }
                },
                632: function(e, t, s) {
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
                    }), t.PeripheralTreeProvider = t.FieldNode = t.RegisterNode = t.ClusterNode = t.PeripheralNode = t.BaseNode = t.TreeNode = t.AccessType = t.RecordType = void 0;
                    const i = s(147),
                        n = s(100),
                        o = s(167),
                        a = s(200),
                        d = s(593);
                    var h, l;
                    ! function(e) {
                        e[e.Peripheral = 1] = "Peripheral", e[e.Register = 2] = "Register", e[e.Field = 3] = "Field", e[e.Cluster = 4] = "Cluster"
                    }(h = t.RecordType || (t.RecordType = {})),
                    function(e) {
                        e[e.ReadOnly = 1] = "ReadOnly", e[e.ReadWrite = 2] = "ReadWrite", e[e.WriteOnly = 3] = "WriteOnly"
                    }(l = t.AccessType || (t.AccessType = {}));
                    const u = {
                        "read-only": l.ReadOnly,
                        "write-only": l.WriteOnly,
                        "read-write": l.ReadWrite,
                        writeOnce: l.WriteOnly,
                        "read-writeOnce": l.ReadWrite
                    };
                    class c extends n.TreeItem {
                        constructor(e, t, s, r) {
                            super(e, t), this.label = e, this.collapsibleState = t, this.contextValue = s, this.node = r, this.command = {
                                command: "Innatera-debug.peripherals.selectedNode",
                                arguments: [r],
                                title: "Selected Node"
                            }
                        }
                        get tooltip() {
                            return (this.node ? this.node.description : void 0) || this.label
                        }
                    }
                    t.TreeNode = c;
                    class m {
                        constructor(e) {
                            this.recordType = e, this.expanded = !1, this.format = a.NumberFormat.Auto
                        }
                        selected() {
                            return Promise.resolve(!1)
                        }
                        update() {
                            return Promise.resolve(!1)
                        }
                        performUpdate() {
                            return Promise.resolve(!1)
                        }
                        getChildren() {
                            return []
                        }
                        getTreeNode() {
                            return null
                        }
                        getCopyValue() {
                            return null
                        }
                        registerPerformUpdate(){
                            return Promise.resolve(!1)
                        }
                        setFormat(e) {
                            this.format = e
                        }
                    }

                    function p(e) {
                        return /^0b([01]+)$/i.test(e) ? parseInt(e.substring(2), 2) : /^0x([0-9a-f]+)$/i.test(e) ? parseInt(e.substring(2), 16) : /^[0-9]+/i.test(e) ? parseInt(e, 10) : /^#[0-1]+/i.test(e) ? parseInt(e.substring(1), 2) : void 0
                    }

                    function f(e, t) {
                        if (-1 !== e.indexOf(",")) {
                            const s = e.split(",").map((e => e.trim()));
                            if (s.length !== t) throw new Error("dimIndex Element has invalid specification.");
                            return s
                        }
                        if (/^([0-9]+)\-([0-9]+)$/i.test(e)) {
                            const s = e.split("-").map((e => p(e))),
                                r = s[0];
                            if (s[1] - r + 1 < t) throw new Error("dimIndex Element has invalid specification.");
                            const i = [];
                            for (let e = 0; e < t; e++) i.push(`${r+e}`);
                            return i
                        }
                        if (/^[a-zA-Z]\-[a-zA-Z]$/.test(e)) {
                            const s = e.charCodeAt(0);
                            if (e.charCodeAt(2) - s + 1 < t) throw new Error("dimIndex Element has invalid specification.");
                            const r = [];
                            for (let e = 0; e < t; e++) r.push(String.fromCharCode(s + e));
                            return r
                        }
                        return []
                    }
                    t.BaseNode = m;
                    class g {
                        constructor(e, t, s) {
                            this.name = e, this.description = t, this.value = s
                        }
                    }
                    class b extends m {
                        constructor(e) {
                            super(h.Peripheral), this.name = e.name, this.description = e.description, this.baseAddress = e.baseAddress, this.totalLength = e.totalLength, this.groupName = e.groupName || "", this.resetValue = e.resetValue || 0, this.size = e.size || 32, this.children = []
                        }
                        getTreeNode() {
                            const e = this.name + "  [" + (0, d.hexFormat)(this.baseAddress) + "]";
                            return new c(e, this.expanded ? n.TreeItemCollapsibleState.Expanded : n.TreeItemCollapsibleState.Collapsed, "peripheral", this)
                        }
                        getChildren() {
                            return this.children
                        }
                        setChildren(e) {
                            this.children = e, this.children.sort(((e, t) => e.offset > t.offset ? 1 : -1))
                        }
                        addChild(e) {
                            this.children.push(e), this.children.sort(((e, t) => e.offset > t.offset ? 1 : -1))
                        }
                        getBytes(e, t) {
                            try {
                                return new Uint8Array(this.currentValue.slice(e, e + t))
                            } catch (e) {
                                return new Uint8Array(0)
                            }
                        }
                        getAddress(e) {
                            return this.baseAddress + e
                        }
                        getFormat() {
                            return this.format
                        }
                        update() {
                            return new Promise(((e, t) => {
                                this.expanded ? n.debug.activeDebugSession.customRequest("read-memory", {
                                    address: this.baseAddress,
                                    length: this.totalLength > 32768 ? 32768 : this.totalLength
                                }).then((t => {
                                    this.currentValue = t.bytes, this.children.forEach((e => e.update())), e(!0)
                                }), (e => {
                                    t(e)
                                })) : e(!1)
                            }))
                        }
                        selected() {
                            return this.update()
                        }
                        dumpSettings() {
                            const e = [];
                            return (this.format !== a.NumberFormat.Auto || this.expanded) && e.push({
                                node: `${this.name}`,
                                expanded: this.expanded,
                                format: this.format
                            }), this.children.forEach((t => {
                                e.push(...t.dumpSettings(`${this.name}`))
                            })), e
                        }
                        _findByPath(e) {
                            if (0 === e.length) return this;
                            {
                                const t = this.children.find((t => t.name === e[0]));
                                return t ? t._findByPath(e.slice(1)) : null
                            }
                        }
                    }
                    t.PeripheralNode = b;
                    class y extends m {
                        constructor(e, t) {
                            super(h.Cluster), this.parent = e, this.name = t.name, this.description = t.description, this.offset = t.addressOffset, this.accessType = t.accessType || l.ReadWrite, this.size = t.size || e.size, this.resetValue = t.resetValue || e.resetValue, this.children = [], this.parent.addChild(this)
                        }
                        getTreeNode() {
                            const e = `${this.name} [${(0,d.hexFormat)(this.offset,0)}]`;
                            return new c(e, this.expanded ? n.TreeItemCollapsibleState.Expanded : n.TreeItemCollapsibleState.Collapsed, "cluster", this)
                        }
                        getChildren() {
                            return this.children
                        }
                        setChildren(e) {
                            this.children = e.slice(0, e.length), this.children.sort(((e, t) => e.offset > t.offset ? 1 : -1))
                        }
                        addChild(e) {
                            this.children.push(e), this.children.sort(((e, t) => e.offset > t.offset ? 1 : -1))
                        }
                        getBytes(e, t) {
                            return this.parent.getBytes(this.offset + e, t)
                        }
                        getAddress(e) {
                            return this.parent.getAddress(this.offset + e)
                        }
                        getFormat() {
                            return this.format !== a.NumberFormat.Auto ? this.format : this.parent.getFormat()
                        }
                        update() {
                            return Promise.resolve(!0)
                        }
                        dumpSettings(e) {
                            const t = [];
                            return (this.format !== a.NumberFormat.Auto || this.expanded) && t.push({
                                node: `${e}.${this.name}`,
                                expanded: this.expanded,
                                format: this.format
                            }), this.children.forEach((s => {
                                t.push(...s.dumpSettings(`${e}.${this.name}`))
                            })), t
                        }
                        _findByPath(e) {
                            if (0 === e.length) return this;
                            {
                                const t = this.children.find((t => t.name === e[0]));
                                return t ? t._findByPath(e.slice(1)) : null
                            }
                        }
                    }
                    t.ClusterNode = y;
                    class v extends m {
                        constructor(e, t) {
                            super(h.Register), this.parent = e, this.name = t.name, this.description = t.description, this.offset = t.addressOffset, this.accessType = t.accessType || e.accessType, this.size = t.size || e.size, this.resetValue = void 0 !== t.resetValue ? t.resetValue : e.resetValue, this.currentValue = this.resetValue, this.hexLength = Math.ceil(this.size / 4), this.maxValue = Math.pow(2, this.size), this.binaryRegex = new RegExp(`^0b[01]{1,${this.size}}$`, "i"), this.hexRegex = new RegExp(`^0x[0-9a-f]{1,${this.hexLength}}$`, "i"), this.children = [], this.parent, this.parent.addChild(this)
                        }
                        reset() {
                            this.currentValue = this.resetValue
                        }
                        extractBits(e, t) {
                            return (0, d.extractBits)(this.currentValue, e, t)
                        }
                        updateBits(e, t, s) {
                            return new Promise(((r, i) => {
                                const n = Math.pow(2, t);
                                if (s > n) return i(`Value entered is invalid. Maximum value for this field is ${n-1} (${(0,d.hexFormat)(n-1,0)})`);
                                {
                                    const n = (0, d.createMask)(e, t),
                                        o = s << e,
                                        a = this.currentValue & ~n | o;
                                    this.updateValueInternal(a).then(r, i)
                                }
                            }))
                        }
                        getTreeNode() {
                            let e = "registerRW";
                            this.accessType === l.ReadOnly ? e = "registerRO" : this.accessType === l.WriteOnly && (e = "registerWO");
                            let t = `${this.name} [${(0,d.hexFormat)(this.offset,0)}]`;
                            if (this.accessType === l.WriteOnly) t += " - <Write Only>";
                            else switch (this.getFormat()) {
                                case a.NumberFormat.Decimal:
                                    t += ` = ${this.currentValue.toString()}`;
                                    break;
                                case a.NumberFormat.Binary:
                                    t += ` = ${(0,d.binaryFormat)(this.currentValue,4*this.hexLength,!1,!0)}`;
                                    break;
                                default:
                                    t += ` = ${(0,d.hexFormat)(this.currentValue,this.hexLength)}`
                            }
                            const s = this.children && this.children.length > 0 ? this.expanded ? n.TreeItemCollapsibleState.Expanded : n.TreeItemCollapsibleState.Collapsed : n.TreeItemCollapsibleState.None;
                            return new c(t, s, e, this)
                        }
                        getChildren() {
                            return this.children || []
                        }
                        setChildren(e) {
                            this.children = e.slice(0, e.length), this.children.sort(((e, t) => e.offset > t.offset ? 1 : -1))
                        }
                        addChild(e) {
                            this.children.push(e), this.children.sort(((e, t) => e.offset > t.offset ? 1 : -1))
                        }
                        getFormat() {
                            return this.format !== a.NumberFormat.Auto ? this.format : this.parent.getFormat()
                        }
                        getCopyValue() {
                            switch (this.getFormat()) {
                                case a.NumberFormat.Decimal:
                                    return this.currentValue.toString();
                                case a.NumberFormat.Binary:
                                    return (0, d.binaryFormat)(this.currentValue, 4 * this.hexLength);
                                default:
                                    return (0, d.hexFormat)(this.currentValue, this.hexLength)
                            }
                        }
                        performUpdate() {
                            return new Promise(((e, t) => {
                                n.window.showInputBox({
                                    prompt: "Enter new value: (prefix hex with 0x, binary with 0b)"
                                }).then((s => {
                                    let r;
                                    if (s.match(this.hexRegex)) r = parseInt(s.substr(2), 16);
                                    else if (s.match(this.binaryRegex)) r = parseInt(s.substr(2), 2);
                                    else {
                                        if (!s.match(/^[0-9]+/)) return t("Value entered is not a valid format.");
                                        if (r = parseInt(s, 10), r >= this.maxValue) return t(`Value entered (${r}) is greater than the maximum value of ${this.maxValue}`)
                                    }
                                    this.updateValueInternal(r).then(e, t)
                                }))
                            }))
                        }
                        updateValueInternal(e) {
                            const t = this.parent.getAddress(this.offset),
                                s = [],
                                r = this.size / 8;
                            for (let t = 0; t < r; t++) {
                                const r = 255 & e;
                                e >>>= 8;
                                let i = r.toString(16);
                                1 === i.length && (i = "0" + i), s[t] = i
                            }
                            return new Promise(((e, r) => {
                                n.debug.activeDebugSession.customRequest("write-memory", {
                                    address: t,
                                    data: s.join("")
                                }).then((t => {
                                    this.parent.update().then((() => {}), (() => {})), e(!0)
                                }), r)
                            }))
                        }
                        update() {
                            const e = this.size / 8,
                                t = this.parent.getBytes(this.offset, e),
                                s = Buffer.from(t);
                            switch (e) {
                                case 1:
                                    this.currentValue = s.readUInt8(0);
                                    break;
                                case 2:
                                    this.currentValue = s.readUInt16LE(0);
                                    break;
                                case 4:
                                    this.currentValue = s.readUInt32LE(0);
                                    break;
                                default:
                                    n.window.showErrorMessage(`Register ${this.name} has invalid size: ${this.size}. Should be 8, 16 or 32.`)
                            }
                            return this.children.forEach((e => e.update())), Promise.resolve(!0)
                        }
                        dumpSettings(e) {
                            const t = [];
                            return (this.format !== a.NumberFormat.Auto || this.expanded) && t.push({
                                node: `${e}.${this.name}`,
                                expanded: this.expanded,
                                format: this.format
                            }), this.children.forEach((s => {
                                t.push(...s.dumpSettings(`${e}.${this.name}`))
                            })), t
                        }
                        _findByPath(e) {
                            return 0 === e.length ? this : 1 === e.length ? this.children.find((t => t.name === e[0])) : null
                        }
                    }
                    t.RegisterNode = v;
                    class w extends m {
                        constructor(e, t) {
                            if (super(h.Field), this.parent = e, this.name = t.name, this.description = t.description, this.offset = t.offset, this.width = t.width, t.accessType ? e.accessType === l.ReadOnly && t.accessType !== l.ReadOnly ? this.accessType = l.ReadOnly : e.accessType === l.WriteOnly && t.accessType !== l.WriteOnly ? this.accessType = l.WriteOnly : this.accessType = t.accessType : this.accessType = e.accessType, t.enumeration) {
                                this.enumeration = t.enumeration, this.enumerationMap = {}, this.enumerationValues = [];
                                for (const e in t.enumeration) {
                                    const s = t.enumeration[e].name;
                                    this.enumerationValues.push(s), this.enumerationMap[s] = e
                                }
                            }
                            this.parent.addChild(this)
                        }
                        getTreeNode() {
                            const e = this.parent.extractBits(this.offset, this.width);
                            let t = null,
                                s = this.name;
                            const r = this.offset;
                            let i = "field";
                            if (s += `[${this.offset+this.width-1}:${r}]`, "reserved" === this.name.toLowerCase()) i = "field-res";
                            else if (this.accessType === l.WriteOnly) s += " - <Write Only>";
                            else {
                                let r = "";
                                switch (this.getFormat()) {
                                    case a.NumberFormat.Decimal:
                                        r = e.toString();
                                        break;
                                    case a.NumberFormat.Binary:
                                        r = (0, d.binaryFormat)(e, this.width);
                                        break;
                                    case a.NumberFormat.Hexidecimal:
                                        r = (0, d.hexFormat)(e, Math.ceil(this.width / 4), !0);
                                        break;
                                    default:
                                        r = this.width >= 4 ? (0, d.hexFormat)(e, Math.ceil(this.width / 4), !0) : (0, d.binaryFormat)(e, this.width)
                                }
                                this.enumeration && this.enumeration[e] ? (t = this.enumeration[e], s += ` = ${t.name} (${r})`) : s += ` = ${r}`
                            }
                            return this.parent.accessType === l.ReadOnly && (i = "field-ro"), new c(s, n.TreeItemCollapsibleState.None, i, this)
                        }
                        performUpdate() {
                            return new Promise(((e, t) => {
                                this.enumeration ? n.window.showQuickPick(this.enumerationValues).then((s => {
                                    if (void 0 === s) return t("Input not selected");
                                    const r = this.enumerationMap[s];
                                    this.parent.updateBits(this.offset, this.width, r).then(e, t)
                                })) : n.window.showInputBox({
                                    prompt: "Enter new value: (prefix hex with 0x, binary with 0b)"
                                }).then((s => {
                                    const r = p(s);
                                    if (void 0 === r) return t("Unable to parse input value.");
                                    this.parent.updateBits(this.offset, this.width, r).then(e, t)
                                }))
                            }))
                        }
                        getCopyValue() {
                            const e = this.parent.extractBits(this.offset, this.width);
                            switch (this.getFormat()) {
                                case a.NumberFormat.Decimal:
                                    return e.toString();
                                case a.NumberFormat.Binary:
                                    return (0, d.binaryFormat)(e, this.width);
                                case a.NumberFormat.Hexidecimal:
                                    return (0, d.hexFormat)(e, Math.ceil(this.width / 4), !0);
                                default:
                                    return this.width >= 4 ? (0, d.hexFormat)(e, Math.ceil(this.width / 4), !0) : (0, d.binaryFormat)(e, this.width)
                            }
                        }
                        getFormat() {
                            return this.format !== a.NumberFormat.Auto ? this.format : this.parent.getFormat()
                        }
                        dumpSettings(e) {
                            return this.format !== a.NumberFormat.Auto ? [{
                                node: `${e}.${this.name}`,
                                format: this.format
                            }] : []
                        }
                        _findByPath(e) {
                            return 0 === e.length ? this : null
                        }
                    }
                    t.FieldNode = w, t.PeripheralTreeProvider = class {
                        constructor() {
                            this._onDidChangeTreeData = new n.EventEmitter, this.onDidChangeTreeData = this._onDidChangeTreeData.event, this.peripherials = [], this.loaded = !1, this.viewExpanded = !1
                        }
                        refresh() {
                            this._onDidChangeTreeData.fire()
                        }
                        dumpSettings() {
                            const e = [];
                            return this.peripherials.forEach((t => {
                                e.push(...t.dumpSettings())
                            })), e
                        }
                        _parseFields(e, t) {
                            const s = [];
                            return e.map((e => {
                                let r, i;
                                const n = e.description ? e.description[0] : "";
                                if (e.bitOffset && e.bitWidth) r = p(e.bitOffset[0]), i = p(e.bitWidth[0]);
                                else if (e.bitRange) {
                                    let t = e.bitRange[0];
                                    t = t.substring(1, t.length - 1), t = t.split(":");
                                    const s = p(t[0]),
                                        n = p(t[1]);
                                    i = s - n + 1, r = n
                                } else {
                                    if (!e.msb || !e.lsb) throw new Error(`Unable to parse SVD file: field ${e.name[0]} must have either bitOffset and bitWidth elements, bitRange Element, or msb and lsb elements.`);
                                    {
                                        const t = p(e.msb[0]),
                                            s = p(e.lsb[0]);
                                        i = t - s + 1, r = s
                                    }
                                }
                                let o = null;
                                e.enumeratedValues && (o = {}, e.enumeratedValues[0].enumeratedValue.map((e => {
                                    if (e.value && e.value.length > 0) {
                                        const t = e.name[0],
                                            s = e.description ? e.description[0] : t,
                                            r = p(e.value[0].toLowerCase());
                                        o[r] = new g(t, s, r)
                                    }
                                })));
                                const a = {
                                    name: e.name[0],
                                    description: n,
                                    offset: r,
                                    width: i,
                                    enumeration: o
                                };
                                if (e.dim) {
                                    if (!e.dimIncrement) throw new Error(`Unable to parse SVD file: field ${e.name[0]} has dim element, with no dimIncrement element.`);
                                    const i = p(e.dim[0]),
                                        n = p(e.dimIncrement[0]);
                                    let o = [];
                                    if (e.dimIndex) o = f(e.dimIndex[0], i);
                                    else
                                        for (let e = 0; e < i; e++) o.push(`${e}`);
                                    const d = e.name[0],
                                        h = r;
                                    for (let e = 0; e < i; e++) {
                                        const r = d.replace("%s", o[e]);
                                        s.push(new w(t, Object.assign(Object.assign({}, a), {
                                            name: r,
                                            offset: h + n * e
                                        })))
                                    }
                                } else s.push(new w(t, Object.assign({}, a)))
                            })), s
                        }
                        _parseRegisters(e, t) {
                            const s = [];
                            return e.forEach((e => {
                                const r = {};
                                if (e.description && (r.description = e.description[0]), e.access && (r.accessType = u[e.access[0]]), e.size && (r.size = p(e.size[0])), e.resetValue && (r.resetValue = p(e.resetValue[0])), e.dim) {
                                    if (!e.dimIncrement) throw new Error(`Unable to parse SVD file: register ${e.name[0]} has dim element, with no dimIncrement element.`);
                                    const i = p(e.dim[0]),
                                        n = p(e.dimIncrement[0]);
                                    let o = [];
                                    if (e.dimIndex) o = f(e.dimIndex[0], i);
                                    else
                                        for (let e = 0; e < i; e++) o.push(`${e}`);
                                    const a = e.name[0],
                                        d = p(e.addressOffset[0]);
                                    for (let h = 0; h < i; h++) {
                                        const i = a.replace("%s", o[h]),
                                            l = new v(t, Object.assign(Object.assign({}, r), {
                                                name: i,
                                                addressOffset: d + n * h
                                            }));
                                        e.fields && 1 === e.fields.length && this._parseFields(e.fields[0].field, l), s.push(l)
                                    }
                                } else {
                                    const i = new v(t, Object.assign(Object.assign({}, r), {
                                        name: e.name[0],
                                        addressOffset: p(e.addressOffset[0])
                                    }));
                                    e.fields && 1 === e.fields.length && this._parseFields(e.fields[0].field, i), s.push(i)
                                }
                            })), s.sort(((e, t) => e.offset < t.offset ? -1 : e.offset > t.offset ? 1 : 0)), s
                        }
                        _parseClusters(e, t) {
                            const s = [];
                            return e ? (e.forEach((e => {
                                const r = {};
                                if (e.description && (r.description = e.description[0]), e.access && (r.accessType = u[e.access[0]]), e.size && (r.size = p(e.size[0])), e.resetValue && (r.resetValue = p(e.resetValue)), e.dim) {
                                    if (!e.dimIncrement) throw new Error(`Unable to parse SVD file: cluster ${e.name[0]} has dim element, with no dimIncrement element.`);
                                    const i = p(e.dim[0]),
                                        n = p(e.dimIncrement[0]);
                                    let o = [];
                                    if (e.dimIndex) o = f(e.dimIndex[0], i);
                                    else
                                        for (let e = 0; e < i; e++) o.push(`${e}`);
                                    const a = e.name[0],
                                        d = p(e.addressOffset[0]);
                                    for (let h = 0; h < i; h++) {
                                        const i = a.replace("%s", o[h]),
                                            l = new y(t, Object.assign(Object.assign({}, r), {
                                                name: i,
                                                addressOffset: d + n * h
                                            }));
                                        e.register && this._parseRegisters(e.register, l), s.push(l)
                                    }
                                } else {
                                    const i = new y(t, Object.assign(Object.assign({}, r), {
                                        name: e.name[0],
                                        addressOffset: p(e.addressOffset[0])
                                    }));
                                    e.register && (this._parseRegisters(e.register, i), s.push(i))
                                }
                            })), s) : []
                        }
                        _parsePeripheral(e, t) {
                            const s = p(e.addressBlock[0].size[0]),
                                r = {
                                    name: e.name[0],
                                    baseAddress: p(e.baseAddress[0]),
                                    description: e.description[0],
                                    totalLength: s
                                };
                            e.access && (r.accessType = u[e.access[0]]), e.size && (r.size = p(e.size[0])), e.resetValue && (r.resetValue = p(e.resetValue[0])), e.groupName && (r.groupName = e.groupName[0]);
                            const i = new b(r);
                            return e.registers[0].register && this._parseRegisters(e.registers[0].register, i), e.registers[0].cluster && this._parseClusters(e.registers[0].cluster, i), i
                        }
                        _loadSVD(e) {
                            return new Promise(((t, s) => {
                                i.readFile(e, "utf8", ((e, r) => {
                                    if (e) return s(e);
                                    o.parseString(r, ((e, r) => {
                                        if (e) return s(e);
                                        try {
                                            const e = {},
                                                s = {
                                                    accessType: l.ReadWrite,
                                                    size: 32,
                                                    resetValue: 0
                                                };
                                            r.device.resetValue && (s.resetValue = p(r.device.resetValue[0])), r.device.size && (s.size = p(r.device.size[0])), r.device.access && (s.accessType = u[r.device.access[0]]), r.device.peripherals[0].peripheral.forEach((t => {
                                                const s = t.name[0];
                                                e[s] = t
                                            }));
                                            for (const t in e) {
                                                const s = e[t];
                                                if (s.$ && s.$.derivedFrom) {
                                                    const r = e[s.$.derivedFrom];
                                                    e[t] = Object.assign(Object.assign({}, r), s)
                                                }
                                            }
                                            this.peripherials = [];
                                            for (const t in e) this.peripherials.push(this._parsePeripheral(e[t], s));
                                            return this.peripherials.sort(((e, t) => e.groupName > t.groupName ? 1 : e.groupName < t.groupName ? -1 : e.name > t.name ? 1 : e.name < t.name ? -1 : 0)), t(!0)
                                        } catch (e) {
                                            return s(e)
                                        }
                                    }))
                                }))
                            }))
                        }
                        _findNodeByPath(e) {
                            const t = e.split("."),
                                s = this.peripherials.find((e => e.name === t[0]));
                            return s ? s._findByPath(t.slice(1)) : null
                        }
                        getTreeItem(e) {
                            return e
                        }
                        getChildren(e) {
                            return this.viewExpanded = !0, n.debug.activeDebugSession ? this.peripherials.length > 0 ? e ? e.node.getChildren().map((e => e.getTreeNode())) : this.peripherials.map((e => e.getTreeNode())) : (this.loaded || this._update(), [new c(this.svdPath ? "Loading..." : "No Information", n.TreeItemCollapsibleState.None, "message", null)]) : []
                        }
                        _load() {
                            return r(this, void 0, void 0, (function*() {
                                if (this.svdPath) return this.loaded = !0, this.peripherials = [], new Promise((e => {
                                    setTimeout((() => r(this, void 0, void 0, (function*() {
                                        try {
                                            yield this._loadSVD(this.svdPath), this.initialSettings && this.initialSettings.forEach((e => {
                                                const t = this._findNodeByPath(e.node);
                                                t && (t.expanded = e.expanded || !1, t.format = e.format)
                                            }))
                                        } catch (e) {
                                            this.peripherials = [], n.window.showErrorMessage(`Unable to parse SVD file: ${e.toString()}`)
                                        }
                                        e(!0)
                                    }))), 1e3)
                                }))
                            }))
                        }
                        _update() {
                            return r(this, void 0, void 0, (function*() {
                                if (this.viewExpanded) {
                                    this.loaded || (yield this._load());
                                    try {
                                        yield Promise.all(this.peripherials.map((e => e.update())))
                                    } catch (e) {}
                                    this.refresh()
                                }
                            }))
                        }
                        onDidExpandElement(e) {
                            e.element.node.expanded = !0, e.element.node.update(), this.refresh()
                        }
                        onDidCollapseElement(e) {
                            e.element.node.expanded = !1
                        }
                        debugSessionStarted(e, t) {
                            this.peripherials = [], this.loaded = !1, this.svdPath = e, this.initialSettings = t
                        }
                        debugSessionTerminated() {
                            this.peripherials = [], this.loaded = !1, this.refresh()
                        }
                        debugStopped() {
                            return this._update()
                        }
                        debugContinued() {}
                    }
                },
                755: (e, t, s) => {
                    Object.defineProperty(t, "__esModule", {
                        value: !0
                    }), t.RegisterTreeProvider = t.FieldNode = t.RegisterNode = t.BaseNode = t.TreeNode = t.RecordType = void 0;
                    const r = s(100),
                        i = s(200),
                        n = s(593);
                    var o;
                    ! function(e) {
                        e[e.Register = 0] = "Register", e[e.Field = 1] = "Field"
                    }(o = t.RecordType || (t.RecordType = {}));
                    class a extends r.TreeItem {
                        constructor(e, t, s, r) {
                            super(e, t), this.label = e, this.collapsibleState = t, this.contextValue = s, this.node = r, this.command = {
                                command: "Innatera-debug.registers.selectedNode",
                                arguments: [r],
                                title: "Selected Node"
                            }
                        }
                    }
                    t.TreeNode = a;
                    class d {
                        constructor(e) {
                            this.recordType = e, this.format = i.NumberFormat.Auto, this.expanded = !1
                        }
                        getChildren() {
                            return []
                        }
                        getTreeNode() {
                            return null
                        }
                        getCopyValue() {
                            return null
                        }
                        setFormat(e) {
                            this.format = e
                        }
                        registerPerformUpdate(){
                            return Promise.resolve(!1)
                        }
                    }
                    t.BaseNode = d;
                    class h extends d {
                        constructor(e, t) {
                            super(o.Register), this.name = e, this.index = t, this.name = this.name, "XPSR" === e.toUpperCase() || "CPSR" === e.toUpperCase() ? this.fields = [new l("Negative Flag (N)", 31, 1, this), new l("Zero Flag (Z)", 30, 1, this), new l("Carry or borrow flag (C)", 29, 1, this), new l("Overflow Flag (V)", 28, 1, this), new l("Saturation Flag (Q)", 27, 1, this), new l("GE", 16, 4, this), new l("Interrupt Number", 0, 8, this), new l("ICI/IT", 25, 2, this), new l("ICI/IT", 10, 6, this), new l("Thumb State (T)", 24, 1, this)] : "CONTROL" === e.toUpperCase() && (this.fields = [new l("FPCA", 2, 1, this), new l("SPSEL", 1, 1, this), new l("nPRIV", 0, 1, this)]), this.currentValue = 0
                        }
                        extractBits(e, t) {
                            return (0, n.extractBits)(this.currentValue, e, t)
                        }
                        getTreeNode() {
                            let e = `${this.name} = `;
                            switch (this.getFormat()) {
                                case i.NumberFormat.Decimal:
                                    e += this.currentValue.toString();
                                    break;
                                case i.NumberFormat.Binary:
                                    e += (0, n.binaryFormat)(this.currentValue, 32, !1, !0);
                                    break;
                                default:
                                    e += (0, n.hexFormat)(this.currentValue, 8)
                            }
                            return this.fields && this.fields.length > 0 ? new a(e, this.expanded ? r.TreeItemCollapsibleState.Expanded : r.TreeItemCollapsibleState.Collapsed, "register", this) : new a(e, r.TreeItemCollapsibleState.None, "register", this)
                        }
                        getChildren() {
                            return this.fields
                        }
                        setValue(e) {
                            this.currentValue = e
                        }
                        getCopyValue() {
                            switch (this.getFormat()) {
                                case i.NumberFormat.Decimal:
                                    return this.currentValue.toString();
                                case i.NumberFormat.Binary:
                                    return (0, n.binaryFormat)(this.currentValue, 32);
                                default:
                                    return (0, n.hexFormat)(this.currentValue, 8)
                            }
                        }
                        getFormat() {
                            return this.format
                        }
                        dumpSettings() {
                            const e = [];
                            return (this.expanded || this.format !== i.NumberFormat.Auto) && e.push({
                                node: this.name,
                                format: this.format,
                                expanded: this.expanded
                            }), this.fields && e.push(...this.fields.map((e => e.dumpSettings())).filter((e => null !== e))), e
                        }
                    }
                    t.RegisterNode = h;
                    class l extends d {
                        constructor(e, t, s, r) {
                            super(o.Field), this.name = e, this.offset = t, this.size = s, this.register = r
                        }
                        getTreeNode() {
                            const e = this.register.extractBits(this.offset, this.size);
                            let t = `${this.name} = `;
                            switch (this.getFormat()) {
                                case i.NumberFormat.Decimal:
                                    t += e.toString();
                                    break;
                                case i.NumberFormat.Binary:
                                    t += (0, n.binaryFormat)(e, this.size, !1, !0);
                                    break;
                                case i.NumberFormat.Hexidecimal:
                                    t += (0, n.hexFormat)(e, Math.ceil(this.size / 4), !0);
                                    break;
                                default:
                                    t += this.size >= 4 ? (0, n.hexFormat)(e, Math.ceil(this.size / 4), !0) : (0, n.binaryFormat)(e, this.size, !1, !0)
                            }
                            return new a(t, r.TreeItemCollapsibleState.None, "field", this)
                        }
                        getCopyValue() {
                            const e = this.register.extractBits(this.offset, this.size);
                            switch (this.getFormat()) {
                                case i.NumberFormat.Decimal:
                                    return e.toString();
                                case i.NumberFormat.Binary:
                                    return (0, n.binaryFormat)(e, this.size);
                                case i.NumberFormat.Hexidecimal:
                                    return (0, n.hexFormat)(e, Math.ceil(this.size / 4), !0);
                                default:
                                    return this.size >= 4 ? (0, n.hexFormat)(e, Math.ceil(this.size / 4), !0) : (0, n.binaryFormat)(e, this.size)
                            }
                        }
                        getFormat() {
                            return this.format === i.NumberFormat.Auto ? this.register.getFormat() : this.format
                        }
                        dumpSettings() {
                            return this.format !== i.NumberFormat.Auto ? {
                                node: `${this.register.name}.${this.name}`,
                                format: this.format
                            } : null
                        }
                    }
                    t.FieldNode = l, t.RegisterTreeProvider = class {
                        constructor() {
                            this._onDidChangeTreeData = new r.EventEmitter, this.onDidChangeTreeData = this._onDidChangeTreeData.event, this.loaded = !1, this.viewExpanded = !1, this.registers = [], this.registerMap = {}
                        }
                        refresh() {
                            this._onDidChangeTreeData.fire()
                        }
                        dumpSettings() {
                            const e = [];
                            return this.registers.forEach((t => {
                                e.push(...t.dumpSettings())
                            })), e
                        }
                        fetchRegisterList() {
                            r.debug.activeDebugSession && (this.loaded ? this._fetchRegisterValues() : r.debug.activeDebugSession.customRequest("read-register-list").then((e => {
                                this.loaded = !0, this.createRegisters(e), this._fetchRegisterValues()
                            })))
                        }
                        _fetchRegisterValues() {
                            r.debug.activeDebugSession.customRequest("read-registers").then((e => {
                                e.forEach((e => {
                                    const t = parseInt(e.number, 10),
                                        s = parseInt(e.value, 16),
                                        r = this.registerMap[t];
                                    r && r.setValue(s)
                                })), this.refresh()
                            }))
                        }
                        getTreeItem(e) {
                            return e.node ? e.node.getTreeNode() : e
                        }
                        createRegisters(e) {
                            this.registerMap = {}, this.registers = [], e.forEach(((e, t) => {
                                if (e) {
                                    const s = new h(e, t);
                                    this.registers.push(s), this.registerMap[t] = s
                                }
                            })), this.initialSettings && this.initialSettings.forEach((e => {
                                if (-1 === e.node.indexOf(".")) {
                                    const t = this.registers.find((t => t.name === e.node));
                                    t && (e.expanded && (t.expanded = e.expanded), e.format && t.setFormat(e.format))
                                } else {
                                    const [t, s] = e.node.split("."), r = this.registers.find((e => e.name === t));
                                    if (r) {
                                        const t = r.getChildren().find((e => e.name === s));
                                        t && e.format && t.setFormat(e.format)
                                    }
                                }
                            })), this.refresh()
                        }
                        updateRegisterValues(e) {
                            e.forEach((e => {
                                this.registerMap[e.number].setValue(e.value)
                            })), this.refresh()
                        }
                        getChildren(e) {
                            return this.viewExpanded = !0, r.debug.activeDebugSession ? this.registers.length > 0 ? e ? e.node.getChildren().map((e => e.getTreeNode())) : this.registers.map((e => e.getTreeNode())) : (this.loaded || setTimeout((() => this.fetchRegisterList()), 1e3), [new a("Loading...", r.TreeItemCollapsibleState.None, "message", null)]) : []
                        }
                        debugSessionTerminated() {
                            this.loaded = !1, this.registers = [], this.registerMap = {}, this.refresh()
                        }
                        debugSessionStarted(e) {
                            this.loaded = !1, this.registers = [], this.registerMap = {}, this.initialSettings = e
                        }
                        debugStopped() {
                            this.viewExpanded && this.fetchRegisterList()
                        }
                        debugContinued() {}
                    }
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
                147: e => {
                    e.exports = require("fs")
                },
                316: t => {
                    t.exports = e
                },
                100: e => {
                    e.exports = t
                },
                797: e => {
                    e.exports = s
                },
                167: e => {
                    e.exports = r
                }
            },
            n = {};
        return function e(t) {
            var s = n[t];
            if (void 0 !== s) return s.exports;
            var r = n[t] = {
                exports: {}
            };
            return i[t].call(r.exports, r, r.exports, e), r.exports
        }(103)
    })()
}));