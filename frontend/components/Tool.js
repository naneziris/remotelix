import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Title from './styles/Title';
import ToolStyles from './styles/ToolStyles';
import DeleteTool from './DeleteTool';
import User from './User';

export default class Tool extends Component {
  static propTypes = {
    tool: PropTypes.object.isRequired,
  };

  render() {
    const { tool } = this.props;
    return (
      <User>
        {({ data }) => {
          const me = data ? data.me : null
          return (
            <ToolStyles>
              {tool.image && <img src={tool.image} alt={tool.title} />}

              <Title>
                <Link
                  href={{
                    pathname: '/tool',
                    query: { id: tool.id },
                  }}
                >
                  <a>{tool.title}</a>
                </Link>
              </Title>
              <p>{tool.category}</p>
              <p>{tool.description}</p>
              <p>{tool.url}</p>
              {me?.id &&
                <div className="buttonList">
                  <Link
                    href={{
                      pathname: 'update',
                      query: { id: tool.id },
                    }}
                  >
                    <a>Edit ✏️</a>
                  </Link>
                  <DeleteTool id={tool.id}>Delete This Tool</DeleteTool>
                </div>
              }
            </ToolStyles>
          )}
        }
      </User>
    );
  }
}
