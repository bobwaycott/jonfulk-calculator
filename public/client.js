function Calculator(display) {
  this.$displayElement = display;
  this.displayMax = 13;
  this.display = '0';
  this.floats = {last: null, current: 0.0};
  this.operators = {last: null, current: null};
  this.reset = false;
}

Calculator.prototype = {
  do: function(btn) {
    // perform an operation based on what button was pressed
    switch(btn) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '=':
        this.doMath(btn);
        break;
      case 'AC':
        this.allClear();
        break;
      case 'C':
        this.clear();
        break;
      case '+/-':
        this.reverseSign();
        break;
      case '%':
        console.log('TODO: make this work.');
        break;
      default:
        this.updateState(btn);
        break;
    }
  },
  updateString: function(input) {
    // Update stringVal
    if (this.display.length < this.displayMax) {
      // don't accept input that will cause displayMax
      // to be exceeded
      if (this.display === '0') {
        // handle all input when stringVal is zero
        if (input !== '0' && input !== '.') {
          // if we have a non-zero number, set stringVal
          this.display = input;
        } else if (input === '.') {
          // if we have a dot, append stringVal
          this.display += input;
        }
      } else if (this.display !== '0') {
        // handle all input when stringVal is non-zero
        if ((this.display.indexOf('.') === -1) || (input !== '.')) {
          // protect against adding a decimal point
          this.display += input;
        }
      } else {
        // we don't like this input
        alert('Invalid input');
      }
    }
    else {
      alert('Max input length reached.');
    }
  },
  updateCurrentFloat: function() {
    // Simple parse stringVal to float
    this.floats.current = parseFloat(this.display);
  },
  updateState: function(input) {
    // Update calculator string/float vals, then update calc display
    if(this.reset) {
      this.setState(0);
      this.reset = false;
    }
    this.updateString(input);
    this.updateCurrentFloat();
    this.updateDisplay();
  },
  reverseSign: function() {
    var reverse = (this.floats.current * -1);
    //set current float to new sign
    this.setState(reverse);
    this.updateDisplay();
  },
  setState: function(num) {
    // manually set our state after operations
    this.floats.current = parseFloat(num);
    this.display = num.toString();
  },
  resetOperators: function() {
    this.operators = {last: null, current: null};
  },
  updateDisplay: function() {
    // Simple display raw stringVal
    this.$displayElement.html(this.display);
  },
  allClear: function() {
    // Reset calc to default vals
    this.display = '0';
    this.floats = {last: null, current: 0.0};
    this.resetOperators();
    this.updateDisplay();
  },
  clear: function() {
  	// Reset current
    this.display = '0';
    this.floats.current = 0.0;
    this.updateDisplay();
  },
  updateOperators: function(operator) {
    // Manage state of current/last operations
    if (this.operators.current === null) {
    	this.operators.current = operator;
    } else {
    	this.operators.last = this.operators.current;
      this.operators.current = operator;
    }
  },
  prepareOperation: function() {
    // copy current value > last value
    // covers when we press an operator for the first time
    if (this.floats.last === null) {
      this.floats.last = this.floats.current;
    }
    // we have already prepped an operation once
    else {
      if (this.operators.last !== null) {
        // we are chaining operations
        this.doOperation(this.operators.last);
      }
      else {
        // we are performing a single operation (most likely with = btn)
        this.doOperation(this.operators.current);
      }
    }
  },
  doOperation: function(operator) {
    // update calc state with result of pending operation
    switch (operator) {
      case '+':
        this.floats.last += this.floats.current;
        break;
      case '-':
        this.floats.last -= this.floats.current;
        break;
      case '*':
        this.floats.last *= this.floats.current;
        break;
      case '/':
        this.floats.last /= this.floats.current;
        break;
      default:
        console.log('Unknown operation.');
        break;
    }
    // manually set state to operated value
    this.setState(this.floats.last);
  },
  doMath: function(operator) {
    // set operators.current
    this.updateOperators(operator);
    // copy floats/strings.current > floats/strings.last (maybe using operators.last if non-null)
    this.prepareOperation();
    // check if it's time to freeze state
    if (operator === '=') {
      this.resetOperators();
      this.floats.last = null;
    }
    // updateState with inputs to current strings/floats
    this.updateDisplay();
    this.reset = true;
  }
};

//create event handlers

$(document).ready(function() {
  // init calculator & updateDisplay with default value showing
  var calc = new Calculator($('#display-text'));
  calc.updateDisplay();

  //capture events for all buttons
  $('a.btn').on('click', function() {
    calc.do($(this).attr('data-calc'));
  });

});