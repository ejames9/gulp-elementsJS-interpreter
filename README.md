## <a class='titleLinks' id='interpreter-install'>Installing the elementsJS Transpiler</a>   
### Using gulp.js  [<img src='http://media-cache-ak0.pinimg.com/736x/a7/7e/81/a77e816ed0b0c1ed28d60b6b9d4860b1.jpg' height='60px'/>](http://gulpjs.com/)
If you don't know how to use gulp, you can find a nice tutorial [here](http://www.sitepoint.com/introduction-gulp-js/). First, you will need to install the gulp-elementsJS-transpiler package (Along with gulp and any other plug-ins you'll be using). It is available on npm's registry:

```
$ npm i --save-dev gulp-elementsJS-transpiler
```

In case you are new to npm, the *--save-dev* simply lists the package as one of your **devDependencies** in your application's *package.json* file. To use the transpiler, see below:

```javascript

```






# <a class='titleLinks' id='imports'>The imports() function</a>
--
The **`imports()`** function is a convenience function that allows the quick importing of many modules and/or module functions all at once. It is not necessary to use this function in order to use the library, it just makes it quicker/easier to import all of its' functions separately.

- Note- Use of this function requires compilation by the **elementsJS-transpiler**.

In order to use the imports function, it must first be imported from the module as such:

```javascript
var imports = require('elementsJS').imports;
```
or,

```javascript
import { imports } from 'elementsJS';
```
## `imports( {module: funcs/moduleAlias} )`

#### Arguments

1. **`{module: funcs or moduleAlias}`** (object) - An object, the key of which is the name of a module (string) **ex. 'lodash'**, and the value is either a list of functions (array) **ex. `['make', 'go']`**, or the variable name given to the module being imported (string) **ex.** `'_'`, for **lodash**.

**Returns**: nuffin.

#### Usage

The imports function can be used to conveniently import individual functions from modules, or entire modules. If functions will be imported from the module individually, usage is as below:

```javascript
imports({
	'elementsJS': ['make', 'go', 'dom', 'on'],
   '../js/utils': ['buildMenu'], // << see Note below *
	    'lodash': '_'
});
//functions are used like so:

make('#foo', 'button');

buildMenu();
```

- Note that if only 1 function is being imported, an array still needs to be used, otherwise, the entire module will be imported. See below.


Entire modules can be imported like so:

```javascript
imports({
	'elementsJS': 'elemsJS',
   '../js/utils': 'utils',
	    'lodash': '_',
});
//functions are used like so:

elemsJS.make('#foo', 'button');

utils.buildMenu();
```
# [Click Here for the full elementsJS API](http://elementsjs.io)
