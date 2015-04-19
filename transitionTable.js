var Transition = function(value, state, nextState){
  this.value = value;
  this.state = state;
  this.nextState = nextState;
};

var Token = function(value, state){
  this.value = value;
  this.state = state;
};

var Result = function(line, value, code){
  this.line = line;
  this.value = value;
  this.code = code;
};

var ResultMessage = function(code, message){
  this.code = code;
  this.message = message;
};

var TRANSITIONS = [
  // Operadores Logicos
  new Transition('+', 0, 1),
  new Transition('-', 0, 2),
  new Transition('*', 0, 3),
  new Transition('/', 0, 4),

  // Loop
  new Transition('f', 0, 5),
  new Transition('o', 5, 6),
  new Transition('r', 6, 7),

  // Condicional
  new Transition('?', 0, 8),

];

var TOKENS = [
  new Token('+', 1),
  new Token('-', 2),
  new Token('*', 3),
  new Token('/', 4),
  new Token('for', 7),
  new Token('?', 8),
];

var RESULT_MESSAGES = [
  new ResultMessage(1, 'Operador Aritmético'),
  new ResultMessage(2, 'Operador Aritmético'),
  new ResultMessage(3, 'Operador Aritmético'),
  new ResultMessage(4, 'Operador Aritmético'),
  new ResultMessage(7, 'Loop'),
  new ResultMessage(99, 'Palavra Desconhecida'),
];

var RESULTS = [];

var Logger = {
  currentState: function(state){
    console.log('CURRENT_STATE: ' + state);
  },
  transitionTo: function(state){
    console.log('TRANSITION_TO: '+ state);
  },
  tokenIdentified: function(token){
    console.log('TOKEN IDENTIFIED: ' + token.value);
  },
  unknownWord: function(value){
    console.log('UNKNOWN WORD: ' + value);
  }

};

window.LexicalAnalyzer = {
  getNextState: function(char, state){
    for (var i = 0; i < TRANSITIONS.length; i++) {
      if (char === TRANSITIONS[i].value && state === TRANSITIONS[i].state){
        return TRANSITIONS[i].nextState;
      }
    }
    return 0;
  },

  getToken: function(state){
    for (var i = 0; i < TOKENS.length; i++) {
      if (state === TOKENS[i].state){
        return TOKENS[i];
      }
    }
  },

  transitionTo: function(nextState){
    this.state = nextState;
    Logger.transitionTo(nextState);
  },

  nextLine: function(){
    this.line += 1;
  },

  run: function(input, state){
    this.state = 0;
    this.position = 0;
    this.line = 0;

    input = input + ' ';
    for (var i = 0; i < input.length; i++) {
      var char = input[i];
      var currentState = this.state;

      switch(char){

        case ' ':
        var token = this.getToken(this.state);

        if (token) {
          RESULTS.push(new Result(this.line, token.value, currentState));
          this.transitionTo(0);
          Logger.tokenIdentified(token);
        } else {
          word = input.slice(this.position, i);
          RESULTS.push(new Result(this.line, word, 99));
          Logger.unknownWord(word);
        }

        this.position = i + 1;
        break;

        default:
        var nextState = this.getNextState(char, currentState);
        this.transitionTo(nextState);
        break;
      }
    }
  },

  buildResults: function(){
    rows = [];
    for (var i = 0; i < RESULTS.length; i++) {
      row = {};
      row.Linha = RESULTS[i].line;
      row.Valor = RESULTS[i].value;
      row.Codigo = RESULTS[i].code;

      for (var j = 0 ; j < RESULT_MESSAGES.length; j++){
        if (RESULT_MESSAGES[j].code === RESULTS[i].code){
          row.Mensagem = RESULT_MESSAGES[j].message;
        }
      }
      rows.push(row);
    }
    console.table(rows);
  }


};