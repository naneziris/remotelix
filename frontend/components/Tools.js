import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Tool from './Tool';
import Pagination from './Pagination';
import { perPage } from '../config';

const ALL_TOOLS_QUERY = gql`
  query ALL_TOOLS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    tools(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      description
      image
      largeImage
      url
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ToolsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Tools extends Component {
  render() {
    return (
      <Center>
        <Pagination page={this.props.page} />
        <Query
          query={ALL_TOOLS_QUERY}
          // fetchPolicy="network-only"
          variables={{
            skip: this.props.page * perPage - perPage,
          }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              <ToolsList>{data.tools.map(tool => <Tool tool={tool} key={tool.id} />)}</ToolsList>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}

export default Tools;
export { ALL_TOOLS_QUERY };
