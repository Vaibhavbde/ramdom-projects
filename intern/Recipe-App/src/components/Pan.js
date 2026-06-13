import panImg from '../images/pan.gif'

const Pan = () => {
  return (
    <div className="pan-wrapper">
      {/* Use the variable for the image inside of the source */}
      <h2>Loading...</h2>
      <img src={panImg} alt="Loading" />
    </div>
  )
}

export default Pan