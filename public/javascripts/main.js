/** @jsx React.DOM */

React.renderComponent(
  <h1>Hello, world first render!</h1>,
  document.getElementById('example')
);


var newtodoList = React.createClass({
  render: function() {
    var todoNodes = this.props.data.map(function (todo) {
      return (
        <Todo description={todo.description}>
          {todo.date}
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
    // var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="todo">
        <h2 className="tododescription">
          {this.props.description}
        </h2>
        
        <h3 className="tododate">
          {this.props.dueby}
        </h3>
       
      </div> // react does not like this at alll
    );
  }
});

// these goes at the bottom as js needs to render stuff first (not put a initalize function???) 
var TodoBox = React.createClass({
    // this.probs url meaning it knows the url from down below. 
  // set state => findo ut what it means
  // can pretty much use all of this with any other project.

  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="todoBox">
        <h1>Todos</h1>
        <newtodoList data={this.state.data}/> // these are variables!!!
        <NewToDoForm  /> // so we can put classnames as actualt tags? this is weirld. 

      </div> // this is where the main list is. Were then applying to the top part
    );
  }
})

React.renderComponent(
  <TodoBox url="/javascripts/mainjson.json" pollInterval={2000} />,
  document.getElementById('content')
);