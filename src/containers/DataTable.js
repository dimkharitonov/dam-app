import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';

import Toolbar from '@material-ui/core/Toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';

import { lighten } from '@material-ui/core/styles/colorManipulator';


class DataTableHeader extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  createFilterHandler = property => event => {
    this.props.onRequestFilter(event, property);
  };

  render() {
    const styles = {
      filterField: {
        width: 'calc(100% - 12px)'
      }
    };

    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      columnData,
      withFilter
    } = this.props;

    return (
      <TableHead>
        {
          withFilter && (
            <TableRow>
              <TableCell padding="checkbox">
              </TableCell>
              {columnData.map(column => {
                return (
                  <TableCell
                    key={column.id}
                    numeric={column.numeric}
                    padding={column.disablePadding ? "none" : "default"}
                  >
                    <TextField
                      id={column.id}
                      name={column.id}
                      margin={'normal'}
                      label={column.label}
                      style={styles.filterField}
                      onChange={this.createFilterHandler(column.id)}
                    />
                  </TableCell>
                );
              }, this)}
            </TableRow>
          )
        }
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
                sortDirection={orderBy === column.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  };
}

DataTableHeader.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onRequestFilter: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnData: PropTypes.array.isRequired,
  withFilter: PropTypes.bool
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85)
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark
      },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

let DataTableToolbar = props => {
  const { numSelected, classes, tableTitle, onFilterClick, isFilterOpen, onAddClick } = props;
  const styles = { title: { marginRight: 24 } };
  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="title" id="tableTitle">
            <span style={styles.title}>{ tableTitle || 'Unknown'}</span>
            <IconButton color="primary" aria-label="Add" className={classes.button} onClick={onAddClick}>
              <AddIcon />
            </IconButton>
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <IconButton aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        ) : (
          <IconButton aria-label="Filter list" color={isFilterOpen? 'primary' : 'inherit'} onClick={onFilterClick}>
            <FilterListIcon />
          </IconButton>
        )}
      </div>
    </Toolbar>
  );
};

DataTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  tableTitle: PropTypes.string,
  onFilterClick: PropTypes.func,
  isFilterOpen: PropTypes.bool
};

DataTableToolbar = withStyles(toolbarStyles)(DataTableToolbar);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class DataTable extends Component {
  constructor(props, context) {
    super(props, context);

    const { data, orderBy, rowsPerPage, columnData, tableTitle, idKey, onAddClick } = props;

    this.state = {
      order: "asc",
      orderBy,
      selected: [],
      data,
      rowsPerPage,
      page: 0,
      columnData,
      tableTitle,
      idKey,
      onAddClick,
      isFilterOpen: false,
      filters: {}
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    const data =
      order === "desc"
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleRequestFilter = (event, property) => {
    let filters = {...this.state.filters};
    filters[property] = event.target.value;
    this.setState({
      filters
    })
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n[this.state.idKey]) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleSelectClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleRowClick = (event, id) => {
    console.log('row click', id);
    return;
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 });
  };

  handleFilterClick = (event) => {
    let params = { isFilterOpen: !this.state.isFilterOpen };
    if(this.state.isFilterOpen) {
      params.filters = {}
    }
    this.setState(params);
  };

  filterData = data => {
    const { filters } = this.state;
    return Object.keys(filters).reduce((result, key) => {
      return (result || !filters[key])
        && data[key]
        && data[key].toLowerCase().indexOf(filters[key].toLowerCase()) > -1;
    }, true);
  };

  getData = () => this.state.data.filter(item => this.filterData(item));

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const data = this.getData();
    const {
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      columnData,
      tableTitle,
      idKey,
      isFilterOpen,
      onAddClick
    } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);


    return (
      <Paper className={classes.root}>
        <DataTableToolbar
          numSelected={selected.length}
          tableTitle={tableTitle}
          isFilterOpen={isFilterOpen}
          onFilterClick={this.handleFilterClick}
          onAddClick={onAddClick}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <DataTableHeader
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              onRequestFilter={this.handleRequestFilter}
              rowCount={data.length}
              columnData={columnData}
              withFilter={isFilterOpen}
            />
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n[idKey]);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleRowClick(event, n[idKey])}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n[idKey]}
                      selected={isSelected}
                    >


                      <TableCell padding="checkbox" onClick={event => this.handleSelectClick(event, n[idKey])}>
                        <Checkbox checked={isSelected} />
                      </TableCell>

                      {columnData.map(column => {
                        return (
                          <TableCell
                            key={column.id}
                            numeric={column.numeric}
                            padding={column.disablePadding ? "none" : "default"}
                          >
                            { n[column.id] }
                          </TableCell>
                        );
                      }, this)}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

DataTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DataTable);
