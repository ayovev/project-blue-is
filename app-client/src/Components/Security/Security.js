import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Container, Row } from "reactstrap";
import axios from "axios";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./Security.css";

// test data for chart
const data = [
  { ticker: 45,
    SPY: 55,
    day: `June 18`
  },
  { ticker: 55,
    SPY: 60,
    day: `July 18`
  },
  { ticker: 35,
    SPY: 55,
    day: `Aug 18`
  },
  { ticker: 45,
    SPY: 50,
    day: `Sep 18`
  },
  { ticker: 80,
    SPY: 70,
    day: `Oct 18`
  },
  { ticker: 90,
    SPY: 85,
    day: `Nov 18`
  },
  { ticker: 30,
    SPY: 40,
    day: `Dec 18`
  },
  { ticker: 90,
    SPY: 95,
    day: `Feb 19`
  },
  { ticker: 120,
    SPY: 115,
    day: `Mar 19`
  }
];

export default class Security extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: props.match.params.symbol,
      beta: undefined,
      expectedReturn: undefined,
      investabilityIndex: undefined,
      rSquared: undefined,
      sharpeRatio: undefined,
      standardDeviation: undefined,
      valueAtRisk: undefined,

      favorite: undefined,
      redirect: false
    };
  }

  async componentDidMount() {
    const symbols = await this.getListOfSecurities();

    if (!symbols.includes(this.state.symbol)) {
      this.setState({ redirect: true });
    }

    const analysisData = await this.getAnalysisData();

    const { beta, expectedReturn, investabilityIndex, rSquared, sharpeRatio, standardDeviation, valueAtRisk } = analysisData;

    this.setState({
      beta,
      expectedReturn,
      investabilityIndex,
      rSquared,
      sharpeRatio,
      standardDeviation,
      valueAtRisk
    });

    const favorites = await this.getFavorites();
    const favorite = favorites.includes(this.state.symbol) ? true : false;
    this.setState({ favorite });
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

  getAnalysisData = async () => {
    const options = {
      method: `GET`,
      url: `/api/securities/${this.state.symbol}`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    return response.data;
  }

  getFavorites = async () => {
    const options = {
      method: `GET`,
      url: `/api/users/favorites`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    return response.data;
  }

  getListOfSecurities = async () => {
    const options = {
      method: `GET`,
      url: `/api/securities/`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);

    return response.data.map((item) => {
      return item.symbol;
    });
  }

  toggleFavorite = async () => {
    const data = { symbol: this.state.symbol };

    const options = {
      method: `PUT`,
      url: `/api/users/favorites`,
      resolveWithFullResponse: true,
      data
    };

    await axios(options);
    this.setState({ favorite: !this.state.favorite });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/404" />;
    }

    if (this.state.investabilityIndex === undefined || this.state.favorite === undefined) {
      return null;
    }

    const starClasses = [`fa-lg`, `fa-star`];
    this.state.favorite ? starClasses.push(`fas`) : starClasses.push(`far`);

    const color = this.lerpColor(0xf48942, 0x4286f4, this.state.investabilityIndex / 100);

    return (
      <React.Fragment>
        <Container className={styles.containerStyling}>
          <Row className="Row">
            <h3>Security Results</h3>
          </Row>
          <Row className="Row">
            <hr className={styles.hr1}/>
          </Row>
          <Row className="Row">
            <h1>{this.state.symbol}</h1>
              <i onClick={this.toggleFavorite} className={starClasses.join(` `)}></i>
          </Row>
          <Row className="Row">
            companyName
            <hr className={styles.hr2}/>
          </Row>
          <div>
            <Row className="float-left" style={{ marginLeft: `5%` }}>
              <CircularProgressbar className="radialAnimation"
                percentage={this.state.investabilityIndex}
                text={`${this.state.investabilityIndex}`}
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
            </Row>
            <Row className="float-right" style={{ marginRight: `5%` }}>
              <table>
                <tbody>
                  <tr>
                    <td className={styles.td2}>
                      <b>{this.state.expectedReturn}%</b>
                      <br/><br/>
                    Expected Return
                    </td>
                    <td className={styles.td2}>
                      <b>{this.state.valueAtRisk}%</b>
                      <br/><br/>
                    Value at Risk
                    </td>
                    <td className={styles.td1}>
                      <b>{this.state.beta}</b>
                      <br/><br/>
                    Beta
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td3}>
                      <b>{this.state.rSquared}</b>
                      <br/><br/>
                    R Squared
                    </td>
                    <td className={styles.td3}>
                      <b>{this.state.sharpeRatio}</b>
                      <br/><br/>
                    Sharpe Ratio
                    </td>
                    <td>
                      <b>{this.state.standardDeviation}%</b>
                      <br/><br/>
                    Standard Deviation
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
          </div>
          <div style={{ clear: `both` }}></div>
        </Container>
        <Container className={styles.containerStyling}>
          <Row className="Row">
            <hr className={styles.hr2}/>
          </Row>
          <Row className="Row">
            <h3>Historical Performance of {this.state.symbol}</h3>
          </Row>
          <Row className="Row">
            <LineChart className={styles.chart} width={900} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="natural" dataKey="SPY" stroke="#4286f4" strokeWidth={2} animationDuration={1200}/>
              <Line type="natural" dataKey="ticker" stroke="#82ca9d" strokeWidth={2} animationDuration={1200}/>
            </LineChart>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
