import convert from './convert.js';
import before from '../before.js';
let func = convert('before', before);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
