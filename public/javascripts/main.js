/** @jsx React.DOM */

React.renderComponent(
  <h1>Hello, world first render!</h1>,
  document.getElementById('example')
);



var newtodoList = React.createClass({
  render: function() {
    return (
      <div className="todoList">
        Hello, world! I am a todoList.
      </div>
    );
  }
});

var NewToDoForm = React.createClass({
  render: function() {
    return (
      <div className="todoForm">
        Hello, world! I am a NewToDoForm
      </div>
    );
  }
});

// these goes at the bottom as js needs to render stuff first (not put a initalize function???) 
var todo = React.createClass({
  render: function() {
    return (
      <div className="TodoBox">
        <h1>Todos</h1>
        <newtodoList/> // these are variables!!!
        <NewToDoForm  /> // so we can put classnames as actualt tags? this is weirld. 

      </div>
    );
  }
})

React.renderComponent(
  todo(null),
  document.getElementById('content')
);