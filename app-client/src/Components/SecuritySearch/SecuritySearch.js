import React, { Component } from "react";
import Select from "react-select";
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
      symbols: [],
      selectedOption: null
    };
  }

  async componentDidMount() {
    await this.getListOfSecurities();
  }

  getListOfSecurities = async () => {
    const options = {
      method: `GET`,
      url: `/api/securities/`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);

    const symbols = response.data.map((item) => {
      return {
        value: item.symbol,
        label: `${item.companyName} (${item.symbol})`
      };
    });

    this.setState({ symbols });
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  }

  render() {
    const { selectedOption } = this.state;

    if (selectedOption) {
      return window.location.assign(`/security/${selectedOption.value}`);
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
