import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isUndefined from '../isUndefined.js';
var func = convert('isUndefined', isUndefined, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
