import convert from './convert.js';
import omitBy from '../omitBy.js';
let func = convert('omitBy', omitBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
