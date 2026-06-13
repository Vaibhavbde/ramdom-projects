// type rce to autofill

import React, { Component } from 'react';

export class Form extends Component {

    // component level state
    state = {
        task : ""
    }

    input1 = {
        width : "90%",
        borderRadius : "20px",
        textAlign : "center",
        padding : "10px",
        fontFamily: 'Tangerine',
        fontSize : "30px"   
    }
    
    input2 = {
        fontFamily: 'Tangerine',
        color : "white",
        background : "skyblue",
        padding : "20px",
        borderRadius : "20px",
        margin: "10px",
        fontSize : "30px"
    }

    onChange = (e) => {
        this.setState({task : e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();
        // if input is empty
        if(this.state.task.length == 0)
            return;
        this.props.task(this.state.task);
        this.setState({task : ""});
    }

    render() {
        return (
            <div>
                <br/>
                <form onSubmit={this.onSubmit}>
                    <input 
                        style={this.input1} 
                        placeholder="Type task here..."
                        value = {this.state.task}
                        onChange = {this.onChange}

                    />
                    <input 
                        style={this.input2} 
                        type="submit"
                    />
                </form>
            </div>
            
        )
    }
}

export default Form
