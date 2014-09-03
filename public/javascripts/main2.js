/** @jsx React.DOM */

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


var converter = new Showdown.converter();
var Todo = React.createClass({
  handleSubmitTodoDetails: function(e) {
    var TodoList = React.createClass({
      render: function() {
        var createItem = function(items) {
          return <li>{items}<input type="checkbox" name ="choose" value="Choose"> Done? </input> </li>
                
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
      }
    });

    var TodoApp = React.createClass({
      loadTodosFromServer: function(items) {
        var todos = this.state.data;
        console.log("load todos from server")
        console.log(todos)
        
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          success: function(items) {
            this.setState({items: items});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());

        }
      })
    },
      getInitialState: function() {
        return {items: []};
      },
      componentDidMount: function() {
        this.loadTodosFromServer();
        setInterval(this.loadTodosFromServer, this.props.pollInterval);
      },
      onChange: function(e) {
        this.setState({text: e.target.value});
      },
      handleSubmit: function(e, items) {
       e.preventDefault();
       console.log(items)
        // var description = this.refs.description.getDOMNode().value.trim();
        var Details = this.refs.Details.getDOMNode().value.trim();
        // items.push(Details)
        // console.log(items)
        
        // i need to push these details into the summered json array, however i cannt call it becaiseits called much further down.

        //this.props.onTodoSubmit({Details: Details})
        //console.log(Details)
        var nextItems = this.state.items.concat([this.state.text]);
        var nextText = '';
        this.setState({items: nextItems, text: nextText});
      },
     render: function() {
        var todoNodes = this.props.data.map(function (items) {
          return (
            <Todo>
              {items.Details}
            </Todo>
          );
        });
        return (
          <div className="commentList">
            {todoNodes}
          </div>
        );
      },
      render: function() {
        return (
          <div>
            <h3>Todos</h3>
            <TodoList items={this.state.items} />

            <form onSubmit={this.handleSubmit}>
              <input onChange={this.onChange} value={this.state.text} ref="Details" required={true} />
              <button>{'Add #' + (this.state.items.length + 1)}</button>

            </form>
            
          </div>
          // use this form to add in simlar to the last form we did!!!! 
        );
      }
    });
    React.renderComponent(<TodoApp url="todos.json" pollInterval={2000}/>,  document.getElementById('contentdetailed'));
  },  
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="todo">
        <h2 className ="todoDescription" >
          {this.props.description}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
        <button onClick={this.handleSubmitTodoDetails}>View Todos</button>
      </div>
    );
  }
});




// sets inital state executes once ins lifecycle and stes initnal state
// we need to update it dynamically via server ajax
//
var TodoBox = React.createClass({

  loadTodosFromServer: function() {
    var todos = this.state.data;
    console.log(todos)
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
    console.log(todo)
    var todos = this.state.data;
    console.log(todos)
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
        <h3> Todo Name </h3>
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
     var todoNodes = this.props.data.map(function (todo, index) {
      console.log(todo)
      return (
        <Todo description={todo.description} key={index}>
          {todo.text}

        </Todo>
        
      );
    });
   return (
      <div className="todoSummary">
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
    console.log(description)
    // if not text or descriptions (if one dont exist?)
    if (!text || !description) {
      return false;
    }
    this.props.onTodoSubmit({description: description, text: text});
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
// var data = 
// [
//   {"description": "rooms", "text": "This is one todo",
//     "Details":[
//       "clean room",
//       "tidy room",
//       "sort room"
//     ]
//   }, 
//   {"description": "bathroom", "text": "This is *another* todo",
//     "Details":[
//     "clean floor",
//       "tidy floor",
//       "sort floor"
//     ]
//   }
// ]

 

  



// /javascripts/mainjson.json
React.renderComponent(
  <TodoBox url = "todos.json" pollInterval={2000}/>,
  document.getElementById('content')
);



