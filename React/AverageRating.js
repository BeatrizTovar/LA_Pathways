import React, { Component } from 'react'
import { connect } from 'react-redux'
import { USER_TYPES } from '../../../enums/userTypes'
import * as reviewsService from '../../../services/reviewsService'
import StarRatings from 'react-star-ratings'

class UserProfileAverageRating extends Component {
    constructor(props){
        super(props)
        this.state={
            averageRating: 0,
        }        
    }
    
    componentDidMount(){
        const userId = this.props.userId
        if (userId) {
            this.getAvgRatings(userId)
        }
    }
    getAvgRatings (userId) {
        reviewsService.readRatingById(userId)
            .then(response => {
                if(response.item != undefined){
                    this.setState({averageRating: parseFloat(response.item)})
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        
        const loggedInTypeId = this.props.userProfile.userTypeId;
        const displayTypeId = this.props.userTypeId
        let val = loggedInTypeId === USER_TYPES.ADMINISTRATOR &&
            (displayTypeId === USER_TYPES.COACH || displayTypeId === USER_TYPES.MENTOR)
            ? true
            : false
        this.props.sendData(val); //Sent back to parent as trigger
        
        return (            
            <React.Fragment>
                <div className="container col-md-10  widget-ratings">
                    <div className="card-body text-center">
                        <h4 className="card-title">Average Rating</h4>
                        <StarRatings rating={this.state.averageRating} starRatedColor="#FFD700" numberOfStars={5} name='rating' />
                        <br /><br />
                        <h3><em>{this.state.averageRating} stars</em></h3>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => ({
    userProfile: state.userProfiles
})

export default connect(mapStateToProps)(UserProfileAverageRating);
