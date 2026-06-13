import React from 'react';
import Header from './components/Header/Header';
import Form from './components/Form/Form';
import Todos from './components/Todos/Todos';
import './App.css';
import {v1 as uuid} from 'uuid';

// function App() {
//   return (
//     <div className="App">
//       <h1> Amy </h1>
//     </div>
//   );
// }
class App extends React.Component{

  // app level state
  state = {
    todos : [
      // {
      //   id : 1,
      //   title : "1",
      //   done : false
      // },
      // {
      //   id : 2,
      //   title : "2",
      //   done : true
      // }
    ]
  }

  markDone = (id) => {
    this.setState(
      { todos : this.state.todos.map(todo => {
        if(id === todo.id)
          todo.done = !todo.done;
        return todo;
      })}
    )
}

markDelete = (id) => {
  // console.log(id)
  this.setState(
    { todos : [...this.state.todos.filter(todo => id !== todo.id)]}
  )
}

addTask = (task) => {
  // console.log(task)
  const newTask = {
    id : uuid(),
    title : task,
    done : false
  };
  this.setState({todos : [...this.state.todos, newTask]})
}

  render(){
    return(
      <div className="App">
        <Header/>
        <Form task={this.addTask} />
        <Todos todos = {this.state.todos} markDone={this.markDone} markDelete={this.markDelete} />
      </div>
    )
  }
}

export default App;
