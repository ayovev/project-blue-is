import React, { Component } from "react";
import { NavLink as RRNavLink } from 'react-router-dom';
import { Card, CardText, CardTitle, NavLink } from "reactstrap";
import { GridLoader } from "react-spinners";
import CircularProgressbar from "react-circular-progressbar";
import axios from "axios";
import "react-circular-progressbar/dist/styles.css";
import styles from "../FavoritesCard/FavoritesCard.css";

const BLUE = 0x4286f4;
const ORANGE = 0xf48942;

export default class FavoritesCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      analysis: undefined
    };
  }

  async componentDidMount() {
    const analysis = await this.getAnalysis();

    this.setState({ analysis });
  }

  getAnalysis = async () => {
    const options = {
      method: `GET`,
      url: `/api/securities/analysis/${this.props.symbol}`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    return response.data;
  }

  lerpColor = (minimumColor, maximumColor, amount) => {
    /* eslint-disable */
    const micR = minimumColor >> 16;
    const micG = minimumColor >> 8 & 0xff;
    const micB = minimumColor & 0xff;

    const macR = maximumColor >> 16;
    const macG = maximumColor >> 8 & 0xff;
    const macB = maximumColor & 0xff;

    const resultR = micR + amount * (macR - micR);
    const resultG = micG + amount * (macG - micG);
    const resultB = micB + amount * (macB - micB);
    return ((resultR << 16) + (resultG << 8) + (resultB | 0)).toString(16);
    /* eslint-enable */
  }

  render() {
    if (this.state.analysis === undefined) {
      return <GridLoader color="#4286f4" css={{ margin: `50% 50% auto auto` }}/>;
    }

    const color = this.lerpColor(ORANGE, BLUE, this.state.analysis.investabilityIndex / 100);

    return (
      <React.Fragment>
        <NavLink className={styles.navlink} to={`/security/${this.props.symbol}`} tag={RRNavLink}>
          <Card body className={styles.card}>
            <CardTitle>{this.props.symbol}<button type="button" className="close" aria-label="Close" onClick={this.props.onClick}>
              <span aria-hidden="true">&times;</span>
            </button></CardTitle>
            <CardText>
              <CircularProgressbar
                className={styles.gauge}
                percentage={this.state.analysis.investabilityIndex}
                text={`${this.state.analysis.investabilityIndex}`}
                initialAnimation={true}
                strokeWidth={4}
                styles={{
                  path: {
                    stroke: color,
                    strokeLinecap: `butt`,
                    transition: `stroke-dashoffset 0.5s ease 0s`
                  },
                  trail: {
                    stroke: `#d6d6d6`
                  },
                  text: {
                    fill: color,
                    fontSize: `30px`
                  }
                }}
              />
            </CardText>
          </Card>
        </NavLink>
      </React.Fragment>
    );
  }
}

