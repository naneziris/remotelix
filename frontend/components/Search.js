import React from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_TOOLS_QUERY = gql`
  query SEARCH_TOOLS_QUERY($searchTerm: String!) {
    tools(where: { OR: [{ title_contains: $searchTerm }, { description_contains: $searchTerm }] }) {
      id
      image
      title
    }
  }
`;

function routeToTool(tool) {
  Router.push({
    pathname: '/tool',
    query: {
      id: tool.id,
    },
  });
}

class AutoComplete extends React.Component {
  state = {
    tools: [],
    loading: false,
  };
  onChange = debounce(async (e, client) => {
    // turn loading on
    this.setState({ loading: true });
    // Manually query apollo client
    const res = await client.query({
      query: SEARCH_TOOLS_QUERY,
      variables: { searchTerm: e.target.value },
    });
    this.setState({
      tools: res.data.tools,
      loading: false,
    });
  }, 350);
  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift onChange={routeToTool} itemToString={tool => (tool === null ? '' : tool.title)}>
          {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <>
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search For An Tool',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist();
                        this.onChange(e, client);
                      },
                    })}
                  />
                  </>
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.tools.map((tool, index) => (
                    <DropDownItem
                      {...getItemProps({ item: tool })}
                      key={tool.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={tool.image} alt={tool.title} />
                      {tool.title}
                    </DropDownItem>
                  ))}
                  {!this.state.tools.length &&
                    !this.state.loading && <DropDownItem> Nothing Found {inputValue}</DropDownItem>}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
