import convert from './convert.js';
import xorWith from '../xorWith.js';
var func = convert('xorWith', xorWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
