import React, { Component } from 'react';
import './ImportWikiArticles.css';
import utils from "../lib/Utils";
import Papa from 'papaparse';
import wu from '../lib/WikiUtils';
import LoadingButton from '../ui/LoadingButton';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = {
  page: {
    margin: '96px 24px 24px 24px'
  },
  form: {
    marginTop: '24px',
    padding: '24px'
  },
  dataTable: {
    marginBottom: '24px'
  },
  multilineText: {
    width: '100%'
  },
  buttons: {
    marginRight: '24px'
  }
};

export default class ImportWikiArticles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataToImport: '',
      itemList: [],
      isLoading: false,
      message: ''
    };

    this.clearList = this.clearList.bind(this);
    this.importItems = this.importItems.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
  }

  handleChange = event => {
    let params = {
      ...this.state,
      ...utils.unfoldEvent(event)
    };
    this.setState({
      ...params
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log('submit');
    const results = Papa.parse(this.state.dataToImport, {
      header: true
    });
    if(results.data.length>0) {
      console.log('set item list');
      this.setState({ itemList: [ ...results.data ] });
    }
    console.log(results);
  };

  clearList() {
    this.setState( { itemList: [] });
  }

  handleProgress = (msg) => this.setState(msg);

  async importItems() {

    const getCategoriesList = () => [
      'Category',
      'Type',
      'Location',
      'Category_ru',
      'Tag'
    ];

    const splitCategory = (category) => category.split(',').map(c => c.trim());
    const addPrefix = (categoryName, categories) => categories.map(c => categoryName + ':' + c);

    const getExtraCategories = (item) => getCategoriesList()
      .map(c =>
        item[c.toLowerCase()]
          ? addPrefix(c, splitCategory(item[c.toLowerCase()]))
          : []
      )
      .reduce((acc, val) => acc.concat(val), []);


    for(let i=0; i<this.state.itemList.length; i++) {
      if(!this.state.itemList[i].url) {
        continue
      }

      console.log('extra', getExtraCategories(this.state.itemList[i]));


      console.log(`import item ${this.state.itemList[i].url}`);

      console.log('fetching from wiki...');
      this.setState({
        itemList: this.state.itemList.map((item, idx) => ({
          ...item,
          status: idx === i ? 'loading...' : item.status
        }))
      });

      const data = await wu.getArticle(this.state.itemList[i].url);

      console.log('saving...');
      this.setState({
        itemList: this.state.itemList.map((item, idx) => ({
          ...item,
          status: idx === i ? 'saving...' : item.status
        }))
      });

      let result = await wu.saveArticle(data, this.handleProgress, getExtraCategories(this.state.itemList[i]));
      console.log('done', result);

      this.setState({
        itemList: this.state.itemList.map((item, idx) => ({
          ...item,
          status: idx === i ? 'saved' : item.status
        }))
      });

    }
  }

  renderForm() {
    return(
      <form onSubmit={this.handleSubmit}>
        <TextField
          id="dataToImport"
          name="dataToImport"
          label="data in CSV format"
          multiline
          value={this.state.dataToImport}
          onChange={this.handleChange}
          margin="normal"
          style={styles.multilineText}
        />

        <Button variant="contained" color="primary" type="submit" style={styles.buttons}>Parse Data</Button>
        <Button onClick={this.props.history.goBack} style={styles.buttons}>Cancel</Button>
      </form>
    );
  }

  renderItem({ title, url, category, type, location, category_ru, tag, status }) {
    return(
      <TableRow key={url}>
        <TableCell>
          { title }
        </TableCell>
        <TableCell>
          { wu.getLanguage(url).toUpperCase() }
        </TableCell>
        <TableCell>
          { type }
        </TableCell>
        <TableCell>
          { category }
        </TableCell>
        <TableCell>
          { location }
        </TableCell>
        <TableCell>
          { status ? status : '.' }
        </TableCell>
      </TableRow>
    );
  }

  renderItemsList() {
    return (
      <Table style={styles.dataTable}>
        <TableHead>
          <TableRow>
            <TableCell>
              Title
            </TableCell>
            <TableCell>
              Locale
            </TableCell>
            <TableCell>
              Type
            </TableCell>
            <TableCell>
              Category
            </TableCell>
            <TableCell>
              Location
            </TableCell>
            <TableCell>
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            this.state.itemList.map(item => item.url ? this.renderItem(item) : null)
          }
        </TableBody>
      </Table>
    );
  }

  renderImportForm() {
    return(
      <div className="importForm">
        { this.renderItemsList()}
        <LoadingButton
          onClick={this.importItems}
          color="primary"
          disabled={false}
          text="Import Articles"
          loadingText="importing..."
          isLoading={this.state.isLoading}
          style={styles.buttons}
        />

        <Button onClick={this.clearList}>
          Cancel
        </Button>
        <Typography>
          { this.state.message }
        </Typography>
      </div>
    );
  }

  render() {
    return (
      <div style={styles.page}>
        <Typography variant={"title"}>
          <IconButton aria-label="go back" onClick={ this.props.history.goBack }>
            <ArrowBackIcon/>
          </IconButton>
          Add Links as CSV text
        </Typography>
        <Paper style={styles.form}>
        {
          this.state.itemList.length > 0
            ? this.renderImportForm()
            : this.renderForm()
        }
        </Paper>
      </div>
    )
  }
}