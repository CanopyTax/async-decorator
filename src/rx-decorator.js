const disabled =
  typeof __disableAsyncDecorator === "undefined"
    ? false
    : __disableAsyncDecorator; // eslint-disable-line

const inTestingEnv = typeof jasmine !== "undefined";

export default function(React, fromEventPattern) {

  return function MakeAsyncDecorator(DecoratedComponent) {
    if (disabled) {
      return DecoratedComponent;
    }

    const originalDisplayName =
      DecoratedComponent.displayName || DecoratedComponent.name;

    return class AsyncDecorator extends React.Component {
      // Don't change display name in tests, so that snapshots and wrapper.find('CompName') works.
      // But in browser/non-tests react-dev-tools are easier to understand with a slightly altered display name
      static displayName = inTestingEnv
        ? originalDisplayName
        : `AsyncDecorator(${originalDisplayName})`;

      observableCache = {};
      propEvents = {};
      propFunctions = [];

      disposables = [];
      mounted = true;

      constructor(props) {
        super(props);
      }

      render() {
        return (
          <DecoratedComponent
            {...this.props}
            ref={el => this.el = el}
            stream={this.stream}
            cancelWhenUnmounted={this.cancelWhenUnmounted}
            cancelAllSubscriptions={this.cancelAllSubscriptions}
          />
        );
      }

      componentDidUpdate(prevProps) {
        Object.keys(this.propEvents).forEach(prop => {
          if (prevProps[prop] !== this.props[prop]) {
            this.propEvents[prop].forEach(event => event(this.props[prop]));
          }
        });

        this.propFunctions.forEach(propFunction => {
          const [func, event] = propFunction;

          if (func(prevProps) !== func(this.props)) {
            event(func(this.props));
          }
        });
      }

      componentWillUnmount() {
        this.cancelAllSubscriptions();
        this.mounted = false;
      }

      stream = prop => {
        if (this.observableCache[prop]) return this.observableCache[prop];

        this.observableCache[prop] = fromEventPattern(
          h => {
            if (typeof prop === "function") {
              this.propFunctions.push([prop, h]);
              setTimeout(() => h(prop(this.props)));
            } else {
              this.propEvents[prop] = [...this.propEvents[prop], h];
              setTimeout(() => h(this.props[prop]));
            }
          },
          h => {}
        );

        return this.observableCache[prop];
      };

      cancelWhenUnmounted = (...thingsToCancel) => {
        if (thingsToCancel.length === 0) {
          throw new Error(
            `cancelWhenUnmounted should be called with one or more cancelables (an object with a dispose, unsubscribe, or cancel function)`
          );
        }

        thingsToCancel.forEach(thingToCancel => {
          if (
            !thingToCancel ||
            (typeof thingToCancel.dispose !== "function" &&
              typeof thingToCancel.cancel !== "function" &&
              typeof thingToCancel.unsubscribe !== "function")
          ) {
            throw new Error(
              `cancelWhenUnmounted should be called with one or more cancelables (an object with a dispose, unsubscribe, or cancel function)`
            );
          }

          if (this.mounted) {
            this.disposables.push(thingToCancel);
          } else {
            // They called cancelWhenUnmounted after the component unmounted...
            cancel(thingToCancel);
          }
        });
      };

      cancelAllSubscriptions = () => {
        this.disposables.forEach(disposable => {
          cancel(disposable);
        });

        this.disposables = [];
      };
    };
  };
}

function cancel(thing) {
  if (typeof thing.dispose === "function") {
    thing.dispose();
  } else if (typeof thing.unsubscribe === "function") {
    thing.unsubscribe();
  } else if (typeof thing.cancel === "function") {
    thing.cancel();
  } else {
    // Don't throw an error when we can't cancel the thing they passed in.
  }
}
