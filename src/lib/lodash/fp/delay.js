import convert from './convert.js';
import delay from '../delay.js';
let func = convert('delay', delay);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
