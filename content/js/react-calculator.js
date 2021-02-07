const ADD = '+';
const SUBTRACT = '-';
const MULTIPLY = '*';
const DIVIDE = '/';

const kPrecedenceGroups = [
  [MULTIPLY, DIVIDE], [ADD, SUBTRACT],
];

const kNumbers = [
  {
    number: 7,
    name: "seven",
  },
  {
    number: 8,
    name: "eight",
  },
  {
    number: 9,
    name: "nine",
  },
  {
    number: 4,
    name: "four",
  },
  {
    number: 5,
    name: "five",
  },
  {
    number: 6,
    name: "six",
  },
  {
    number: 1,
    name: "one",
  },
  {
    number: 2,
    name: "two",
  },
  {
    number: 3,
    name: "three",
  },
  {
    number: 0,
    name: "zero",
  },
];

function evalTerm(a, b, op)
{
  if (Array.isArray(a))
    a = [...a];
  if (Array.isArray(b))
    b = [...b];
  
  let result = 0;
  switch (op)
  {
    case ADD:
        result = a + b;
       break;
    case SUBTRACT:
        result = a - b;
      break;
    case MULTIPLY:
        result = a * b;
      break;
    case DIVIDE:
        if (b === 0)
           result = NaN;
        result = a / b;
      break;
    default:
      break;
  }
  return result;
}

function expContainsOpGroup(exp, group)
{
  for (let i = 0; i < exp.length; i++)
  {
    for (let j = 0; j < group.length; j++)
    {
      if (exp[i] === group[j])
        return true;
    }
  }
  return false;
}

function getOpIndex(exp, group)
{
  for (let i = 0; i < exp.length; i++)
  {
    for (let j = 0; j < group.length; j++)
    {
      if (exp[i] === group[j])
        return i;
    }
  }
  return -1;
}

function evalFormula(f) {
  if (!Array.isArray(f))
    return f;
  
  f = [...f];
  
  if (f.length === 0)
    return 0;
  
  else if (f.length === 1)
    return f[0];
  
  for (let i = 0; i < 2; i++)
  {
    while (expContainsOpGroup(f, kPrecedenceGroups[i]))
    {
      const opIndex = getOpIndex(f, kPrecedenceGroups[i]);
      
      const a = f[opIndex-1];
      const b = f[opIndex+1];
      const op = f[opIndex];

      const result = evalTerm(a, b, op);

      // Remove evaluated values from formula and insert the result
      f.splice(opIndex-1, 3, result);
    }
  }
  
  return f[0];
}

class Calculator extends React.Component
{
  constructor(props)
  {
    super(props);
    
    this.state = {
      answer: 0,
      formula: [],
    };
    
    this.clear = this.clear.bind(this);
    this.back = this.back.bind(this);
    this.calculate = this.calculate.bind(this);
    this.insertNumber = this.insertNumber.bind(this);
    this.insertOp = this.insertOp.bind(this);
    this.insertDecimal = this.insertDecimal.bind(this);
    
    this.currentNumber = '';
    this.negate = false;
  }
  
  insertDecimal() {
    for (let i = 0; i < this.currentNumber.length; i++)
      if (this.currentNumber[i] === ".")
        return;
    this.currentNumber += ".";
    this.setState({
      answer: this.currentNumber,
    });
  }
  
  back()
  {
    this.currentNumber = this.currentNumber.slice(0, this.currentNumber.length-1);
    
    this.setState((s) => {
      return {
        answer: parseFloat(this.currentNumber),
      }
    });
  }
  
  calculate(formula)
  {    
    const result = evalFormula(formula.concat(parseFloat(this.currentNumber)));
    this.setState({
      answer: result,
      formula: [],
    });
    
    this.currentNumber = result;
    
    this.negate = false;
  }
  
  insertOp(op) {
    if (op === '-' && this.currentNumber === '')
    {
      const lastEntry = this.state.formula[this.state.formula.length-1];
    
      if (lastEntry === '/' || lastEntry === '*' || lastEntry === '+' || lastEntry === '-')
      {
        this.negate = true;
        return;
      }
    }
    else if (op === '+' &&  this.negate)
      this.negate = false;
    
    const lastEntry = this.state.formula[this.state.formula.length-1];
    
    if (this.currentNumber === '' && (lastEntry === '/' || lastEntry === '*' || lastEntry === '+' || lastEntry === '-'))
    {
      this.setState((s) => {
        s.formula.pop();
        return {
         formula: s.formula.concat(op),
        };
      });
      return;
    }
    
    const num = parseFloat(this.currentNumber);
    
    this.setState((s) =>{
      return {
        formula: s.formula.concat(num).concat(op),
      };
    });
    this.currentNumber = '';
  }
  
  clear()
  {
    this.setState({
      answer: 0,
      formula: [],
    });
    this.currentNumber = '';
    this.negate = false;
  }
  
  insertNumber(n) {
    if (this.currentNumber === '') {
      this.currentNumber = this.negate ? "-" + n.toString() : n.toString();
      this.negate = false;
    }
    else if (this.currentNumber != 0)
      this.currentNumber += n.toString();
    
    this.setState((s) => {
      return {
        answer: this.currentNumber,
      };
    });
  }
  
  render()
  {
    const numberDivs = kNumbers.map(
      (n) => <div onClick={()=>this.insertNumber(n.number)} className="number" id={n.name}>{n.number}</div>
    );
    
    return (
      <div className="grid-container">
        <div id="display">
          {this.state.answer}
        </div>
        <div id="formula">
          [{this.state.formula.length}] {this.state.formula}
        </div>
        <div onClick={this.clear} id="clear">ac</div>
        <div onClick={this.back} id="back">bk</div>
        <div id="ops">
          <div onClick={() => this.insertOp(ADD)} id="add">+</div>
          <div onClick={() => this.insertOp(SUBTRACT)} id="subtract">-</div>
          <div onClick={() => this.insertOp(MULTIPLY)} id="multiply">*</div>
          <div onClick={() => this.insertOp(DIVIDE)} id="divide">/</div>
        </div>
        <div onClick={() => this.calculate(this.state.formula)} id="equals">=</div>
        {numberDivs}
        <div onClick={this.insertDecimal} id="decimal">.</div>
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));