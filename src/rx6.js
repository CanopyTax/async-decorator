import React from "react";
import { Observable } from 'rxjs/Observable.js';
import 'rxjs/add/observable/fromEventPattern.js';
import makeAsyncDecorator from './rx-decorator.js';

export default makeAsyncDecorator(React, Observable);
