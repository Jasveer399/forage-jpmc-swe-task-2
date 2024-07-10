import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;
  viewer: PerspectiveViewerElement | null = null;

  componentDidMount() {
    // Get element from the DOM.
    this.viewer = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      this.viewer.load(this.table);
      this.viewer.setAttribute('view', 'y_line');
      this.viewer.setAttribute('column-pivots', '["stock"]');
      this.viewer.setAttribute('row-pivots', '["timestamp"]');
      this.viewer.setAttribute('columns', '["top_ask_price"]');
      this.viewer.setAttribute('aggregates', JSON.stringify({
        stock: 'distinct count',
        top_ask_price: 'avg',
        top_bid_price: 'avg',
        timestamp: 'distinct count',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(
        this.props.data.map((el: any) => ({
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        }))
      );
    }
  }

  render() {
    return React.createElement('perspective-viewer');
  }
}

export default Graph;