import convert from './convert.js';
import divide from '../divide.js';
let func = convert('divide', divide);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
