import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import last from '../last.js';
var func = convert('last', last, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
