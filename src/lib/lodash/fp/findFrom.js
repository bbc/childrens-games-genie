import convert from './convert.js';
import findFrom from '../find.js';
let func = convert('findFrom', findFrom);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
