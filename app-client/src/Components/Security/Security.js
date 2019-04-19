import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Col, Container, Row, UncontrolledTooltip } from "reactstrap";
import { GridLoader } from "react-spinners";
import axios from "axios";
import { CartesianGrid, Legend, Line, LineChart, Tooltip as Ttip, XAxis, YAxis } from "recharts";
import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./Security.css";

const BLUE = 0x4286f4;
const ORANGE = 0xf48942;

export default class Security extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: props.match.params.symbol,
      analysis: undefined,
      information: undefined,
      favorite: undefined,
      redirect: false,
      historicalData: undefined,

      tooltipOpen: false,
      tooltips: [
        {
          text: 'The Capital Asset Pricing Model (CAPM) provides the expected\
          return over the next 6 months. CAPM is widely used throughout\
          finance for pricing risky securities and generating expected\
          returns for assets given the risk of those assets and cost of capital.',
          target: 'ERtt'
        },
        {
          text: 'Standard deviation is a statistical measurement in finance that\
          sheds light\
          on the historical volatility of that investment. The greater the standard\
          deviation of a security, the greater the variance between each price and the\
          mean, which shows a larger price range.',
          target: 'SDtt'
        },
        {
          text: 'The Sharpe ratio\
          is used to help investors understand the return of an investment compared to\
          its risk. The ratio is the average return earned in excess of the risk-free\
          rate per unit of volatility or total risk. Generally, the greater the value\
          of the Sharpe ratio, the more attractive the risk-adjusted return.',
          target: 'SRtt'
        },
        {
          text: "A beta coefficient is a measure of the volatility, or systematic risk,\
          of an individual stock in comparison to the unsystematic risk of the entire market.\
          In statistical terms, beta\
          represents the slope of the line through a regression of data points from an individual\
          stock's returns against those of the market.",
          target: 'Betatt'
        },
        {
          text: "R-squared is a statistical measure that shows the percentage of a security's historical\
          price movements that could be explained by movements in a benchmark index.",
          target: 'R2tt'
        },
        {
          text: 'Value at risk (VaR) is a statistic that measures and quantifies the level of financial\
          risk within a firm, portfolio or position over a specific time frame. Risk managers use VaR to measure and control the level\
          of risk exposure.',
          target: 'VaRtt'
        }
      ]

    };
  }

  async componentDidMount() {
    const symbols = await this.getListOfSecurities();

    if (!symbols.includes(this.state.symbol) || this.state.symbol === `SPY`) {
      this.setState({ redirect: true });
    }

    const analysis = await this.getAnalysis();
    const historicalData = await this.getHistoricalData();
    const information = await this.getCompanyInformation();
    const favorites = await this.getFavorites();

    const favorite = favorites.includes(this.state.symbol) ? true : false;
    if (information.exchange === `Nasdaq Global Select`) {
      information.exchange = `NASDAQ`;
    }

    this.setState({ analysis, favorite, historicalData, information });
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

  getHistoricalData = async () => {
    const options = {
      method: `GET`,
      url: `/api/securities/historical/${this.state.symbol}`,
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

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/404" />;
    }

    const loading = this.state.analysis === undefined || this.state.favorite === undefined || this.state.information === undefined;

    if (loading) {
      return <GridLoader color="#4286f4" css={{ margin: `40vh auto auto auto` }}/>
    }

    const starClasses = [`fa-star`, styles.favoriteIcon];
    this.state.favorite ? starClasses.push(`fas`) : starClasses.push(`far`);

    const iconTitle = this.state.favorite ? `Remove from Favorites` : `Add to Favorites`;

    const color = this.lerpColor(ORANGE, BLUE, this.state.analysis.investabilityIndex / 100);

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

                      { this.state.tooltips.map((tooltip, i) => {
                        return (
                          <UncontrolledTooltip placement="right" target={tooltip.target}>
                          {tooltip.text}
                          </UncontrolledTooltip>
                        );
                      })}

                      <p><b>{this.state.analysis.expectedReturn}%</b></p>
                      <span id="ERtt">Expected Return</span>
                    </td>
                    <td className={styles.td2}>
                      <p><b>{this.state.analysis.standardDeviation}%</b></p>
                      <span id="SDtt">Standard Deviation</span>
                    </td>
                    <td className={styles.td1}>
                      <p><b>{this.state.analysis.sharpeRatio}</b></p>
                      <span id="SRtt">Sharpe Ratio</span>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.td3}>
                      <p><b>{this.state.analysis.beta}</b></p>
                      <span id="Betatt">Beta</span>
                    </td>
                    <td className={styles.td3}>
                      <p><b>{this.state.analysis.rSquared}</b></p>
                      <span id="R2tt">R Squared</span>
                    </td>
                    <td>
                      <p><b>{this.state.analysis.valueAtRisk}%</b></p>
                      <span id="VaRtt">Value at Risk</span>
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
            <LineChart className={styles.chart} width={900} height={400} data={this.state.historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date"/>
              <YAxis />
              <Ttip />
              <Legend />
              <Line type="natural" dataKey="SPY" stroke="#4286f4" strokeWidth={2} animationDuration={1400}/>
              <Line type="natural" dataKey={this.state.symbol} stroke="#82ca9d" strokeWidth={2} animationDuration={1400}/>
            </LineChart>
          </div>
          <h3 className={styles.chartHeader}>Portfolio Performance of {this.state.symbol} Compared To SPY </h3>
          <div className={styles.chartContainer}>
            <LineChart className={styles.chart} width={900} height={400} data={this.state.historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(value) => `${value.toLocaleString("en-US", { month: "long", year: "numeric" })}`}/>
              <YAxis type="number" domain={[40000, 120000]} tickFormatter={(value) => `$${value.toLocaleString()}`}/>
              <Ttip />
              <Legend />
              <Line type="natural" dataKey="PortfolioSPY" stroke="#4286f4" strokeWidth={2} animationDuration={1400}/>
              <Line type="natural" dataKey={`Portfolio${this.state.symbol}`} stroke="#82ca9d" strokeWidth={2} animationDuration={1400}/>
            </LineChart>
          </div>
          <p className={styles.chartFooter}>The chart above depicts the return on investment if $100,000 was invested in {this.state.symbol} compared to SPY 6 months prior.</p>
        </Container>
      </React.Fragment>
    );
  }
}
