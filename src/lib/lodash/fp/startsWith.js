import convert from './convert.js';
import startsWith from '../startsWith.js';
let func = convert('startsWith', startsWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
