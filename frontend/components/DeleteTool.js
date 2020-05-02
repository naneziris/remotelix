import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_TOOLS_QUERY } from './Tools';

const DELETE_TOOL_MUTATION = gql`
  mutation DELETE_TOOL_MUTATION($id: ID!) {
    deleteTool(id: $id) {
      id
    }
  }
`;

class DeleteTool extends Component {
  update = (cache, payload) => {
    // manually update the cache on the client, so it matches the server
    // 1. Read the cache for the tools we want
    const data = cache.readQuery({ query: ALL_TOOLS_QUERY });
    // 2. Filter the deleted tool out of the page
    data.tools = data.tools.filter(tool => tool.id !== payload.data.deleteTool.id);
    // 3. Put the tools back!
    cache.writeQuery({ query: ALL_TOOLS_QUERY, data });
  };
  render() {
    return (
      <Mutation
        mutation={DELETE_TOOL_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteTool, { error }) => (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this tool?')) {
                deleteTool().catch(err => {
                  alert(err.message);
                });
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteTool;
