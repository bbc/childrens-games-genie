import convert from './convert.js';
import unionBy from '../unionBy.js';
let func = convert('unionBy', unionBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
