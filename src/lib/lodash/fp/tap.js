import convert from './convert.js';
import tap from '../tap.js';
let func = convert('tap', tap);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
