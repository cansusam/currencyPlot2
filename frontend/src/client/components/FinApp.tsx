import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { Line, ChartData } from 'react-chartjs-2';
import * as chartjs from 'chart.js';
import { UnitRate } from '../../shared/Rates';
import { getRates } from '../utils/api-facade';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableRow,
  TableCell,
  Table,
  TableHead,
  Paper,
} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import { Currencylist, InstanceNumberList } from '../utils/Structures';
interface IState {
  data: UnitRate[];
  selectedRate: string;
  dataset?: ChartData<chartjs.ChartData>;
  instanceNumber: number;
  rowsPerPage: number;
  page: number;
}

const ROWS_PER_PAGE = [5, 10, 25, 100];

export class FinApp extends React.Component<any, IState> {
  isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [] as UnitRate[],
      selectedRate: Currencylist[0],
      instanceNumber: InstanceNumberList[0],
      rowsPerPage: ROWS_PER_PAGE[0],
      page: 0,
    };
  }

  public componentWillUnmount() {
    this.isMounted = false;
  }

  public handleCurrencyChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const currency = event.target.value;
    this.setState({
      selectedRate: currency,
    });
    this.handleClick(currency);
  }

  public handleInstanceNumberChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const instanceNumber = event.target.value;
    this.setState({
      // tslint:disable-next-line: radix
      instanceNumber: parseInt(instanceNumber),
    });
    this.handleClick(this.state.selectedRate);
  }

  public handleGetIterationDetails = () => {
    const dataPoints: number[] = [];
    const timeLabels: string[][] = [];
    if (this.state.data) {
      this.state.data.forEach((e, index) => {
        if (index > this.state.data.length - this.state.instanceNumber - 1) {
          dataPoints.push(e.rate);
          timeLabels.push([e.timestamp]);
        } else {
          return;
        }
      });
    }
    this.setState({
      dataset: {
        labels: timeLabels,
        datasets: [
          {
            label: this.state.selectedRate,
            backgroundColor: '#e1f7f1',
            borderColor: '#96ffe4',
            // lineTension: isChecked?0.0:0.2,
            data: dataPoints,
          },
        ],
      },
    });
  }
  
  public render() {
    const list = [];
    const handleChangePage = (event: unknown, newPage: number) => {
      this.setState({ page: newPage });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ page: 0, rowsPerPage: +event.target.value });
    };

    const { page, rowsPerPage } = this.state;

    return (
      <div>
        <Grid container spacing={24} style={{ padding: '20px' }}>
          <Grid container xs={12} style={{ padding: '20px' }}>
            <Grid item xs={2}>
              <FormControl>
                <InputLabel>Currency</InputLabel>
                <Select value={this.state.selectedRate} onChange={e => this.handleCurrencyChange(e)}>
                  {Currencylist.map(e => (
                    <MenuItem value={e}>{e}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl>
                <InputLabel>Instance Number</InputLabel>
                <Select
                  style={{ width: '130px' }}
                  value={this.state.instanceNumber}
                  onChange={e => this.handleInstanceNumberChange(e)}
                >
                  {InstanceNumberList.map(e => (
                    <MenuItem value={e}>{e}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl>
                <Button
                  style={{ marginTop: '10px', marginLeft: '20px' }}
                  onClick={() => this.handleClick(this.state.selectedRate)}
                  variant='contained'
                >
                  Get Values
                </Button>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container xs={12} style={{ padding: '20px' }}>
            <Grid item xs={6} style={{height: '20px'}}>
              {this.state.data !== undefined
                ? this.state.data.forEach((k, index) => {
                    if (index > this.state.data.length - this.state.instanceNumber - 1) {
                      list.push(
                        <TableRow>
                          <TableCell>{k.rate}</TableCell>
                          <TableCell>{k.timestamp}</TableCell>
                        </TableRow>,
                      );
                    }
                  })
                : null}
              {this.state.data !== undefined ? (
                <Paper>
                <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableCell>Rate</TableCell>
                      <TableCell>Date</TableCell>
                    </TableHead>
                    {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse()}
                    </Table>
                </TableContainer>
                <TablePagination
                rowsPerPageOptions={ROWS_PER_PAGE}
                component="div"
                count={this.state.instanceNumber}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                  </Paper>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <Line
                data={this.state.dataset ? this.state.dataset : {}}
                width={300}
                height={300}
                options={{
                  maintainAspectRatio: false,
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: this.state.selectedRate + ' Rates',
                  },
                  scales: {
                    xAxes: [
                      {
                        scaleLabel: {
                          display: true,
                          labelString: 'Date and Time',
                        },
                        gridLines: {
                          display: false,
                          lineWidth: 1,
                          zeroLineWidth: 1,
                          zeroLineColor: '#666666',
                          drawTicks: false,
                        },
                        ticks: {
                          display: true,
                          stepSize: 0,
                          min: 0,
                          autoSkip: false,
                          fontSize: 11,
                          padding: 12,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        scaleLabel: {
                          display: true,
                          labelString: this.state.selectedRate,
                        },
                      },
                    ],
                  },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }

  public async handleClick(currency: string) {
    const rates = await getRates(currency);
    this.setState({ data: rates });
    this.handleGetIterationDetails();
  }

  public async componentDidMount() {
    this.isMounted = true;
    this.handleClick(this.state.selectedRate);
    // setInterval(() => { this.handleClick(this.state.selectedRate) }, 60000);
  }
}
