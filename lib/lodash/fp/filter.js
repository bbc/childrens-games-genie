import convert from './convert.js';
import filter from '../filter.js';
var func = convert('filter', filter);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
