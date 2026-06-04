// type rfc to autocomplete

import React from 'react'

const headerStyle = {
    border : "1px solid black",
    borderRadius : "30px",
    justifyContent: "center",
    fontFamily: "Allerta Stencil",
    fontSize : "20px"
}


export default function Header() {
    return (
        <div>
            <div style={headerStyle}>
                <h1> Task Manager </h1>
                <h4> &copy; vaibhav </h4>
            </div>
        </div>
    )
}
