import React from 'react';
import { Table } from 'react-bootstrap';

const table = (props) => (
    <Table responsive>
    <thead>
        <tr>
        <th>#</th>
        {props.colnames.map(colname => (<th key={colname}>{colname}</th>))}
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>1</td>
        {props.data[1].map((col, index) => (<td key={col+'1'+index}>{col}</td>))}
        </tr>

        <tr>
        <td>2</td>
        {props.data[2].map((col, index) => (<td key={col+'2'+index}>{col}</td>))}
        </tr>

        <tr>
        <td>3</td>
        {props.data[3].map((col, index) => (<td key={col+'3'+index}>{col}</td>))}
        </tr>

        <tr>
        <td>4</td>
        {props.data[4].map((col, index) => (<td key={col+'4'+index}>{col}</td>))}
        </tr>

        <tr>
        <td>5</td>
        {props.data[4].map((col, index) => (<td key={col+'5'+index}>{col}</td>))}
        </tr>
    </tbody>
    </Table>
);

export default table;