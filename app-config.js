SystemJS.config({
  packageConfigPaths: ["github:*/*.json", "npm:@*/*.json", "npm:*.json"],
  map: {
    "@cycle/dom": "npm:@cycle/dom@18.1.0",
    "@cycle/run": "npm:@cycle/run@3.2.0",
    assert: "npm:jspm-nodelibs-assert@0.2.1",
    buffer: "npm:jspm-nodelibs-buffer@0.2.3",
    constants: "npm:jspm-nodelibs-constants@0.2.1",
    crypto: "npm:jspm-nodelibs-crypto@0.2.1",
    events: "npm:jspm-nodelibs-events@0.2.2",
    fs: "npm:jspm-nodelibs-fs@0.2.1",
    os: "npm:jspm-nodelibs-os@0.2.2",
    path: "npm:jspm-nodelibs-path@0.2.3",
    process: "npm:jspm-nodelibs-process@0.2.1",
    stream: "npm:jspm-nodelibs-stream@0.2.1",
    string_decoder: "npm:jspm-nodelibs-string_decoder@0.2.1",
    util: "npm:jspm-nodelibs-util@0.2.2",
    vm: "npm:jspm-nodelibs-vm@0.2.1",
    xstream: "npm:xstream@10.9.0"
  },
  packages: {
    "npm:jspm-nodelibs-crypto@0.2.1": {
      map: {
        "crypto-browserify": "npm:crypto-browserify@3.11.1"
      }
    },
    "npm:jspm-nodelibs-os@0.2.2": {
      map: {
        "os-browserify": "npm:os-browserify@0.3.0"
      }
    },
    "npm:crypto-browserify@3.11.1": {
      map: {
        "browserify-sign": "npm:browserify-sign@4.0.4",
        "create-hash": "npm:create-hash@1.1.3",
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "create-hmac": "npm:create-hmac@1.1.6",
        "diffie-hellman": "npm:diffie-hellman@5.0.2",
        inherits: "npm:inherits@2.0.3",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        pbkdf2: "npm:pbkdf2@3.0.13",
        randombytes: "npm:randombytes@2.0.5"
      }
    },
    "npm:browserify-sign@4.0.4": {
      map: {
        "create-hash": "npm:create-hash@1.1.3",
        "create-hmac": "npm:create-hmac@1.1.6",
        inherits: "npm:inherits@2.0.3",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "bn.js": "npm:bn.js@4.11.8",
        "parse-asn1": "npm:parse-asn1@5.1.0",
        elliptic: "npm:elliptic@6.4.0"
      }
    },
    "npm:create-hmac@1.1.6": {
      map: {
        "create-hash": "npm:create-hash@1.1.3",
        inherits: "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        "cipher-base": "npm:cipher-base@1.0.4",
        ripemd160: "npm:ripemd160@2.0.1",
        "sha.js": "npm:sha.js@2.4.8"
      }
    },
    "npm:create-hash@1.1.3": {
      map: {
        inherits: "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.4",
        ripemd160: "npm:ripemd160@2.0.1",
        "sha.js": "npm:sha.js@2.4.8"
      }
    },
    "npm:jspm-nodelibs-buffer@0.2.3": {
      map: {
        buffer: "npm:buffer@5.0.7"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      map: {
        randombytes: "npm:randombytes@2.0.5",
        "bn.js": "npm:bn.js@4.11.8",
        "miller-rabin": "npm:miller-rabin@4.0.0"
      }
    },
    "npm:public-encrypt@4.0.0": {
      map: {
        "create-hash": "npm:create-hash@1.1.3",
        randombytes: "npm:randombytes@2.0.5",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "bn.js": "npm:bn.js@4.11.8",
        "parse-asn1": "npm:parse-asn1@5.1.0"
      }
    },
    "npm:pbkdf2@3.0.13": {
      map: {
        "create-hash": "npm:create-hash@1.1.3",
        "create-hmac": "npm:create-hmac@1.1.6",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        ripemd160: "npm:ripemd160@2.0.1",
        "sha.js": "npm:sha.js@2.4.8"
      }
    },
    "npm:create-ecdh@4.0.0": {
      map: {
        "bn.js": "npm:bn.js@4.11.8",
        elliptic: "npm:elliptic@6.4.0"
      }
    },
    "npm:randombytes@2.0.5": {
      map: {
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      map: {
        "browserify-des": "npm:browserify-des@1.0.0",
        "browserify-aes": "npm:browserify-aes@1.0.6",
        evp_bytestokey: "npm:evp_bytestokey@1.0.0"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      map: {
        randombytes: "npm:randombytes@2.0.5",
        "bn.js": "npm:bn.js@4.11.8"
      }
    },
    "npm:cipher-base@1.0.4": {
      map: {
        inherits: "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:browserify-des@1.0.0": {
      map: {
        "cipher-base": "npm:cipher-base@1.0.4",
        inherits: "npm:inherits@2.0.3",
        "des.js": "npm:des.js@1.0.0"
      }
    },
    "npm:browserify-aes@1.0.6": {
      map: {
        "create-hash": "npm:create-hash@1.1.3",
        inherits: "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.4",
        evp_bytestokey: "npm:evp_bytestokey@1.0.0",
        "buffer-xor": "npm:buffer-xor@1.0.3"
      }
    },
    "npm:elliptic@6.4.0": {
      map: {
        "bn.js": "npm:bn.js@4.11.8",
        inherits: "npm:inherits@2.0.3",
        brorand: "npm:brorand@1.1.0",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "hash.js": "npm:hash.js@1.1.3",
        "hmac-drbg": "npm:hmac-drbg@1.0.1",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
      }
    },
    "npm:parse-asn1@5.1.0": {
      map: {
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "create-hash": "npm:create-hash@1.1.3",
        pbkdf2: "npm:pbkdf2@3.0.13",
        evp_bytestokey: "npm:evp_bytestokey@1.0.0",
        "asn1.js": "npm:asn1.js@4.9.1"
      }
    },
    "npm:ripemd160@2.0.1": {
      map: {
        inherits: "npm:inherits@2.0.3",
        "hash-base": "npm:hash-base@2.0.2"
      }
    },
    "npm:sha.js@2.4.8": {
      map: {
        inherits: "npm:inherits@2.0.3"
      }
    },
    "npm:evp_bytestokey@1.0.0": {
      map: {
        "create-hash": "npm:create-hash@1.1.3"
      }
    },
    "npm:buffer@5.0.7": {
      map: {
        ieee754: "npm:ieee754@1.1.8",
        "base64-js": "npm:base64-js@1.2.1"
      }
    },
    "npm:miller-rabin@4.0.0": {
      map: {
        "bn.js": "npm:bn.js@4.11.8",
        brorand: "npm:brorand@1.1.0"
      }
    },
    "npm:des.js@1.0.0": {
      map: {
        inherits: "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:asn1.js@4.9.1": {
      map: {
        "bn.js": "npm:bn.js@4.11.8",
        inherits: "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:hash.js@1.1.3": {
      map: {
        inherits: "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:jspm-nodelibs-stream@0.2.1": {
      map: {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "npm:stream-browserify@2.0.1": {
      map: {
        inherits: "npm:inherits@2.0.3",
        "readable-stream": "npm:readable-stream@2.3.3"
      }
    },
    "npm:hmac-drbg@1.0.1": {
      map: {
        "hash.js": "npm:hash.js@1.1.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
        "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
      }
    },
    "npm:hash-base@2.0.2": {
      map: {
        inherits: "npm:inherits@2.0.3"
      }
    },
    "npm:readable-stream@2.3.3": {
      map: {
        inherits: "npm:inherits@2.0.3",
        "safe-buffer": "npm:safe-buffer@5.1.1",
        string_decoder: "npm:string_decoder@1.0.3",
        "core-util-is": "npm:core-util-is@1.0.2",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        isarray: "npm:isarray@1.0.0",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:jspm-nodelibs-string_decoder@0.2.1": {
      map: {
        string_decoder: "npm:string_decoder@0.10.31"
      }
    },
    "npm:string_decoder@1.0.3": {
      map: {
        "safe-buffer": "npm:safe-buffer@5.1.1"
      }
    },
    "npm:xstream@10.9.0": {
      map: {
        "symbol-observable": "npm:symbol-observable@1.0.4"
      }
    },
    "npm:@cycle/run@3.2.0": {
      map: {
        xstream: "npm:xstream@10.9.0"
      }
    },
    "npm:@cycle/dom@18.1.0": {
      map: {
        "@cycle/run": "npm:@cycle/run@3.2.0",
        "snabbdom-selector": "npm:snabbdom-selector@1.2.1",
        "es6-map": "npm:es6-map@0.1.5",
        snabbdom: "npm:snabbdom@0.7.0"
      }
    },
    "npm:snabbdom-selector@1.2.1": {
      map: {
        cssauron: "npm:cssauron@1.4.0"
      }
    },
    "npm:cssauron@1.4.0": {
      map: {
        through: "npm:through@2.3.8"
      }
    },
    "npm:es6-map@0.1.5": {
      map: {
        "es6-iterator": "npm:es6-iterator@2.0.1",
        "es5-ext": "npm:es5-ext@0.10.27",
        "es6-symbol": "npm:es6-symbol@3.1.1",
        "event-emitter": "npm:event-emitter@0.3.5",
        "es6-set": "npm:es6-set@0.1.5",
        d: "npm:d@1.0.0"
      }
    },
    "npm:es6-iterator@2.0.1": {
      map: {
        "es5-ext": "npm:es5-ext@0.10.27",
        "es6-symbol": "npm:es6-symbol@3.1.1",
        d: "npm:d@1.0.0"
      }
    },
    "npm:es5-ext@0.10.27": {
      map: {
        "es6-iterator": "npm:es6-iterator@2.0.1",
        "es6-symbol": "npm:es6-symbol@3.1.1"
      }
    },
    "npm:es6-symbol@3.1.1": {
      map: {
        "es5-ext": "npm:es5-ext@0.10.27",
        d: "npm:d@1.0.0"
      }
    },
    "npm:event-emitter@0.3.5": {
      map: {
        "es5-ext": "npm:es5-ext@0.10.27",
        d: "npm:d@1.0.0"
      }
    },
    "npm:es6-set@0.1.5": {
      map: {
        d: "npm:d@1.0.0",
        "es5-ext": "npm:es5-ext@0.10.27",
        "es6-iterator": "npm:es6-iterator@2.0.1",
        "es6-symbol": "npm:es6-symbol@3.1.1",
        "event-emitter": "npm:event-emitter@0.3.5"
      }
    },
    "npm:d@1.0.0": {
      map: {
        "es5-ext": "npm:es5-ext@0.10.27"
      }
    }
  }
})
