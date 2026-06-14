import React from 'react'
import "../stylesheets/Events.css"
const fetchbase = async () => {
    console.log("hi")
    let response = await fetch("http://localhost:5000/api/baseimg/fetchall",{
        method : "POST",
    })
    let data = await response.json()
    console.log(data)
    const test1 = document.querySelector("#test1")
    const test2 = document.querySelector("#test2")
    const test3 = document.querySelector("#test3")
    test3.src = "data:image/png;base64,"+data[1].humanaffect
    test2.src = "data:image/png;base64,"+data[2].midstate
    test1.src = "data:image/png;base64,"+data[2].intialstate
}
function Events() {
    document.addEventListener("DOMContentLoaded", function () {
        const timelineContainers = document.querySelectorAll('.timeline_initiate_container');
        timelineContainers.forEach(container => {
            const closeButton = container.querySelector('.close_button');
            // Expand the container width on mousedown or mouseenter
            container.addEventListener('mousedown', () => {
                container.classList.toggle('expanded');
            });
            container.addEventListener("mouseleave", () => {
                container.classList.toggle('expanded');
            });
            closeButton.addEventListener('click', () => {
                container.classList.toggle('expanded');
            });
        });
    });
    const handleOnClose = (event) => {
        const gh = document.querySelector("#container" + event.target.id)
        gh.classList.remove("expanded")
    }
    document.addEventListener("DOMContentLoaded",fetchbase())
     return (
        <>
            <main>
                <div className="card">
                    <div className="upper_container my-5">
                        <h1>Space Events</h1>
                        <span></span>
                        <p>
                        Discover the most exciting upcoming space events that are set to capture the world's attention. From groundbreaking space missions and astronomical phenomena to major space exploration milestones, stay informed about the events shaping the future of space science and technology. Don't miss out on the latest news and updates from the cosmos!
                        </p>
                    </div>
                    <span></span>
                    <div className="timeline_initiate_parent_container">
                        <div className="timeline_initiate_container" id='container1'>
                            <div className="timeline_card_img_container">
                                <img src="" alt="Timeline Initiation" className="timeline_card" id="test1"/>
                            </div>
                            <div className="description_container">
                                <button className='close_button' onClick={handleOnClose} id = "1">&times;</button>
                                <p id="desp1">
                                The initial state of satellite technology began in the mid-20th century with the launch of the first artificial satellites. The Soviet Union's Sputnik 1, launched in 1957, was the first successful satellite, marking the start of space exploration. Early satellites were primarily used for scientific research, communications, and Earth observation, paving the way for advancements in technology, including weather forecasting, global communications, and navigation systems. Early technology was characterized by large, bulky satellites with limited capabilities compared to modern, more advanced satellites.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="timeline_initiate_parent_container">
                        <div className="timeline_initiate_container">
                            <div className="timeline_card_img_container">
                                <img src="" alt="Timeline Initiation" className="timeline_card" id="test2"/>
                            </div>
                            <div className="description_container">
                                <p>
                                Satellites have transformed space discovery by providing detailed Earth observations, enhancing weather forecasts, and enabling space exploration. They offer crucial data for studying distant galaxies, planetary surfaces, and cosmic phenomena. Additionally, satellites support global communication, navigation, and space weather monitoring, significantly advancing our understanding of the universe.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="timeline_initiate_parent_container">
                        <div className="timeline_initiate_container">
                            <div className="timeline_card_img_container">
                                <img src="" alt="Timeline Initiation" className="timeline_card" id="test3"/>
                            </div>
                            <div className="description_container">
                                <p>
                                Life on Earth began about 3.8 billion years ago, with simple single-celled organisms emerging in the primordial oceans. These early life forms evolved over billions of years, leading to the diverse array of life we see today, from microscopic bacteria to complex plants and animals.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Events