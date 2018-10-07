import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';

const styles = {
  dataTable: {
    marginBottom: '24px'
  }
};

export default ({items}) => (
  <Table style={styles.dataTable}>
    <TableHead>
      <TableRow key="headerrow">
        <TableCell>
          Title
        </TableCell>
        <TableCell>
          URL
        </TableCell>
        <TableCell>
          Lang
        </TableCell>
        <TableCell>
          type
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
      { items.map((
        {
          articleLocale,
          articleID,
          articleTitle,
          articleType,
          articleCategory,
          articleCategoryRU,
          articleLocation,
          articleTag,
          articleStatus,
          articleCreated

        }, idx) => (
        <TableRow  key={idx}>
          <TableCell>
            { articleTitle }
          </TableCell>
          <TableCell>
            { articleID }
          </TableCell>
          <TableCell>
            { articleLocale.toUpperCase() }
          </TableCell>
          <TableCell>
            { articleType }
          </TableCell>
          <TableCell>
            { articleCategory }
          </TableCell>
          <TableCell>
            { articleLocation }
          </TableCell>
          <TableCell>
            { articleStatus }
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);