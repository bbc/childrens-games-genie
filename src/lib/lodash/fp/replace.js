import convert from './convert.js';
import replace from '../replace.js';
let func = convert('replace', replace);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
