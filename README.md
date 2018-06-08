# async-decorator
Async tools for React provided by a decorator

## Requirements and installation

Async-decorator can be used with [RxJS 4](https://github.com/Reactive-Extensions/RxJS) or [RxJS 5-6](https://github.com/ReactiveX/rxjs)

Note: We are currently implementing a version for [callbags](https://github.com/staltz/callbag-basics).

Installation:

```
npm install --save async-decorator
```

## API
The decorator provides your component with a few utility props for
dealing with asyncronous data. The following props are provided:

`cancelWhenUnmounted(Subscription): void` - A function which takes an observable
subscription (a disposable) as a parameter. The observable subscription
will automatically be cancelled when your component is unmounted. This
prevents code from unintentionally calling `setState` after the
component is unmounted.

`cancelAllSubscriptions(): void` - A function which will cancel all
subscriptions that may be tracked with `cancelWhenUnmounted`.
Automatically called during `componentWillUnmount`.

`stream(prop: String): Observable` - A function which takes a string as
parameter that represents a prop to watch. `stream` returns an
observable stream which will publish an event each time the prop changes.

`stream(props => props.prop): Observable` - A function which takes a comparator
callback as an argument. `stream` returns an observable stream which will publish
an event each time the prop changes according to the comparater callback.

## Example usage

```js
import AsyncDecorator from "async-decorator/rx4";
// change to rx5 or rx6 if using those versions

@AsyncDecorator
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      data: null,
    }
  }
  componentDidMount() {
    this.props.cancelWhenUnmounted(
      this.props
        .stream("type")
        .flatMapLatest(type => makeNetworkRequest(type))
        .subscribe(data =>
          this.setState({
            data: data,
          })
        )
    )
  }
  render() {
    return <div>{this.state.data}</div>
  }
}
```
