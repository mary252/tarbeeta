import React, { Component } from 'react'

class BreadCrumb extends Component {
    draw_links = () => {
        let links = [];

        this.props.history.map((route, i) => (
            links.push(<a href={route.href} key={i}>{route.name}</a>)
        ))

        return links
    }

    render () {
        return (
            <div className="bc-wrap is-flex">
                {
                    this.draw_links()
                }

                <label>{this.props.activeRoute}</label>
            </div>
        )
    }
}

export default BreadCrumb