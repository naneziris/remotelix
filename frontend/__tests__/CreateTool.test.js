import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import Router from 'next/router';
import { MockedProvider } from 'react-apollo/test-utils';
import CreateTool, { CREATE_TOOL_MUTATION } from '../components/CreateTool';
import { fakeTool } from '../lib/testUtils';

const dogImage = 'https://dog.com/dog.jpg';

// mock the global fetch API
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [{ secure_url: dogImage }],
  }),
});

describe('<CreateTool/>', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateTool />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
  });

  it('uploads a file when changed', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateTool />
      </MockedProvider>
    );
    const input = wrapper.find('input[type="file"]');
    input.simulate('change', { target: { files: ['fakedog.jpg'] } });
    await wait();
    const component = wrapper.find('CreateTool').instance();
    expect(component.state.image).toEqual(dogImage);
    expect(component.state.largeImage).toEqual(dogImage);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch.mockReset();
  });

  it('handles state updating', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateTool />
      </MockedProvider>
    );
    wrapper.find('#title').simulate('change', { target: { value: 'Testing', name: 'title' } });
    wrapper
      .find('#description')
      .simulate('change', { target: { value: 'This is a really nice tool', name: 'description' } });

    expect(wrapper.find('CreateTool').instance().state).toMatchObject({
      title: 'Testing',
      description: 'This is a really nice tool',
    });
  });
  it('creates an tool when the form is submitted', async () => {
    const tool = fakeTool();
    const mocks = [
      {
        request: {
          query: CREATE_TOOL_MUTATION,
          variables: {
            title: tool.title,
            description: tool.description,
            image: '',
            largeImage: '',
            url: '',
          },
        },
        result: {
          data: {
            createTool: {
              ...fakeTool,
              id: 'abc123',
              __typename: 'Tool',
            },
          },
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateTool />
      </MockedProvider>
    );
    // simulate someone filling out the form
    wrapper.find('#title').simulate('change', { target: { value: tool.title, name: 'title' } });
    wrapper
      .find('#description')
      .simulate('change', { target: { value: tool.description, name: 'description' } });
    // mock the router
    Router.router = { push: jest.fn() };
    wrapper.find('form').simulate('submit');
    await wait(50);
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({ pathname: '/tool', query: { id: 'abc123' } });
  });
});
