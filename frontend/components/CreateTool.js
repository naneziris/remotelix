import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';

const CREATE_TOOL_MUTATION = gql`
  mutation CREATE_TOOL_MUTATION(
    $title: String!
    $description: String!
    $image: String
    $largeImage: String
    $url: String!
  ) {
    createTool(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      url: $url
    ) {
      id
    }
  }
`;

class CreateTool extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    url: '',
  };
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'remotelix');

    const res = await fetch('https://api.cloudinary.com/v1_1/remotelix/image/upload', {
      method: 'POST',
      body: data,
    });
    const file = await res.json();
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  };
  render() {
    return (
      <Mutation mutation={CREATE_TOOL_MUTATION} variables={this.state}>
        {(createTool, { loading, error }) => (
          <Form
            data-test="form"
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // call the mutation
              const res = await createTool();
              // change them to the single tool page
              console.log(res);
              Router.push({
                pathname: '/tool',
                query: { id: res.data.createTool.id },
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.uploadFile}
                />
                {this.state.image && (
                  <img width="200" src={this.state.image} alt="Upload Preview" />
                )}
              </label>

              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
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
                  value={this.state.description}
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
                  value={this.state.url}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateTool;
export { CREATE_TOOL_MUTATION };
