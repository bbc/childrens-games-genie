import convert from './convert.js';
import pick from '../pick.js';
let func = convert('pick', pick);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
