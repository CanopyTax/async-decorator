import React from "react";
import { fromEventPattern } from 'rxjs';
import makeAsyncDecorator from './rx-decorator.js';

export default makeAsyncDecorator(React, fromEventPattern);
