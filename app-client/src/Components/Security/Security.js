import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
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
      analysis: undefined,
      information: undefined,

      favorite: undefined,
      redirect: false
    };
  }

  async componentDidMount() {
    const symbols = await this.getListOfSecurities();

    if (!symbols.includes(this.state.symbol) || this.state.symbol === `SPY`) {
      this.setState({ redirect: true });
    }

    const analysis = await this.getAnalysis();
    const information = await this.getCompanyInformation();
    const favorites = await this.getFavorites();

    const favorite = favorites.includes(this.state.symbol) ? true : false;
    if (information.exchange === `Nasdaq Global Select`) {
      information.exchange = `NASDAQ`;
    }

    this.setState({ analysis, favorite, information });
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

  getAnalysis = async () => {
    const options = {
      method: `GET`,
      url: `/api/securities/analysis/${this.state.symbol}`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    return response.data;
  }

  getCompanyInformation = async () => {
    const options = {
      method: `GET`,
      url: `/api/securities/companyInformation/${this.state.symbol}`,
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

    if (this.state.analysis === undefined || this.state.favorite === undefined || this.state.information === undefined) {
      return null;
    }

    const starClasses = [`fa-star`, styles.favoriteIcon];
    this.state.favorite ? starClasses.push(`fas`) : starClasses.push(`far`);

    const iconTitle = this.state.favorite ? `Remove from Favorites` : `Add to Favorites`

    const color = this.lerpColor(0xf48942, 0x4286f4, this.state.analysis.investabilityIndex / 100);

    return (
      <React.Fragment>
        <Container className={styles.container}>
          <Row className={styles.row}>
            <Col xs={9} className={styles.informationContainer}>
              <h1 className={styles.symbol}>{this.state.symbol}<i onClick={this.toggleFavorite} title={iconTitle} className={starClasses.join(` `)}/></h1>
              <p className={styles.companyNameAndExchange}>{this.state.information.companyName} | {this.state.information.exchange}</p>
              <p className={styles.sectorAndIndustry}>{this.state.information.sector} | {this.state.information.industry}</p>
            </Col>
            <Col xs={3} className={styles.logoContainer}>
              <img className={styles.logo} src={this.state.information.logo} alt="company logo"/>
            </Col>
            <Col xs={9} className={styles.descriptionContainer}>
              <p>{this.state.information.description}</p>
            </Col>
          </Row>
          <hr className={styles.hr}/>
          <Row className={styles.row}>
            <Col xs={6} className={styles.gaugeContainer}>
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
            </Col>
            <Col xs={6} className={styles.tableContainer}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td className={styles.td2}>
                      <b>{this.state.analysis.expectedReturn}%</b>
                      <br/><br/>
                    Expected Return
                    </td>
                    <td className={styles.td2}>
                      <b>{this.state.analysis.standardDeviation}%</b>
                      <br/><br/>
                    Standard Deviation
                    </td>
                    <td className={styles.td1}>
                      <b>{this.state.analysis.sharpeRatio}</b>
                      <br/><br/>
                    Sharpe Ratio
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td3}>
                      <b>{this.state.analysis.beta}</b>
                      <br/><br/>
                    Beta
                    </td>
                    <td className={styles.td3}>
                      <b>{this.state.analysis.rSquared}</b>
                      <br/><br/>
                    R Squared
                    </td>
                    <td>
                      <b>{this.state.analysis.valueAtRisk}%</b>
                      <br/><br/>
                    Value at Risk
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </Container>
        <Container className={styles.container}>
          <hr className={styles.hr}/>
          <h3 className={styles.chartHeader}>Historical Performance of {this.state.symbol}</h3>
          <div className={styles.chartContainer}>
            <LineChart className={styles.chart} width={900} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="natural" dataKey="SPY" stroke="#4286f4" strokeWidth={2} animationDuration={1200}/>
              <Line type="natural" dataKey="ticker" stroke="#82ca9d" strokeWidth={2} animationDuration={1200}/>
            </LineChart>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}
