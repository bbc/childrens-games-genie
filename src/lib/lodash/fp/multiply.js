import convert from './convert.js';
import multiply from '../multiply.js';
let func = convert('multiply', multiply);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
