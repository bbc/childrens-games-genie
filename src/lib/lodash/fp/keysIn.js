import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import keysIn from '../keysIn.js';
let func = convert('keysIn', keysIn, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
