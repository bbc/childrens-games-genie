import convert from './convert.js';
import at from '../at.js';
let func = convert('at', at);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
