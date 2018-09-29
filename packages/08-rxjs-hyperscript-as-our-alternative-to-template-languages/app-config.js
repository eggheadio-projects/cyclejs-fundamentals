SystemJS.config({
  map: {
    'app': './src',
    'xstream': 'https://unpkg.com/xstream@10.9.0/',
    'symbol-observable': 'https://unpkg.com/symbol-observable@1.0.4/lib/index.js',
    'Cycle': 'https://unpkg.com/@cycle/run@3.1.0/lib/index.js',
  },
  packages:{
    app:{
      main: 'main'
    },
    xstream:{
      main: 'dist/xstream.js'
    },
    run:{
      main: 'dist/cycle-run.js'
    }
  },
});