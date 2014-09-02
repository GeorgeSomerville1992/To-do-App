/** @jsx React.DOM */
React.renderComponent(
  <h1>Hello, world first render!</h1>,
  document.getElementById('example')
);
// we render the CLASS NAMES  in some sort of xml thing
// create Todo list and todo form.
// logical order to to how the code reades it, wee need to create todo before todo lsit becasue
// were redernign classes in side.
// adding markdown => apprently its good form formatting text inline.
// theres a few complex thigns fgoing on fro actually rendering the comments. 
// cant just take tethe raw data out, it needs to knwo 
// var data = [
//   {description: "Pete Hunt", text: "This is one comment"},
//   {description: "Jordan Walke", txt: "This is *another* comment"}
// ];
// var todos = [
//   {"description": "rooms", "text": "This is one todo"},
//   {"description": "bathroom", "text": "This is *another* todo"}
// ];

var converter = new Showdown.converter();
var Todo = React.createClass({
  render: function() {
     var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="todo">
        <h2 className="todotDescription">
          {this.props.description}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});





// sets inital state executes once ins lifecycle and stes initnal state
// we need to update it dynamically via server ajax
//
var TodoBox = React.createClass({
  
  loadTodosFromServer: function() {
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
  handleTodoSubmit: function(todo) {
    // TODO: submit to the server and refresh the list
   
    var todos = this.state.data;
   
    todos.push(todo)
    console.log(todos)
    // ajax cant find json url. when new object is added
    this.setState({data: todos}, function(){
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
    });  
  },
  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadTodosFromServer();
    setInterval(this.loadTodosFromServer, this.props.pollInterval);
  },


  render: function() {
    return (
      <div className="todoBox">
        <h1> todos </h1>
        <TodoSummary data={this.state.data}/>
        <TodoForm onTodoSubmit={this.handleTodoSubmit} />
      </div>

    );
  }
});


//here were callsing the todo class and shoving whatever we get 
// from the data inide the decription and the text
// so we set it up => then redner insdie using the {todo}nodes
var TodoSummary = React.createClass({
  render: function() {
     var todoNodes = this.props.data.map(function (todo) {
      return (
        <Todo description={todo.description}>
          {todo.text}
        </Todo>
        
      );
    });
   return (
      <div className="TodoSummary">
        {todoNodes}
      </div>
    );
  }
});
var TodoForm = React.createClass({
  // where things get a bit complex
  handleSubmit: function(e) {
    e.preventDefault();
    console.log("this is being ran")
    var description = this.refs.description.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    this.props.onTodoSubmit({description: description, text: text});
    // if not text or descriptions (if one dont exist?)
    if (!text || !description) {
      return false;
    }
    // TODO: send request to the server
    this.refs.description.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  render: function() {
    return (
       <form className="todoForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your todo"  ref="description" required={true} maxLength={15} />
        <input type="text" placeholder="your todo description" ref="text" required={true} />
        <input type="submit" value="Post" />
      </form>
    );
  }
});
// put in a hash or something???? 
var data = 
[
  {"description": "rooms", "text": "This is one todo",
    "Details":[
      "clean room",
      "tidy room",
      "sort room"
    ]
  }, 
  {"description": "bathroom", "text": "This is *another* todo",
    "Details":[
    "clean floor",
      "tidy floor",
      "sort floor"
    ]
  }
]
var converterDetailed = new Showdown.converter();
var TodoDetailed = React.createClass({
  render: function() {
    var rawMarkupDetailed = converterDetailed.makeHtml(this.props.children.toString());
    return (
      <div className="todoDetailed">
        
         <li dangerouslySetInnerHTML={{__html:  rawMarkupDetailed }} />
      </div>
    );
  }
});
var TodoBoxDetailed = React.createClass({
  render: function() {
    return (
      <div className="todoBoxDetailed">
        <h1>todolist</h1>
        <TodoList data={this.props.data}/>
        <TodoDetailedForm />
      </div>
    );
  }
});
var TodoDetailedForm = React.createClass({
  render: function() {
    return (
      <div className="tododetailedForm">
        Hello, world! I am a TodoDetailedForm.
      </div>
    );
  }
});
var TodoList = React.createClass({
  render: function() {
    var todoDetailedNodes = this.props.data.map(function (todoDetailed) {
      return (
        <TodoDetailed >
          {todoDetailed.Details[0]}
        </TodoDetailed>
      );
    });
    return (
      <div className="todoList">
        {todoDetailedNodes}
      </div>
    );

  }
});





// /javascripts/mainjson.json
React.renderComponent(
  <TodoBox url = "todos.json" pollInterval={2000}/>,
  document.getElementById('content')
);

React.renderComponent(
  <TodoBoxDetailed data={data} />,
  document.getElementById('contentdetailed')

);

