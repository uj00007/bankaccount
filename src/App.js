import React from "react";
import "./App.css";
import axios from "axios";
import {
  Card,
  Pagination,
  InputGroup,
  FormControl,
  Button
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filtered_data: [],
      page_data: {},
      page: 1,
      search_string: "",
      date_sort: 1,
      value_date_sort: 1,
      amount_sort: 1
    };
  }
  setPageData(data = []) {
    let map = {};
    let ctr = 1;
    let l = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      element["actual_date"] = new Date(element["Date"]);
      element["actual_value_date"] = new Date(element["Value Date"]);
      l.push(element);
      if ((index + 1) % 10 === 0 && index !== 0) {
        map[ctr] = l;
        ctr++;
        l = [];
      }
    }
    if (l.length !== 0) {
      map[ctr] = l;
    }
    this.setState({ page_data: map, filtered_data: data });
  }
  async getDataAxios() {
    const response = await axios.get(
      "http://starlord.hackerearth.com/bankAccount"
    );
    // console.log(response.data);
    this.setState({ data: response.data, filtered_data: response.data });
    this.setPageData(response.data);
  }
  componentDidMount() {
    this.getDataAxios();
  }

  renderPaginationBlock() {
    let active = this.state.page;
    let items = [];
    for (
      let number = 1;
      number <= Object.keys(this.state.page_data).length;
      number++
    ) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === active}
          onClick={() => this.setState({ page: number })}
        >
          {number}
        </Pagination.Item>
      );
    }
    return (
      <Pagination>
        <Pagination.First onClick={() => this.setState({ page: 1 })} />
        <Pagination.Prev
          onClick={() =>
            this.setState({
              page: this.state.page >= 2 ? this.state.page - 1 : 1
            })
          }
        />
        {items}
        <div>
          <Pagination.Next
            onClick={() =>
              this.setState({
                page:
                  this.state.page !== Object.keys(this.state.page_data).length
                    ? this.state.page + 1
                    : this.state.page
              })
            }
          />
        </div>
        <Pagination.Last
          onClick={() =>
            this.setState({ page: Object.keys(this.state.page_data).length })
          }
        />
      </Pagination>
    );
  }
  searchbyaccountno() {
    let data = this.state.data;
    let finalList = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      console.log(element["Account No"]);

      if (
        element["Account No"]
          .toString()
          .toLowerCase()
          .includes(this.state.search_string.toString().toLowerCase()) ||
        element["Transaction Details"]
          .toString()
          .toLowerCase()
          .includes(this.state.search_string.toString().toLowerCase()) ||
        element["Date"]
          .toString()
          .toLowerCase()
          .includes(this.state.search_string.toString().toLowerCase()) ||
        element["Balance AMT"]
          .toString()
          .toLowerCase()
          .includes(this.state.search_string.toString().toLowerCase())
      ) {
        finalList.push(element);
      }
    }
    console.log(finalList);
    this.setPageData(finalList);
  }

  sortResultsByDate() {
    let sortedActivities = [];
    if (this.state.date_sort) {
      sortedActivities = this.state.filtered_data
        .slice()
        .sort((a, b) => b.actual_date - a.actual_date);
    } else {
      sortedActivities = this.state.filtered_data
        .slice()
        .sort((a, b) => a.actual_date - b.actual_date);
    }

    console.log(sortedActivities);
    this.setState({ date_sort: !this.state.date_sort });
    this.setPageData(sortedActivities);
  }
  sortResultsByValueDate() {
    let sortedActivities = [];
    if (this.state.value_date_sort) {
      sortedActivities = this.state.filtered_data
        .slice()
        .sort((a, b) => b.actual_value_date - a.actual_value_date);
    } else {
      sortedActivities = this.state.filtered_data
        .slice()
        .sort((a, b) => a.actual_value_date - b.actual_value_date);
    }
    this.setState({ value_date_sort: !this.state.value_date_sort });

    console.log(sortedActivities);
    this.setPageData(sortedActivities);
  }
  sortResultsByBalanceAmount() {
    let sortedActivities = [];

    if (this.state.amount_sort) {
      sortedActivities = this.state.filtered_data
        .slice()
        .sort(
          (a, b) => parseFloat(b["Balance AMT"]) - parseFloat(a["Balance AMT"])
        );
    } else {
      sortedActivities = this.state.filtered_data
        .slice()
        .sort(
          (a, b) => parseFloat(a["Balance AMT"]) - parseFloat(b["Balance AMT"])
        );
    }
    this.setState({ amount_sort: !this.state.amount_sort });

    console.log(sortedActivities);
    this.setPageData(sortedActivities);
  }

  dataReset() {
    this.setPageData(this.state.data);
  }

  render() {
    return (
      <div className="App">
        <body className="App-header">
          <div>
            <h2 style={{ color: "white" }}>Account Details..</h2>
          </div>
          <div style={{ width: "40%", minWidth: "25rem" }}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search by account number of recipient | transaction Details | Date | Balance"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                onChange={value =>
                  this.setState({ search_string: value.target.value })
                }
              />
              <InputGroup.Append>
                <Button
                  variant="outline-secondary"
                  onClick={() => this.searchbyaccountno()}
                >
                  Search
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div
            style={{
              flexDirection: "row",
              paddingTop: "1rem",
              paddingBottom: "1rem"
            }}
          >
            <Button
              style={{ marginRight: "2rem", marginBottom: "1rem" }}
              variant="outline-secondary"
              onClick={() => this.dataReset()}
            >
              Reset Results
            </Button>
            <Button
              style={{ marginRight: "2rem", marginBottom: "1rem" }}
              variant="outline-secondary"
              onClick={() => this.sortResultsByDate()}
            >
              Sort By Date
            </Button>
            <Button
              style={{ marginRight: "2rem", marginBottom: "1rem" }}
              variant="outline-secondary"
              onClick={() => this.sortResultsByValueDate()}
            >
              Sort By Value Date
            </Button>
            <Button
              style={{ marginRight: "2rem", marginBottom: "1rem" }}
              variant="outline-secondary"
              onClick={() => this.sortResultsByBalanceAmount()}
            >
              Sort By Amount
            </Button>
          </div>

          {this.state.page_data &&
          Object.keys(this.state.page_data).length !== 0 &&
          this.state.page_data !== {} ? (
            this.state.page_data[this.state.page].map(item => (
              <Card
                style={{
                  width: "40%",
                  marginBottom: "3rem",
                  minWidth: "25rem"
                }}
              >
                <Card.Body>
                  <Card.Title>{item["Date"]}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {item["Account No"]}
                  </Card.Subtitle>
                  <Card.Text>{item["Transaction Details"]}</Card.Text>
                  <Card.Text style={{ color: "red" }}>
                    -{" "}
                    {item["Withdrawal AMT"] === ""
                      ? "0.00"
                      : item["Withdrawal AMT"]}
                  </Card.Text>
                  <Card.Text style={{ color: "green" }}>
                    +{" "}
                    {item["Deposit AMT"] === "" ? "0.00" : item["Deposit AMT"]}
                  </Card.Text>
                  <div
                    style={{
                      width: "50%",
                      height: "0.1rem",
                      color: "black",
                      backgroundColor: "black",
                      marginBottom: "1rem"
                    }}
                  ></div>
                  <Card.Text>{item["Balance AMT"]}</Card.Text>

                  {/* <Card.Link href="#">Card Link</Card.Link>
                  <Card.Link href="#">Another Link</Card.Link> */}
                </Card.Body>
              </Card>
            ))
          ) : (
            <div></div>
          )}
          <div>{this.renderPaginationBlock()}</div>
        </body>
      </div>
    );
  }
}

export default App;
