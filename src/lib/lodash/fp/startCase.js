import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import startCase from '../startCase.js';
let func = convert('startCase', startCase, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
