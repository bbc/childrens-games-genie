import convert from './convert.js';
import floor from '../floor.js';
let func = convert('floor', floor);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
