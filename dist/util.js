"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const TLD = require("tldjs");
function timeUnit(step, name) {
    return { step, name };
}
const TIME_UNITS = [
    timeUnit(1, 'ms'),
    timeUnit(1000, 'seconds'),
    timeUnit(60, 'minutes'),
    timeUnit(60, 'hours'),
    timeUnit(24, 'days'),
    timeUnit(31, 'months'),
    timeUnit((365 / 31), 'years'),
];
const TIME_UNIT_THRESHOLD = 0.95;
function padDate(value, num) {
    const str = value.toString();
    if (str.length >= num) {
        return str;
    }
    const zeroesToAdd = num - str.length;
    return '0'.repeat(zeroesToAdd) + str;
}
//TODO add type check
function getDomainFromURL(url) {
    try {
        return TLD.getDomain(url);
    }
    catch (e) {
    }
    return undefined;
}
exports.getDomainFromURL = getDomainFromURL;
function formatDateTime(datetime) {
    const date = (typeof datetime === 'number') ? new Date(datetime) : datetime;
    const dateStr = `${date.getFullYear()}`
        + `-${padDate(date.getMonth() + 1, 2)}`
        + `-${padDate(date.getDate(), 2)}`;
    const timeStr = `${padDate(date.getHours(), 2)}`
        + `:${padDate(date.getMinutes(), 2)}`
        + `:${padDate(date.getSeconds(), 2)}`
        + `.${padDate(date.getMilliseconds(), 3)}`;
    return `${dateStr} ${timeStr}`;
}
exports.formatDateTime = formatDateTime;
function formatDuration(millis) {
    if (millis < 0) {
        return 'unknown';
    }
    let remaining = millis;
    let nextUnitIndex = 1;
    while (nextUnitIndex < TIME_UNITS.length &&
        remaining / TIME_UNITS[nextUnitIndex].step >= TIME_UNIT_THRESHOLD) {
        remaining = remaining / TIME_UNITS[nextUnitIndex].step;
        nextUnitIndex += 1;
    }
    return `${remaining.toFixed(1)} ${TIME_UNITS[nextUnitIndex - 1].name}`;
}
exports.formatDuration = formatDuration;
function timeoutExecute(millis, promise) {
    return __awaiter(this, void 0, void 0, function* () {
        let timeout = null;
        const result = yield Promise.race([
            (() => __awaiter(this, void 0, void 0, function* () {
                yield new Promise((resolve) => {
                    timeout = setTimeout(resolve, millis);
                });
                throw new Error(`Timeout hit: ${millis}`);
            }))(),
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield promise;
                }
                catch (error) {
                    // Cancel timeout in error case
                    clearTimeout(timeout);
                    throw error;
                }
            }))(),
        ]);
        clearTimeout(timeout); // is there a better way?
        return result;
    });
}
exports.timeoutExecute = timeoutExecute;
function debugGenerator(namespace) {
    const debug = Debug(`puppeteer-cluster: ${namespace}`);
    return debug;
}
exports.debugGenerator = debugGenerator;
const logToConsole = Debug('puppeteer-cluster:log');
logToConsole.log = console.error.bind(console);
function log(msg) {
    logToConsole(msg);
}
exports.log = log;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsK0JBQStCO0FBQy9CLDZCQUE2QjtBQU83QixTQUFTLFFBQVEsQ0FBQyxJQUFZLEVBQUUsSUFBWTtJQUN4QyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0FBQzFCLENBQUM7QUFFRCxNQUFNLFVBQVUsR0FBZTtJQUMzQixRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztJQUNqQixRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQztJQUN6QixRQUFRLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQztJQUN2QixRQUFRLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQztJQUNyQixRQUFRLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztJQUNwQixRQUFRLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQztJQUN0QixRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDO0NBQ2hDLENBQUM7QUFFRixNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQztBQUVqQyxTQUFTLE9BQU8sQ0FBQyxLQUFvQixFQUFFLEdBQVc7SUFDOUMsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdCLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7UUFDbkIsT0FBTyxHQUFHLENBQUM7S0FDZDtJQUNELE1BQU0sV0FBVyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLENBQUM7QUFDekMsQ0FBQztBQUVELHFCQUFxQjtBQUNyQixTQUFnQixnQkFBZ0IsQ0FBQyxHQUFRO0lBQ3JDLElBQUk7UUFDQSxPQUFPLEdBQUcsQ0FBQyxTQUFT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