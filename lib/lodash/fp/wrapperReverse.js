import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import wrapperReverse from '../wrapperReverse';
var func = convert('wrapperReverse', wrapperReverse, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
