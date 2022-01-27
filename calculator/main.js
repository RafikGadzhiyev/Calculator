const totalExpression = document.querySelector('.total_expression'); // @type { HTMLSpanElement } 
const currentNumber = document.querySelector('.current_number'); // @type { HTMLSpanElement }
const calculatorButtons = document.querySelectorAll('.calculator_button'); // @type {HTMLButtonElement[]}

const STATE = {
    firstNumber: '0',
    secondNumber: null,
    operation: null,
    prevOperation: null,
    prevNumber: null,
    get fullExpression() {
        return `${this.secondNumber || ''} ${this.operation || ''} ${this.firstNumber || ''}`
    }
}

calculatorButtons.forEach(item => {
    const ACTION = {
        type: item.classList[1],
        value: item.textContent.trim(),
        state: STATE
    }

    item.onclick = () => {
        calculatorButtonsHandler(ACTION);
    }
})

function calculatorButtonsHandler({
    type,
    value,
    state
}) {
    switch (type) {
        case "digit_buttons":
            if (state.operation) {}
            if (state.firstNumber.length < 15) {
                if (state.firstNumber === '0') {
                    state.firstNumber = value;
                } else {
                    state.firstNumber += value;
                }
            }
            break;
        case "operation_buttons":
            if (!state.secondNumber) {
                state.secondNumber = state.firstNumber;
                state.firstNumber = '0';
                state.operation = value;
            } else {
                if (state.firstNumber !== '0') {
                    state.secondNumber = `${getResult(state.operation, state.secondNumber, state.firstNumber)}`;
                    state.firstNumber = '0';
                }
                state.operation = value;
            }
            state.prevNumber = null;
            break;
        case "math_buttons":
            doMath(value);
            break;
        case "dot_button":
            if (!state.firstNumber.includes('.')) {
                state.firstNumber += value;
            }
            break;
        case "equal_button":
            state.prevOperation = state.operation || state.prevOperation;
            state.prevNumber = !state.prevNumber ? state.firstNumber : state.prevNumber;
            if (state.secondNumber === null) {
                state.firstNumber = `${getResult(state.prevOperation, state.prevNumber, state.firstNumber)}`
            } else {
                state.firstNumber = `${getResult(state.operation, state.secondNumber, state.firstNumber)}`;
                state.secondNumber = null;
                state.operation = null;
            }

    }

    update();
}

function update() {
    totalExpression.textContent = STATE.fullExpression;
    currentNumber.textContent = STATE.firstNumber;
}

function doMath(value) {
    if (value === 'C') {
        STATE.firstNumber = '0';
        STATE.secondNumber = null;
        STATE.operation = null;
    } else if (value === '+/-') {
        STATE.firstNumber = +STATE.firstNumber * -1 + '';
    }
}

function getResult(operation, a, b) {
    const OPERATIONS = {
        '+': +a + +b,
        '-': +a - +b,
        'X': +a * +b,
        '/': +a / +b,
        '%': +a * +b / 100
    };

    return OPERATIONS[operation]
}