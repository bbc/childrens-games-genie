import convert from './convert.js';
import flatMapDepth from '../flatMapDepth.js';
let func = convert('flatMapDepth', flatMapDepth);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
