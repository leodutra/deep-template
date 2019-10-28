# deep-template
Create "curried" templates from deep JS structures using ES6 template syntax


## Install
In a browser:
```html
<script src="deep-template.js"></script>
```

Using npm:
```shell
$ npm i -g npm
$ npm i --save deep-template
```

## Usage

### deepTemplate(String, Object) -> String
```js
var deepTemplate = require('deep-template');
var buildPath = deepTemplate('/api/users/${id}/');
buildPath({id: '549873456448'}); // -> "/api/users/549873456448/"
```

### deepTemplate(Object, Object) -> Object
```js
var configTemplate = {
    a: ['/api/users/${id}/${action}'],
    b: { 
        deep: {
            foo: [
                { 
                    stuff: 'DEFAULT_ENV=${env}'
                }
            ] 
        }
    },
    c: function() { console.log('avoided') },
    d: /keepRegExp/gim,
    e: 'keep simple texts',
    f: 10
};
var defaults = {action: 'defaultAction', env: '/usr/bin/bash'};
var configBuilder = deepTemplate(configTemplate, defaults);
configBuilder({id: '549873456448'}); 
/* -> {
        a: ["/api/users/549873456448/defaultAction"],
        b: {
            deep: {
                foo: [{
                    stuff: "DEFAULT_ENV=/usr/bin/bash"
                }]
            }
        },
        c: function() { console.log('avoided') },
        d: /keepRegExp/gim,
        e: "keep simple texts",
        f: 10
    }
*/
```

### deepTemplate(String, Array) -> String
```js
var arrayBuildPath = deepTemplate('/api/users/${0}/${1}/${2}', [null, null, 'ascending']);
arrayBuildPath(['549873456448', 'getUser']); // -> "/api/users/549873456448/getUser/ascending"
```