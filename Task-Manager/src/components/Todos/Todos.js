import React from 'react';
import TodoItem from './TodoItem';

class Todos extends React.Component{


    render(){
        return this.props.todos.map(todo => (
            // <h1> {todo.id} </h1>
            <TodoItem todoitems={todo} markDone={this.props.markDone} markDelete={this.props.markDelete} />
    ));
    }
}


export default Todos;
