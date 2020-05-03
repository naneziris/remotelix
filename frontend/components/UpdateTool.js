import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SINGLE_TOOL_QUERY = gql`
  query SINGLE_TOOL_QUERY($id: ID!) {
    tool(where: { id: $id }) {
      id
      title
      description
      url
      category
    }
  }
`;
const UPDATE_TOOL_MUTATION = gql`
  mutation UPDATE_TOOL_MUTATION($id: ID!, $title: String, $description: String, $url: String, $category: String) {
    updateTool(id: $id, title: $title, description: $description, url: $url, category: $category) {
      id
      title
      description
      url
      category
    }
  }
`;

class UpdateTool extends Component {
  state = {};
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };
  updateTool = async (e, updateToolMutation) => {
    e.preventDefault();
    const res = await updateToolMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
  };

  render() {
    return (
      <Query
        query={SINGLE_TOOL_QUERY}
        variables={{
          id: this.props.id,
        }}
      >
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.tool) return <p>No Tool Found for ID {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_TOOL_MUTATION} variables={this.state}>
              {(updateTool, { loading, error }) => (
                <Form onSubmit={e => this.updateTool(e, updateTool)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.tool.title}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="category">
                      Category
                      <input
                        type="text"
                        id="category"
                        name="category"
                        placeholder="Category"
                        required
                        defaultValue={data.tool.category}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="url">
                      Url
                      <input
                        type="text"
                        id="url"
                        name="url"
                        placeholder="Url"
                        required
                        defaultValue={data.tool.url}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="description">
                      Description
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter A Description"
                        required
                        defaultValue={data.tool.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateTool;
export { UPDATE_TOOL_MUTATION };
