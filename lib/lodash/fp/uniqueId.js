import convert from './convert.js';
import uniqueId from '../uniqueId.js';
var func = convert('uniqueId', uniqueId);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
