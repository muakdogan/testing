import React, { Component } from "react";
import ReactTable from "react-table";
import Chance from "chance";
import "react-table/react-table.css";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import treeTableHOC from "react-table/lib/hoc/treeTable";
import Studies from "./studies";
import { getSubjects } from "../../services/subjectServices";

const SelectTreeTable = selectTableHOC(treeTableHOC(ReactTable));
const chance = new Chance();
function getNodes(data, node = []) {
  data.forEach(item => {
    if (item.hasOwnProperty("_subRows") && item._subRows) {
      node = getNodes(item._subRows, node);
    } else {
      node.push(item._original);
    }
  });
  return node;
}

class Subjects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pid: this.props.pid,
      columns: [],
      selection: [],
      selectAll: false,
      selectType: "checkbox",
      expanded: {}
    };
  }

  async componentDidMount() {
    const {
      data: {
        ResultSet: { Result: data }
      }
    } = await getSubjects(this.props.pid);
    this.setState({ data });
    this.setState({ columns: this.setColumns() });
  }

  incColumns = ["subjectName", "numberOfStudies"];
  getColumns(data) {
    const columns = [];
    const sample = data[0];
    for (let key in sample) {
      console.log("key is " + key);
      if (this.incColumns.includes(key)) {
        columns.push({
          accessor: key,
          Header: key,
          style: { whiteSpace: "normal" }
        });
      }
    }
    return columns;
  }

  setColumns() {
    const columns = [
      {
        Header: (
          <div>
            Subject{" "}
            <span className="badge badge-secondary"> # of Annotations </span>
          </div>
        ),
        Cell: row => (
          <div>
            {this.cleanCarets(row.original.subjectName)} &nbsp;
            {row.original.numberOfAnnotations === 0 ? (
              ""
            ) : (
              <span className="badge badge-secondary">
                {" "}
                {row.original.numberOfAnnotations}{" "}
              </span>
            )}
          </div>
        )
      },
      {
        Header: (
          <div>
            <span className="badge badge-secondary"> # of Studies </span>
          </div>
        ),
        Cell: row => (
          <div>
            {row.original.numberOfStudies === 0 ? (
              ""
            ) : (
              <span className="badge badge-secondary">
                {" "}
                {row.original.numberOfStudies}{" "}
              </span>
            )}
          </div>
        )
      }
    ];
    return columns;
  }

  cleanCarets(string) {
    var i = 0,
      length = string.length;
    for (i; i < length; i++) {
      string = string.replace("^", " ");
    }
    return string;
  }

  getData(projects) {
    console.log("Projects :" + this.projects);
    const data = projects.map(item => {
      // using chancejs to generate guid
      // shortid is probably better but seems to have performance issues
      // on codesandbox.io
      const _id = chance.guid();
      return {
        _id,
        ...item
      };
    });
    return data;
  }

  toggleSelection = (key, shift, row) => {
    /*
      Implementation of how to manage the selection state is up to the developer.
      This implementation uses an array stored in the component state.
      Other implementations could use object keys, a Javascript Set, or Redux... etc.
    */
    // start off with the existing state
    if (this.state.selectType === "radio") {
      let selection = [];
      if (selection.indexOf(key) < 0) selection.push(key);
      this.setState({ selection });
    } else {
      let selection = [...this.state.selection];
      const keyIndex = selection.indexOf(key);
      // check to see if the key exists
      if (keyIndex >= 0) {
        // it does exist so we will remove it using destructing
        selection = [
          ...selection.slice(0, keyIndex),
          ...selection.slice(keyIndex + 1)
        ];
      } else {
        // it does not exist so add it
        selection.push(key);
      }
      // update the state
      this.setState({ selection });
    }
  };
  toggleAll = () => {
    /*
      'toggleAll' is a tricky concept with any filterable table
      do you just select ALL the records that are in your data?
      OR
      do you only select ALL the records that are in the current filtered data?

      The latter makes more sense because 'selection' is a visual thing for the user.
      This is especially true if you are going to implement a set of external functions
      that act on the selected information (you would not want to DELETE the wrong thing!).

      So, to that end, access to the internals of ReactTable are required to get what is
      currently visible in the table (either on the current page or any other page).

      The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
      ReactTable and then get the internal state and the 'sortedData'.
      That can then be iterrated to get all the currently visible records and set
      the selection state.
    */
    const selectAll = this.state.selectAll ? false : true;
    const selection = [];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.selectTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we need to get all the 'real' (original) records out to get at their IDs
      const nodes = getNodes(currentRecords);
      // we just push all the IDs onto the selection array
      nodes.forEach(item => {
        selection.push(item._id);
      });
    }
    this.setState({ selectAll, selection });
  };
  isSelected = key => {
    /*
      Instead of passing our external selection state we provide an 'isSelected'
      callback and detect the selection state ourselves. This allows any implementation
      for selection (either an array, object keys, or even a Javascript Set object).
    */
    return this.state.selection.includes(key);
  };
  logSelection = () => {
    console.log("selection:", this.state.selection);
  };
  toggleType = () => {
    this.setState({
      selectType: this.state.selectType === "radio" ? "checkbox" : "radio",
      selection: [],
      selectAll: false
    });
  };
  toggleTree = () => {
    if (this.state.pivotBy.length) {
      this.setState({ pivotBy: [], expanded: {} });
    } else {
      this.setState({ pivotBy: [], expanded: {} });
    }
  };
  onExpandedChange = expanded => {
    this.setState({ expanded });
  };

  render() {
    const {
      toggleSelection,
      toggleAll,
      isSelected,
      logSelection,
      toggleType,
      onExpandedChange,
      toggleTree
    } = this;
    const {
      data,
      columns,
      selectAll,
      selectType,
      pivotBy,
      expanded
    } = this.state;
    const extraProps = {
      selectAll,
      isSelected,
      toggleAll,
      toggleSelection,
      selectType,
      pivotBy,
      expanded,
      onExpandedChange
    };
    return (
      <div>
        {this.state.data ? (
          <SelectTreeTable
            data={this.state.data}
            columns={this.state.columns}
            defaultPageSize={this.state.data.length}
            ref={r => (this.selectTable = r)}
            className="-striped -highlight"
            freezWhenExpanded={false}
            showPagination={false}
            {...extraProps}
            SubComponent={row => {
              return (
                <div style={{ paddingLeft: "20px" }}>
                  <Studies
                    projectId={this.props.pid}
                    subjectId={row.original.displaySubjectID}
                  />
                </div>
              );
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default Subjects;
