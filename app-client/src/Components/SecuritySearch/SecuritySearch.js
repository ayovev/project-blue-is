import React, { Component } from "react";
import Select from "react-select";
import { Redirect } from "react-router-dom";
import { LineChart, Line } from "recharts";
import axios from 'axios';
import styles from "./SecuritySearch.css";

// test data for chart
const data = [
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 }
];

export default class SecuritySearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbols: undefined,
      selectedOption: null
    };
  }

  async componentDidMount() {
    let symbols = await this.getListOfSecurities();

    symbols = symbols.filter((item) => {
      return item.symbol !== `SPY`;
    });

    symbols = symbols.sort((a, b) => a.companyName > b.companyName ? 1 : -1);

    symbols = symbols.map((item) => {
      return {
        value: item.symbol,
        label: `${item.companyName} (${item.symbol})`
      };
    });

    this.setState({ symbols });
  }

  getListOfSecurities = async () => {
    const options = {
      method: `GET`,
      url: `/api/securities/`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    return response.data;
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  }

  render() {
    if (this.state.symbols === undefined) {
      return null;
    }
    const { selectedOption } = this.state;

    if (selectedOption) {
      return <Redirect to={`security/${selectedOption.value}`} />;
      // return window.location.assign(`/security/${selectedOption.value}`);
    }

    return (
      <React.Fragment>
        <div>
          {/* Possibly include some kind of chart here before the text to add a dynamic branding component to the page? */}
          <LineChart className={styles.chart} width={75} height={75} data={data}>
            <Line type="natural" dataKey="value" stroke="#4286f4" strokeWidth={2} dot={null} animationDuration={1200}/>
          </LineChart>
        </div>
        <h1 className={styles.preFormText}>Security Search</h1>
        <br/>
        <Select
          className={styles.container}
          value={selectedOption}
          onChange={this.handleChange}
          options={this.state.symbols}
        />
      </React.Fragment>

    );
  }
}
