import React from "react";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEventPattern';
import makeAsyncDecorator from './rx-decorator.js';

export default makeAsyncDecorator(React, Observable.fromEventPattern);
