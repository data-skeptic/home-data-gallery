import React from "react";
import ReactDOM from "react-dom";
import JsonTable from "react-json-table"

export default class DataTable extends React.Component {

  constructor(props) {
  	super(props)
  	this.state = {
    	row: false,
    	cell: false,
    	sort: false
  	}
    this.getSettings = this.getSettings.bind(this)
  }

  render() {
    var olistings = this.props.listings
    var listings = JSON.parse(JSON.stringify(olistings))
    for (var i=0; i < listings.length; i++) {
      var listing = listings[i]
      delete listing['id']
      delete listing['submitter']
      delete listing['upload_timestamp']
      delete listing['raw_address']
      delete listing['size_units']
      delete listing['valid']
      delete listing['latitude']
      delete listing['longitude']
      delete listing['features']
      if (listing['address_object'] !== undefined) {
        listing['address'] = listing['address_object']['formatted_address']
        delete listing['address_object']
      }
      listing['listing_timestamp'] = listing['listing_timestamp'].substring(0, 10)
    }

    // Sort the table
    var me = this
    if( this.state.sort ){
      listings.sort( function( a, b ){
         return a[ me.state.sort ] > b[ me.state.sort ] ? 1 : -1;
      });
    }


    var columns = [
        {key: 'listing_timestamp', label: 'Timestamp'},
        {key: 'listing_type', label: 'Type'},
        {key: 'price', label: 'Price'},
        {key: 'bedrooms', label: 'Bedrooms'},
        {key: 'bathrooms', label: 'Bathrooms'},
        {key: 'building_size', label: 'Sq.ft.'},
        {key: 'address', label: 'Address'}
    ]

    return <JsonTable
      className={ "table table-striped table-hover table-sm" }
      rows={ listings }
      columns={ columns }
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