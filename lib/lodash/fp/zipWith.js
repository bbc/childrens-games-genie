import convert from './convert.js';
import zipWith from '../zipWith.js';
var func = convert('zipWith', zipWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
