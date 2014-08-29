/** @jsx React.DOM */

React.renderComponent(
  <h1>Hello, world first render!</h1>,
  document.getElementById('example')
);
var data = [
  {description: "cleanup", text: "This is one tjbjkbodo "},
  {description: "get a life", text: "This is *anhbhbvother* todo"}
];


var newtodoList = React.createClass({
  render: function() {
    var todoNodes = this.props.data.map(function (todo) {
      return (
        <Todo author={todo.description}>
          {todo.text}
        </Todo>
      );
    });
    // taking all of the abocve from the data and shoving ti in below
    return (
      <div className="todoList">
        {todoNodes}
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
var converter = new Showdown.converter();
var Todo = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="todo">
        <h2 className="tododescription">
          {this.props.description}
        </h2>
        
        <h3 className="tododate">
          {this.props.dueby}
        </h3>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}}/>// to end the dic???
      </div> // react does not like this at alll
    );
  }
});

// these goes at the bottom as js needs to render stuff first (not put a initalize function???) 
var todo = React.createClass({
  render: function() {
    return (
      <div className="TodoBox">
        <h1>Todos</h1>
        <newtodoList data={this.props.data}/> // these are variables!!!
        <NewToDoForm  /> // so we can put classnames as actualt tags? this is weirld. 

      </div>
    );
  }
})

React.renderComponent(
  <todo data={data} />,
  document.getElementById('content')
);