import convert from './convert.js';
import defaultsDeep from '../defaultsDeep.js';
let func = convert('defaultsDeep', defaultsDeep);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
