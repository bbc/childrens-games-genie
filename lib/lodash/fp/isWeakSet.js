import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isWeakSet from '../isWeakSet.js';
var func = convert('isWeakSet', isWeakSet, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
