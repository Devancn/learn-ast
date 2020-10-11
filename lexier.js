
const NUMBERS = /[0-9]/
const Numberic = Symbol('Number');
const Punctuator = Symbol('Punctuator');
let tokens = [];

let currentToken;
// 确定一个新的token
function emit(token) {
    currentToken = { type: '', value: '' }
    tokens.push(token);
}
function start(char) {
    if (NUMBERS.test(char)) {
        currentToken = { type: Number, value: '' }
    }
    return number(char)
}

function number(char) {
    if (NUMBERS.test(char)) {
        currentToken.value += char;
        return number;
    } else if (char === "+" || char === '-') {
        emit(currentToken);
        emit({ type: Punctuator, value: char });
        currentToken = { type: Numberic, value: '' };
        return number;
    }

}
function tokenizer(input) {
    let state = start;
    for (let char of input) {
        state = state(char);
    }
    if (currentToken.value.length > 0) {
        emit(currentToken)
    }
}

tokenizer("10+20");

console.log(tokens);