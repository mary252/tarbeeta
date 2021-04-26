import React, { Component, Fragment } from 'react';
import { writeReview } from "../../services";
import { connect } from "react-redux";
import * as actions from "../../actions";


class StarsRating extends Component {

    state = {
        rating: this.props.rating || null,
        temp_rating: null
    }
    
    rate = (rating) => {
        this.setState({
            rating: rating,
            temp_rating: rating
        }, async() => {

            let data = {
                order_id: this.props.order.order_id,
                quality: this.state.rating
            }

            try{
                let res = await writeReview(this.props.item.variation_id, data);
                this.props.init_notification({
                    type: "success",
                    title: this.props.locale.success,
                    message: this.props.locale.review_added
                });
            }catch(e){
                this.props.init_notification({
                    type: "error",
                    title: this.props.locale.error,
                    message: this.props.locale.error_message
                });
            }
        });
    }
    star_over = (rating) => {
        this.state.temp_rating = this.state.rating;
        this.state.rating = rating;
        
        this.setState({
            rating: this.state.rating,
            temp_rating: this.state.temp_rating
        });
    }
    star_out = () => {
        this.state.rating = this.state.temp_rating;
        
        this.setState({ rating: this.state.rating });
    }


    draw_stars = () => {
        let stars = [];

        for(let i = 1; i < 6; i++){
            var klass = 'star-rating__star';
          
          if (this.state.rating >= i && this.state.rating != null) {
            klass += ' is-selected';
          }
    
          stars.push(
            <label
                key={i}
                className={klass}
                onClick={() => this.rate(i)}
                onMouseOver={() => this.star_over(i)}
                onMouseOut={this.star_out}>
            </label>
          )
        }

        return stars;
    }


    render(){
        const { name, item, locale, lang } = this.props;
        return (
            <div className={`rate-block ${lang == 'ar' ? 'rtl jcs' : ''}`}>
                <div className={`star-rating ${lang == 'ar' ? 'mar-left-15' : 'mar-right-15'}`}>
                    {this.draw_stars()}
                </div>
                <h3 className="rate-it-text">{locale.rate_it_placeholder}</h3>
            </div>
        );
    }
}

export default connect(null, actions)(StarsRating);