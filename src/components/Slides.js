import React, { Component } from 'react';

const SlideItem = ({slideshow}) => {
    return (
      <div className="item-slide">
        {/* <h1>{props.title}</h1>
        <h2>{props.content}</h2> */}
        <div className="slider-content">
          <img src={slideshow.background} alt="Tarbeeta" />
        </div>

        <div className="slider-content-mobile">
          <img src={slideshow.background_mobile} alt="Tarbeeta" />
        </div>
      </div>
    );
}
  
const Indicators = ({listItems, currentSlide, changeSlide}) => {
    const listIndicators = listItems && listItems.map((item, index) => 
      <li
        key={index}
        className={currentSlide === index ? 'active' : ''} 
        onClick={() => changeSlide(index)}
      >
          {/* {index + 1} */}
      </li>
    );
    return (
      <ul className="indicators">
        {listIndicators}
      </ul>
    );
};

class Slides extends Component {
    // constructor(props) {
    //    super(props);
    //   this.state = {         
    //        slideshow: props.slide,         
    //        slideIndex: 0
    //   };
    //   this.currentIndex = 0;
    //   this.pause = false;
    // }
     
    // componentDidMount() {
    //   var that = this;
    //   this.timeout = setTimeout(function () {
    //       that.goTo('auto')
    //     }, 3000);
    // }
    
    // componentDidUpdate() {
    //   var that = this;
    //   if(this.pause === true) {
    //     clearInterval(this.timeout);
    //     this.timePause = setTimeout(function(){
    //       clearInterval(this.timePause);        
    //     }, 8000);
    //     this.pause = false;
    //   }         
    //   this.timeout = setTimeout(function () {
    //     that.goTo('auto')
    //   }, 3000);
      
    // }
      
    // componentWillUnmount() {
    //   clearInterval(this.timeout);
    // }
    
    // goTo = (direction) => { 
    //     let index = 0;
    //     switch(direction) {
    //       case 'auto':
    //         index = this.currentIndex + 1;
    //         this.currentIndex = index >= this.props.listItems.length ? 0 : index;          
    //       break;
    //       case 'prev':
    //         index = this.currentIndex - 1;
    //         this.currentIndex = index < 0 ? this.props.listItems.length - 1 : index;
    //         this.pause = true;
    //       break;
    //       case 'next':
    //         index = this.currentIndex + 1;
    //         this.currentIndex = index >= this.props.listItems.length ? 0 : index;
    //         this.pause = true;
    //       break;
    //       default:
    //         this.currentIndex = direction;
    //         this.pause = true;
    //       break;
    //     }
    //      this.setState({
    //        slideIndex: this.currentIndex,
    //        slideshow: this.props.listItems[this.currentIndex]
    //      });
        
    // };
     
    render() {    
      return (
        <div className="slideshow-simple">
          <SlideItem 
            // title={this.state.slideshow.title}
            // content={this.state.slideshow.content}
            // img={this.state.slideshow.background}
            title={this.props.slideshow.title}
            content={this.props.slideshow.content}
            img={this.props.slideshow.background}
            slideshow={this.props.slideshow}
          />
          <Indicators 
            changeSlide={this.props.goTo} // function
            currentSlide={this.props.slideIndex}
            listItems={this.props.listItems}
            />
          {/* <div className="wrap-control">
            <button className="btn btn-prev" value="Prev" onClick={() => this.goTo('prev')}>Prev</button>   
            <button className="btn btn-next" value="Next" onClick={() => this.goTo('next')}>Next</button>          
          </div> */}
        </div>
      );
    }    
}

export default Slides;