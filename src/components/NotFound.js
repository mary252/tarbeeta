import React, { Component } from 'react'
import { EmptyPage } from '.';

class NotFound extends Component {
    render () {
        return (
            <EmptyPage
                locale={this.props.locale}
                {...this.props}
                lang={this.props.lang}
                FouroFour
              />
        )
    }
}

export default NotFound;