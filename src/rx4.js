import React from "react";
import rx from "rx";

import makeAsyncDecorator from './rx-decorator.js';

export default makeAsyncDecorator(React, rx.Observable.fromEventPattern);
