// import React from "react";

// const NewsItem = (props) => {
//     let {title,description,ImageUrl,newsUrl,publishedAt,author,source} = props;
//     return (
//       <>
//         <div className="my-3">
//         <div className="card page2_card " style={{width:"18rem"}} >
//           <img src={ImageUrl?ImageUrl:"https://images.wsj.net/im-971031/social"} className="card-img-top" alt="..." />  
//           <div className="card-body">
//             <h5 className="card-title">{title}.<span className="badge rounded-pill bg-danger">{source}</span></h5>
//             <p className="card-text">{description}</p>
//             <p className="card-text"><small className="text-muted">Published At : {new Date(publishedAt).toGMTString()}</small></p>
//             <p className="card-text"><small className="text-muted">By : {author}</small></p>
//             <a href={newsUrl} target="_blank" className="btn btn-sm btn-dark">Read More</a>
//           </div>
//         </div>
//         </div>
//       </>
//     );
// }

// export default NewsItem;


import React from "react";
import "../stylesheets/NewsItem.css"; // Import the CSS file

const NewsItem = (props) => {
    let { title, description, ImageUrl, newsUrl, publishedAt, author, source } = props;
    return (
        <div className="news-item my-3">
            <div className="card page2_card">
                <img 
                    src={ImageUrl ? ImageUrl : "https://images.wsj.net/im-971031/social"} 
                    className="card-img-top" 
                    alt={title || "News Image"} 
                />
                <div className="card-body">
                    <h5 className="card-title">
                        {title}
                        <span className="badge rounded-pill bg-danger ms-2">{source}</span>
                    </h5>
                    <p className="card-text">{description}</p>
                    <p className="card-text">
                        <small className="text-muted">Published At: {new Date(publishedAt).toGMTString()}</small>
                    </p>
                    <p className="card-text">
                        <small className="text-muted">By: {author || "Unknown"}</small>
                    </p>
                    <a href={newsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark">Read More</a>
                </div>
            </div>
        </div>
    );
}

export default NewsItem;


/*
<div class="card page2_card" style="width: 18rem;">
                <img src="..." class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">Card title</h5>
                  <p class="card-text card_text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>


*/
