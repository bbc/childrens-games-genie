import convert from './convert.js';
import zipAll from '../zip.js';
let func = convert('zipAll', zipAll);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
