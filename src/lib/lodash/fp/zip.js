import convert from './convert.js';
import zip from '../zip.js';
let func = convert('zip', zip);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
