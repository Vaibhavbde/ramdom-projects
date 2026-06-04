import React, { Component } from 'react'

export class TodoItem extends Component {

    getStyle = () => {
        return {
            textDecoration : this.props.todoitems.done ? 'line-through' : 'none',
            backgroundColor : this.props.todoitems.done ? 'lightgreen' : 'pink',
            color : this.props.todoitems.done ? 'gray' : 'black',
            border : '1px dotted white'
        }
    }

    buttonStyle = {
        background : 'white',
        color : 'red',
        borderRadius : '20px',
        cursor : 'pointer',
        float : 'bottom',
        border : 'none',
        padding : '10px'

    }


    render() {

        const {id, title, done} = this.props.todoitems;

        return (
            <div style={this.getStyle()}>
                <input type="checkbox" onChange={this.props.markDone.bind(this, id)}/>
                <h3> {title }</h3>
                <button style={this.buttonStyle} onClick={this.props.markDelete.bind(this, id)}> Delete </button>
                <br></br>
            </div>
        )
    }
}

export default TodoItem
