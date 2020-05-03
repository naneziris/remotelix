import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import styled from 'styled-components';
import Head from 'next/head';

const SingleToolStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const SINGLE_TOOL_QUERY = gql`
  query SINGLE_TOOL_QUERY($id: ID!) {
    tool(where: { id: $id }) {
      id
      title
      description
      largeImage
      url
      category
    }
  }
`;
class SingleTool extends Component {
  render() {
    return (
      <Query
        query={SINGLE_TOOL_QUERY}
        variables={{
          id: this.props.id,
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.tool) return <p>No Tool Found for {this.props.id}</p>;
          const tool = data.tool;
          return (
            <SingleToolStyles>
              <Head>
                <title>Remotelix | {tool.title}</title>
              </Head>
              <img src={tool.largeImage} alt={tool.title} />
              <div className="details">
                <h2>Viewing {tool.title}</h2>
                <p>{tool.category}</p>
                <p>{tool.description}</p>
                <p>{tool.url}</p>
              </div>
            </SingleToolStyles>
          );
        }}
      </Query>
    );
  }
}

export default SingleTool;
export { SINGLE_TOOL_QUERY };
