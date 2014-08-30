/** @jsx React.DOM */

React.renderComponent(
  <h1>Hello, world first render!</h1>,
  document.getElementById('example')
);





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
    handleToDoSubmit: function(todo) {
    // TODO: submit to the server and refresh the list
    var todos = this.state.data;
    var newTodos = todos.concat([todo]);
    // taking that ever is inside the todo arugment above and concat it 
    // ins ide an array
    // we use it with this. 
    this.setState({data: newTodos});

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: todo,
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
         // so we can put classnames as actualt tags? this is weirld. 
        <toDoForm onTodoSubmit={this.handleToDoSubmit} />
      </div> // this is where the main list is. Were then applying to the top part
    );
  }
});
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
var toDoForm = React.createClass({
  handleSubmit: function(e) {
      e.preventDefault();
      var description = this.refs.description.getDOMNode().value.trim();
      var text = this.refs.text.getDOMNode().value.trim();
      if (!text || !description) {
        return false;
      }
      // TODO: send request to the server
      // setting values to nothing, can we not just use empty() ? 
      this.props.onTodoSubmit({description: description, text: text});
      this.refs.description.getDOMNode().value = '';
      this.refs.text.getDOMNode().value = '';
      return false;
  },
  render: function() { // using this.hagleSubmit => finds the same one  within this function
    return (
      <form className="todoForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="description" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.renderComponent(
  <TodoBox url="/javascripts/mainjson.json" pollInterval={2000} />,
  document.getElementById('content')
);