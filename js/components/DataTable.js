import React from "react";
import ReactDOM from "react-dom";
import JsonTable from "react-json-table"

export default class DataTable extends React.Component {

  constructor() {
  	super()
  	this.state = {
    	row: false,
    	cell: false,
    	sort: false
  	}
    console.log("init")
  }

  changeData(rows) {
  	this.setState({rows})
  }

  render() {
    var me = this,
        // clone the rows
        items = this.props.rows.slice()

    // Sort the table
    console.log(this)
    console.log(this.state)
    if( this.state.sort ){
      items.sort( function( a, b ){
         return a[ me.state.sort ] > b[ me.state.sort ] ? 1 : -1;
      });
    }

    return <JsonTable
      rows={items}
      settings={ this.getSettings() }
      onClickCell={ this.onClickCell.bind(this) }
      onClickHeader={ this.onClickHeader.bind(this) }
      onClickRow={ this.onClickRow.bind(this) } />;
  }

  getSettings() {
      var me = this;
      // We will add some classes to the selected rows and cells
      return {
        keyField: 'name',
        cellClass: function( current, key, item){
          if( me.state.cell == key && me.state.row == item.name )
            return current + ' cellSelected';
          return current;
        },
        headerClass: function( current, key ){
            if( me.state.sort == key )
              return current + ' headerSelected';
            return current;
        },
        rowClass: function( current, item ){
          if( me.state.row == item.name )
            return current + ' rowSelected';
          return current;
        }
      };
  }

  onClickCell( e, column, item ){
    this.setState( {cell: column} );
  }

  onClickHeader( e, column ){
    this.setState( {sort: column} );
  }

  onClickRow( e, item ){
    this.setState( {row: item.name} );
  }  
}