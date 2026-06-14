import React, { useState } from 'react'
import { useEffect } from 'react'
import "../stylesheets/SpaceInformation.css"
import homevideo from "../assets/218070_medium.mp4"
import NewsItem from './NewsItem.js'
function SpaceInformation() {
  const [articles, setarticles] = useState([])
    const fetchNews = async () => {
        let json = await fetch("")
        let data = await json.json();
        setarticles(data.articles)
    } 
    fetchNews()
  return (
    <>
    <video id='background-video' className='bg_video' autoPlay muted loop>
        <source src={homevideo} type="video/mp4" className = "bg_inside_video"/>
    </video>
    <main>
    <div className="page page1 container px-4 dff">
        <h1 className="home_head">Advanced Space Technology Problems</h1>
        <p className="home_para">
            As space technology advances, several critical problems need to be addressed to ensure the sustainable exploration and utilization of space. Key issues include:
            <ul>
                <li><strong>Space Debris:</strong> The increasing amount of debris in Earth's orbit poses a significant risk to satellites and spacecraft. Developing effective debris mitigation and removal technologies is crucial.</li>
                <li><strong>Radiation Exposure:</strong> Long-duration space missions expose astronauts to higher levels of cosmic radiation. Research into radiation shielding and protective measures is essential for crew safety.</li>
                <li><strong>Life Support Systems:</strong> Ensuring reliable and efficient life support systems is vital for manned missions to distant destinations like Mars. Innovations in closed-loop systems and resource recycling are ongoing.</li>
                <li><strong>Propulsion Technologies:</strong> Current propulsion systems limit the speed and range of space missions. Advances in propulsion, such as ion drives and nuclear thermal propulsion, could revolutionize space travel.</li>
                <li><strong>Resource Utilization:</strong> Utilizing resources found in space, such as mining asteroids for minerals or producing fuel on the Moon, could support future missions and reduce costs.</li>
            </ul>
        </p>
    </div>
    <div className="container">
        <div className="row">
          {articles.map((element) => {
            return (
              <div className="col md-4" key={element.url}>
                <NewsItem
                  title= {element.title?element.title.slice(0,10)+"..":""}
                  description={element.description?element.description.slice(0,24)+"...":""}
                  ImageUrl = {element.urlToImage?element.urlToImage:""}
                  newsUrl= {element.url?element.url:""}
                  publishedAt = {element.publishedAt?element.publishedAt:""}
                  author ={element.author?element.author:"Unknown"}
                  source = {element.source["name"]?element.source["name"]:""}
                />
              </div>
            );
          })}
        </div>
    </div>
    <div className="page container-fluid"></div>
    <div className="page container-fluid"></div>
    </main>
    </>
  )
}

export default SpaceInformation