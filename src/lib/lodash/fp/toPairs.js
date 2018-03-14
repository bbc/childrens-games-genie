import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toPairs from '../toPairs.js';
let func = convert('toPairs', toPairs, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
