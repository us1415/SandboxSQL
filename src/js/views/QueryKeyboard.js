var React = require('react-native');
var {
  ActivityIndicatorIOS,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  PropTypes,
  TextInput,
  ScrollView,
} = React;

var DBInfo = require('../data/DBInfo');

var QueryKeyboard = React.createClass({

  propTypes: {
    database: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      isLoadingTables: true,
      isLoadingCols: true,
      tables: null,
      tableInfo: {},
    };
  },

  componentDidMount: function() {
    DBInfo.getTables(this.props.database, (tables) => {
      this.setState(
        {
          tables,
          isLoadingTables: false,
        },
        () => this.getCols(),
      );
    });
  },

  getCols: function() {
    this.state.tables.forEach((tableName) => {
      DBInfo.getColumnsForTable(
        this.props.database, 
        tableName,
        (cols) => {
          var tableInfo = this.state.tableInfo;
          tableInfo[tableName] = cols;
          this.setState({
            tableInfo,
          }, () => {
            if (Object.keys(this.state.tableInfo).length ===
                this.state.tables.length) {
              this.setState({
                isLoadingCols: false,
              })
            }
          });
        },
      );
    });
  },

  render: function() {
    if (this.state.isLoadingTables) {
      return (
        <View style={[styles.wrapper, styles.loading]}>
          <ActivityIndicatorIOS
            size="large" 
            color="grey"
          />
        </View>
      );
    }

    return (
      <ScrollView style={styles.wrapper}>
        {this.state.tables.map(
          tableName => this.renderTable(tableName),
        )}
      </ScrollView>
    );
  },

  renderTable: function(tableName) {
    var cols = this.state.tableInfo[tableName];
    var content = null;
    if (!cols) {
      content = (
        <ActivityIndicatorIOS
          size="small"
          color="grey"
        />
      );
    } else {
      content = cols.map(col =>
        <Text key={`${tableName}_${col.name}`}>
          {col.name}
        </Text>
      );
    }

    return (
      <View key={tableName}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableName}>
            {tableName}
          </Text>
        </View>
        {content}
      </View>
    );
  },

});

var styles = StyleSheet.create({
  tableHeader: {
    alignItems: 'center',
  },
  tableName: {
    color: '#0066cc',
  },
  wrapper: {
    flex: 1,
  },
  loading: {
    padding: 10,
  },
});

module.exports = QueryKeyboard;
